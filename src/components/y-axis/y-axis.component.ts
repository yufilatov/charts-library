import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { YAxisChartService } from './y-axis.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-y-axis',
    template: '',
    styleUrls: [],
    providers: [
        YAxisChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class YAxisChartComponent {
    range = input<any[]>();
    ticks = input<number[]>([]);
    style = input(new ChartStyleBuilder());
    reverse = input(false);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(YAxisChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        const state = this.seriesService.setState({
            range: this.range(),
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
            ticks: this.ticks(),
            reverse: this.reverse(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
