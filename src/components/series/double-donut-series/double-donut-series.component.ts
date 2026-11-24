import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { DoubleDonutSeriesChartService } from './double-donut-series.service';

@Component({
    selector: 'app-chart-series[type="double-donut"]',
    template: '',
    styleUrls: [],
    providers: [
        DoubleDonutSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DoubleDonutSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    total = input<number>();

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(DoubleDonutSeriesChartService);
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
        });
    }
}
