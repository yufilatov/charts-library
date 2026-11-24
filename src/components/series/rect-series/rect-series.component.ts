import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { RectSeriesChartService } from './rect-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="rect"]',
    template: '',
    providers: [
        RectSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class RectSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    total = input<number>();
    range = input<{ x: number[], y: number[] }>();

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(RectSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
            range: this.range(),
        });
    }
}
