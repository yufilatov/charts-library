import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import { XAxisChartService } from './x-axis.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-x-axis',
    template: '',
    styleUrls: [],
    providers: [
        XAxisChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class XAxisChartComponent implements OnChanges {
    @Input() range: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() ticks: number[] = [];

    constructor(
        private chart: ChartComponent,
        private seriesService: XAxisChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.range) {
            this.invalidate();
        }
    }

    private invalidate() {
        this.seriesService.setState({
            range: this.range,
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
            ticks: this.ticks,
        });
    }
}
