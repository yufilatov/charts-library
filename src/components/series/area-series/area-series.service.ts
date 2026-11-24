import * as d3 from 'd3';
import { Injectable, inject } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartService } from 'src/components/chart/chart.service';
import { ChartDisposable } from 'src/components/common/chart-disposable';
import { ChartDrawFactory } from 'src/components/common/chart-draw.factory';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from 'src/components/common/chart-series';
import { nextId, getLineCurve } from 'src/components/kit';
// import { nextId, getLineCurve } from '../kit';
// import { ChartService } from '../chart/chart.service';
// import { ChartStyle } from '../chart-style/chart-style';
// import { ChartDisposable } from '../common/chart-disposable';
// import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../common/chart-series';
// import { ChartDrawFactory } from '../common/chart-draw.factory';

export interface IChartAreaSeriesState extends IChartSeriesState {
    curveType?: string;
    range?: { x: number[], y: number[] };
}

const DEFAULT_STATE: IChartAreaSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class AreaSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-area-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartAreaSeriesState): IChartAreaSeriesState {
        this.state = {
            ...this.state,
            ...state,
        };

        const { data, style, rect, curveType, range } = this.state;

        if (!rect.height || !rect.width) {
            return this.state;
        }

        const scaleX = createScaleX('linear', {
            ...state as IChartSeriesState,
            data: [d3.min(range.x), d3.max(range.x)],
        });

        const scaleY = createScaleY('linear', {
            ...state as IChartSeriesState,
            data: [d3.max(range.y), d3.min(range.y)],
        });

        this.state = {
            ...this.state,
            ...state,
            scaleX,
            scaleY,
        };

        const line = d3.area()
            .x(d => scaleX(d[0]))
            .y(d => scaleY(0))
            .y1(d => scaleY(d[1]))
            .curve(getLineCurve(curveType));

        const lineStyle = style.compile(ChartStyle.line);
        const circleStyle = style.compile(ChartStyle.circle);

        this.root.selectAll('path').remove();
        this.root.selectAll('circle').remove();

        const drawArea = ChartDrawFactory(this.root, [data]);
        const drawPoints = ChartDrawFactory(this.root, data);

        drawArea('.chart-line-area', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', line)
                    .classed('line', true)
                    .attr('fill', (d, i) => lineStyle(d, i).fill)
                    .attr('stroke', (d, i) => lineStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth),
        });

        drawPoints('.chart-line-point', {
            create: selection =>
                selection
                    .append('circle'),
            update: selection =>
                selection
                    .attr('cx', (d, i) => scaleX(d[0]))
                    .attr('cy', d => scaleY(d[1]))
                    .attr('r', (d, i) => circleStyle(d, i).radius)
                    .attr('fill', (d, i) => circleStyle(d, i).fill)
                    .attr('stroke', (d, i) => circleStyle(d, i).stroke)
                    .attr('stroke-width', (d, i) => circleStyle(d, i).strokeWidth)
                    .on('mouseover', (d, i) => {
                        this.root.selectAll('.circle').filter(n => n === d);
                    }),
        });

        return this.state;
    }
}
