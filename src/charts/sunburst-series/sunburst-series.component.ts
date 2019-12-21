import { Component, OnInit, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';
import { ChartComponent } from '../chart/chart.component';
import { ChartSunburstSeriesService } from './sunburst-series.service';

@Component({
    selector: 'app-chart-series[type="sunburst"]',
    templateUrl: './sunburst-series.component.html',
    styleUrls: ['./sunburst-series.component.scss'],
    providers: [
        ChartSunburstSeriesService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SunburstSeriesChartComponent implements OnChanges {

    private disposable = new ChartDisposable();

    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() rings = 2;

    @Output() get selectionChange() {
        return this.seriesService.selectionChange;
    }

    @Input() set selection(value: any[]) {
        this.seriesService.selection = value;
    }

    get selection() {
        return this.seriesService.selection;
    }

    constructor(private chart: ChartComponent, private seriesService: ChartSunburstSeriesService) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('data' in changes) {
            this.invalidate();
        }
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data,
            style: this.style,
            rings: this.rings,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }

}
