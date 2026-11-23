import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import { YAxisChartService } from './y-axis.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-y-axis',
    template: '',
    styleUrls: [],
    providers: [
        YAxisChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class YAxisChartComponent implements OnChanges {
    @Input() range: any[];
    @Input() ticks: number[] = [];
    @Input() style = new ChartStyleBuilder();
    @Input() reverse = false;

    constructor(
        private chart: ChartComponent,
        private seriesService: YAxisChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.margin) {
            this.invalidate();
        }
    }

    private invalidate() {
        const state = this.seriesService.setState({
            range: this.range,
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
            ticks: this.ticks,
            reverse: this.reverse,
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
