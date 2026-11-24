import { Component, Output, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartMatrixOrderType, MatrixSeriesChartService } from './matrix-series.service';

@Component({
    selector: 'app-chart-series[type="matrix"]',
    template: '',
    styleUrls: [],
    providers: [
        MatrixSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class MatrixSeriesChartComponent {
    data = input<{ nodes: any[], links: any[] }>();
    style = input(new ChartStyleBuilder());
    labelOffset = input(100);
    order = input<ChartMatrixOrderType>();

    @Output() get onOrderChange() {
        return this.seriesService.onOrderChange;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(MatrixSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());

        effect(() => {
            const value = this.order();
            if (value !== undefined) {
                this.seriesService.order = value;
            }
        });
        effect(() => this.invalidate());
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            labelOffset: this.labelOffset(),
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
