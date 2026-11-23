import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';
import { BarProgressSeriesChartService } from './bar-progress-series.service';

@Component({
    selector: 'app-chart-series[type="bar-progress"]',
    templateUrl: './bar-progress-series.component.html',
    styleUrls: ['./bar-progress-series.component.scss'],
    providers: [
        BarProgressSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class BarProgressSeriesChartComponent implements OnChanges {
    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() label: 'start' | 'end' | 'none' = 'none';
    @Input() labelEnd = false;
    @Input() labelSpaceX = 30;
    @Input() offsetLeft = 220;
    @Input() total = 100;
    @Input() animation = false;

    constructor(
        private chart: ChartComponent,
        private seriesService: BarProgressSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());

        this.recalculateMargins();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.offsetLeft || changes.labelSpaceX || changes.labelEnd) {
            this.recalculateMargins();
        }
        this.invalidate();
    }

    private recalculateMargins() {
        const left = this.offsetLeft + (this.label === 'end' ? 0 : this.labelSpaceX);
        const right = this.label === 'end' ? this.labelSpaceX : 0;
        this.chart.margin = {
            left,
            right,
            top: 8,
            bottom: 0,
        };
    }

    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data || [],
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
            label: this.label,
            total: this.total,
            animation: this.animation,
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
