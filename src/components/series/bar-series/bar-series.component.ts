import { Component, Input, SimpleChanges, OnChanges, Output, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChartDisposable } from '../../common/chart-disposable';
import { BarVerticalSeriesChartService } from './bar-series-vertical.service';
import { BarHorizontalSeriesChartService } from './bar-series-horizontal.service';
@Component({
    selector: 'app-chart-series[type="bar"]',
    templateUrl: './bar-series.component.html',
    styleUrls: ['./bar-series.component.scss'],
    providers: [
        ChartDisposable,
        BarVerticalSeriesChartService,
        BarHorizontalSeriesChartService,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class BarSeriesChartComponent implements OnChanges {
    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() range: { x: number[], y: number[] } = { x: [0, 100], y: [0, 100] };
    @Input() total = 100;
    @Input() animation = false;
    @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

    @Output() get selectionChange() {
        return this.orientation === 'vertical' ?
            this.seriesServiceVertical.selectionChange : this.seriesServiceHorizontal.selectionChange;
    }

    constructor(
        private chart: ChartComponent,
        private seriesServiceVertical: BarVerticalSeriesChartService,
        private seriesServiceHorizontal: BarHorizontalSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.margin || changes.data || changes.orientation) {
            this.invalidate();
        }
    }

    private invalidate() {
        const service = this.orientation === 'vertical' ? this.seriesServiceVertical : this.seriesServiceHorizontal;

        const state = service.setState({
            data: this.data || [],
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
            range: this.range,
            total: this.total,
            animation: this.animation,
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
