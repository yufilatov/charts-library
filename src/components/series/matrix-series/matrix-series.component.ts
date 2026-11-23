import { Component, OnChanges, Input, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { IChartMatrixOrderType, MatrixSeriesChartService } from './matrix-series.service';

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
export class MatrixSeriesChartComponent implements OnChanges {
    @Input() data: { nodes: any[], links: any[] };
    @Input() style = new ChartStyleBuilder();
    @Input() labelOffset = 100;

    @Output() get onOrderChange() {
        return this.seriesService.onOrderChange;
    }

    @Input() set order(value: IChartMatrixOrderType) {
        this.seriesService.order = value;
    }

    get order() {
        return this.seriesService.order;
    }

    constructor(
        private chart: ChartComponent,
        private seriesService: MatrixSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            this.invalidate();
        }
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data,
            labelOffset: this.labelOffset,
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }
}
