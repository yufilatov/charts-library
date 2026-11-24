import { Injectable, inject } from '@angular/core';
import { nextId, getLineCurve } from '../../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import * as d3 from 'd3';

export interface IChartPieSeriesState extends IChartSeriesState {
    range?: { x: number[], y: number[] };
    curveType?: string;
}

const DEFAULT_STATE: IChartPieSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class LineSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-line-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartPieSeriesState) {
        const { rect, data, style, curveType, range } = state;

        this.root.selectAll('path').remove();
        this.root.selectAll('circle').remove();

        if (!rect.height || !rect.width || !data || !data.length) {
            return;
        }

        const scaleX = createScaleX('linear', {
            ...state as IChartSeriesState,
            data: !range.x.length ? [0, data.length - 1] : range.x,
        });

        const scaleY = createScaleY('linear', {
            ...state as IChartSeriesState,
            data: !range.y.length ? [d3.max(data), d3.min(data)] : [d3.max(range.y), d3.min(range.y)],
        });

        const line = d3.line()
            .x(d => scaleX(d[0]))
            .y(d => scaleY(d[1]))
            .curve(getLineCurve(curveType));

        const lineStyle = style.compile(ChartStyle.line);
        const circleStyle = style.compile(ChartStyle.circle);

        const draw = ChartDrawFactory(this.root, data);

        this.root
            .append('path')
            .datum(data)
            .attr('d', line)
            .classed('line', true)
            .attr('fill', 'none')
            .attr('stroke', (d, i) => lineStyle(d, i).stroke)
            .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth);

        draw('.chart-line-point', {
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
                    .on('mouseover', (d, i) => {
                        this.root.selectAll('.circle').filter(n => n === d);
                    }),
        });

    }
}
