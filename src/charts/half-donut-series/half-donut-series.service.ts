import { Injectable, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { nextId } from '../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../common/chart-series';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartService } from '../chart/chart.service';
import { ChartStyle } from '../chart-style/chart-style';
import { ChartDrawFactory } from '../common/chart-draw.factory';

export interface IChartHalfDonutSeriesState extends IChartSeriesState {
    total?: number;
}

const DEFAULT_STATE: IChartHalfDonutSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class ChartHalfDonutSeriesService implements OnDestroy {

    private disposable = new ChartDisposable();
    private root: d3.Selection<SVGElement, string, SVGElement, number>;

    constructor(private chartService: ChartService) {
        const selector = { id: `chart-series-pie-${nextId()}`, level: 0 };
        this.root = chartService.select(selector);

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

    setState(state: IChartHalfDonutSeriesState) {
        const { rect, data, style, total } = state;

        if (!rect.height || !rect.width) {
            return;
        }

        const values = this.checkSum(data, total);
        const anglesRange = 0.5 * Math.PI;
        const datum = d3.pie()
            .sort(null)
            .startAngle(anglesRange * -1)
            .endAngle(anglesRange)(values);

        const arcStyle = style.compile(ChartStyle.arc);
        const pieStyle = style.compile(ChartStyle.pie);

        const arc = d3.arc()
            .innerRadius(rect.width / 2 * pieStyle(null, 0).innerRadius / 100)
            .outerRadius(rect.width / 2 * pieStyle(null, 0).outerRadius / 100);

        const draw = ChartDrawFactory<number>(this.root, datum);

        draw('.chart-donut-arc', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', d => arc(d))
                    .attr('transform', `translate(${rect.width / 2}, ${rect.height})`)
                    .style('stroke', (d, i) => arcStyle(d, i).stroke)
                    .style('stroke-width', (d, i) => arcStyle(d, i).strokeWidth)
                    .style('fill', (d, i) => arcStyle(d, i).fill),
        });

    }

    ngOnDestroy() {
        this.disposable.finalize();
    }
}
