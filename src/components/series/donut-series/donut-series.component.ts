import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { DonutSeriesChartService } from './donut-series.service';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../../components/common/chart-disposable';

@Component({
    selector: 'app-chart-series[type="donut"]',
    template: '',
    styleUrls: [],
    providers: [
        ChartDisposable,
        DonutSeriesChartService,
    ],
})
export class DonutSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    total = input<number>();

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(DonutSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    private invalidate(): void {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            total: this.total(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
