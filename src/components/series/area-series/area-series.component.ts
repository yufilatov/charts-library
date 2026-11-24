import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { ChartDisposable } from 'src/components/common/chart-disposable';
import { AreaSeriesChartService } from './area-series.service';

export interface Point {
    x: number;
    y: number;
}
@Component({
    selector: 'app-chart-series[type="area"]',
    template: '',
    styleUrls: [],
    providers: [
        AreaSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AreaSeriesChartComponent {
    curveType = input('curveMonotoneX');
    data = input<Point[]>();
    range = input<{ x: number[], y: number[] }>({ x: [], y: [] });
    style = input(new ChartStyleBuilder());

    private readonly chart = inject(ChartComponent);
    private readonly disposable = inject(ChartDisposable);
    private readonly seriesService = inject(AreaSeriesChartService);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data() || [],
            style: this.style(),
            range: this.range(),
            curveType: this.curveType(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
