import { Injectable, inject } from '@angular/core';
import * as d3 from 'd3';
import { nextId } from '../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleY } from '../common/chart-series';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartService } from '../chart/chart.service';
export interface IChartYAxisState extends IChartSeriesState {
    range?: number[];
    ticks?: number[];
    reverse?: boolean;
}

const DEFAULT_STATE: IChartYAxisState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class YAxisChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-y-axis-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartYAxisState): IChartYAxisState {
        this.state = {
            ...this.state,
            ...state,
        };
        const { rect, range, margin, ticks, reverse } = this.state;

        if (!rect.height || !rect.width) {
            return this.state;
        }

        this.root.selectAll('.axis').remove();

        const scaleY = d3
            .scaleLinear()
            .domain([range[0], range[1]])
            .range(reverse
                ? [margin.top, rect.height + margin.top]
                : [rect.height + margin.top, margin.top]);

        const y = d3.axisLeft()
            .scale(scaleY)
            .tickSizeOuter(0)
            .tickValues(ticks);

        this.root
            .append('g')
            .classed('axis', true)
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(y);

        return this.state;
    }
}
