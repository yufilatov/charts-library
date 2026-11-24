import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { GridSeriesChartService } from './grid-series.service';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';

export interface Range { x: [number, number], y: [number, number] }

@Component({
    selector: 'app-chart-series[type="grid"]',
    templateUrl: './grid-series.component.html',
    styleUrls: ['./grid-series.component.scss'],
    providers: [
        GridSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class GridSeriesChartComponent {
    step = input<{ x: number, y: number }>({ x: 5, y: 1 });
    range = input<Range>();
    style = input(new ChartStyleBuilder());

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(GridSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        const state = this.seriesService.setState({
            step: this.step(),
            style: this.style(),
            range: this.range(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
