import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DonutSeriesChartComponent {
    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() total: number;

    constructor(
        private chart: ChartComponent,
        private seriesService: DonutSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    private invalidate(): void {
        this.seriesService.setState({
            data: this.data,
            style: this.style,
            total: this.total,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }
}
