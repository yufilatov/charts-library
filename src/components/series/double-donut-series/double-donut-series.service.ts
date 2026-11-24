import { Injectable, inject } from '@angular/core';
import * as d3 from 'd3';
import { nextId } from '../../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../../components/common/chart-series';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../../components/common/chart-draw.factory';

export interface IChartDoubleDonutSeriesState extends IChartSeriesState {
    total?: number;
}

const DEFAULT_STATE: IChartDoubleDonutSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class DoubleDonutSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-pie-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    checkSum(data, total) {
        let values = data;
        const sum = values.reduce((a, b) => a + b);

        if (sum < total) {
            values = values.concat(total - sum);
        }

        return values;
    }

    setState(state: IChartDoubleDonutSeriesState) {
        const { rect, data, style, total } = state;

        if (!rect.height || !rect.width) {
            return;
        }

        const values1 = this.checkSum(data[0], total);
        const values2 = this.checkSum(data[1], total);
        const datum1 = d3.pie()
            .sort(null)(values1);

        const datum2 = d3.pie()
            .sort(null)(values2);

        const arcStyle1 = style.compile(ChartStyle.arc);
        const arcStyle2 = style.compile(ChartStyle.arc);
        const pieStyle = style.compile(ChartStyle.pie);

        const arc1 = d3.arc()
            .innerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100)
            .outerRadius(rect.height / 2 * pieStyle(null, 0).outerRadius / 100);

        const arc2 = d3.arc()
            .innerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100 / 2)
            .outerRadius(rect.height / 2 * pieStyle(null, 0).innerRadius / 100);

        const draw1 = ChartDrawFactory<number>(this.root, datum1);
        const draw2 = ChartDrawFactory<number>(this.root, datum2);

        draw1('.chart-donut-arc-outer', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', d => arc1(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`)
                    .style('stroke', (d, i) => arcStyle1(d, i).stroke)
                    .style('stroke-width', (d, i) => arcStyle1(d, i).strokeWidth)
                    .style('fill', (d, i) => arcStyle1(d, i).fill),
        });

        draw2('.chart-donut-arc-inner', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', d => arc2(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`)
                    .style('stroke', (d, i) => arcStyle2(d, i).stroke)
                    .style('stroke-width', (d, i) => arcStyle2(d, i).strokeWidth)
                    .style('fill', (d, i) => arcStyle2(d, i).fill),
        });

    }
}
