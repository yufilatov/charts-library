import { Injectable, inject } from '@angular/core';
import { nextId, getLineCurve } from '../../kit';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { IChartPieSeriesState } from '../../../components/series/line-series/line-series.service';
import { createScaleX, IChartSeriesState, createScaleY, CHART_DEFAULT_SERIES_STATE } from '../../../components/common/chart-series';
import { ChartDrawFactory } from '../../../components/common/chart-draw.factory';
import * as d3 from 'd3';

const DEFAULT_STATE: IChartSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class CircularPackageSeriesService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-circular-package-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartPieSeriesState) {
        this.state = {
            ...this.state,
            ...state,
        };

        const { style, rect, data } = this.state;

        if (!rect.height || !rect.width) {
            return this.state;
        }

        this.root.selectAll('circle').remove();

        const datum = data;

        const color = d3.scaleOrdinal()
            .domain(['Asia', 'Europe', 'Africa', 'Oceania', 'Americas'])
            .range(d3.schemeSet1);

        const size = d3.scaleLinear()
            .domain([0, 1400000000])
            .range([10, 50]);

        const simulation = d3.forceSimulation()
            .force('center', d3
                .forceCenter()
                .x(rect.width / 2)
                .y(rect.height / 2))
            .force('charge', d3
                .forceManyBody()
                .strength(.1))
            .force('collide', d3
                .forceCollide()
                .strength(.2)
                .radius(d => (size(d.value) + 2.5))
                .iterations(2));

        const dragStarted = (event, d) => {
            if (!event.active) {
                simulation.alphaTarget(.03).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragEnded = (event, d) => {
            if (!event.active) {
                simulation.alphaTarget(.03);
            }
            d.fx = null;
            d.fy = null;
        };

        const draw = ChartDrawFactory(this.root, datum);
        draw('.chart-circular-package-circle', {
            create: selection =>
                selection
                    .append('circle'),
            update: selection =>
                selection
                    .attr('class', 'node')
                    .attr('r', d => size(d.value))
                    .attr('cx', rect.width / 2)
                    .attr('cy', rect.height / 2)
                    .style('fill', d => color(d.region))
                    .style('fill-opacity', 0.8)
                    .attr('stroke', 'black')
                    .style('stroke-width', 1)
                    .call(d3.drag()
                        .on('start', dragStarted)
                        .on('drag', dragged)
                        .on('end', dragEnded)),
        });

        simulation
            .nodes(datum)
            .on('tick', () => {
                this.root.selectAll('.node')
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            });

        return this.state;
    }
}
