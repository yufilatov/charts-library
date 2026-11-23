import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { ChartDisposable } from 'src/components/common/chart-disposable';
import { AreaSeriesChartService } from './area-series.service';

export interface Point {
    x: number;
    y: number;
}
@Component({
    selector: 'app-chart-series[type="area"]',
    template: '',
    styleUrls: [],
    providers: [
        AreaSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AreaSeriesChartComponent implements OnChanges {
    @Input() curveType = 'curveMonotoneX';
    @Input() data: Point[];
    @Input() range: { x: number[], y: number[] } = { x: [], y: [] };
    @Input() style = new ChartStyleBuilder();

    constructor(
        private chart: ChartComponent,
        private disposable: ChartDisposable,
        private seriesService: AreaSeriesChartService,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data || [],
            style: this.style,
            range: this.range,
            curveType: this.curveType,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
