import { Injectable, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { nextId, getLineCurve } from '../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../common/chart-series';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartService } from '../chart/chart.service';
import { ChartStyle } from '../chart-style/chart-style';

export interface IChartAreaSeriesState extends IChartSeriesState {
    curveType?: string;
    range?: { x: number[], y: number[] }
}

const DEFAULT_STATE: IChartAreaSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class ChartAreaSeriesService implements OnDestroy {

    private disposable = new ChartDisposable();
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-area-${nextId()}`,
    };

    constructor(private chartService: ChartService) {
        const selector = { id: 'chart-series-area', level: 0 };
        this.root = chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartAreaSeriesState): IChartAreaSeriesState {
        this.state = {
            ...this.state,
            ...state,
        }

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

        this.root
            .append('path')
            .datum(data)
            .attr('d', line)
            .classed('line', true)
            .attr('fill', (d, i) => lineStyle(d, i).fill)
            .attr('stroke', (d, i) => lineStyle(d, i).stroke)
            .attr('stroke-width', (d, i) => lineStyle(d, i).strokeWidth);

        return this.state;
    }

    ngOnDestroy() {
        this.disposable.finalize();
    }
}
