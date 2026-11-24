import * as d3 from 'd3';
import { Injectable, inject } from '@angular/core';
import { nextId } from '../../kit';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartStyle } from '../../chart-style/chart-style';

export interface IChartGridSeriesState extends IChartSeriesState {
    step?: { x: number, y: number };
    range?: { x: number[], y: number[] };
}

const DEFAULT_STATE: IChartGridSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class GridSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-grid-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartGridSeriesState): IChartGridSeriesState {
        this.state = {
            ...this.state,
            ...state,
        };

        const { style, rect, range, step } = this.state;

        if (!rect.height || !rect.width) {
            return this.state;
        }

        const scaleX = createScaleX('linear', {
            ...state as IChartSeriesState,
            data: range.x,
        });

        const scaleY = createScaleY('linear', {
            ...state as IChartSeriesState,
            data: range.y,
        });

        this.root.selectAll('path').remove();

        const line = d3.line()
            .x(d => scaleX(d[0]))
            .y(d => scaleY(d[1]));

        const lineStyle = style.compile(ChartStyle.line);

        const maxX = d3.max(range.x);
        const maxY = d3.max(range.y);

        if (step.x !== 0) {
            for (let j = step.x; j < maxX; j += step.x) {
                this.root
                    .append('path')
                    .datum([[j, d3.min(range.y)], [j, d3.max(range.y)]])
                    .attr('d', line)
                    .attr('id', nextId())
                    .classed('line', true)
                    .attr('fill', 'none')
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth)
                    .attr('stroke-dasharray', (d, i) => lineStyle(d, i).strokeDasharray);
            }
        }

        if (step.y !== 0) {
            for (let j = step.y; j < maxY; j += step.y) {
                this.root
                    .append('path')
                    .datum([[d3.min(range.x), j], [d3.max(range.x), j]])
                    .attr('d', line)
                    .attr('id', nextId())
                    .classed('line', true)
                    .attr('fill', 'none')
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth)
                    .attr('stroke-dasharray', (d, i) => lineStyle(d, i).strokeDasharray);
            }
        }

        return this.state;
    }
}
