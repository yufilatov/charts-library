import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { CircularPackageSeriesService } from './circular-package-series.service';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';

@Component({
    selector: 'app-chart-series[type="circular-package"]',
    template: '',
    providers: [CircularPackageSeriesService, ChartDisposable],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CircularPackageSeriesChartComponent {
    data = input<any>();
    style = input(new ChartStyleBuilder());

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(CircularPackageSeriesService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data() || [],
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
