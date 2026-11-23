import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { WordCloudSeriesService } from './word-cloud-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';

@Component({
    selector: 'app-chart-series[type="word-cloud"]',
    templateUrl: './word-cloud-series.component.html',
    styleUrls: ['./word-cloud-series.component.scss'],
    providers: [
        WordCloudSeriesService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class WordCloudSeriesChartComponent implements OnChanges {
    @Input() data: any;
    @Input() style = new ChartStyleBuilder();

    constructor(
        private chart: ChartComponent,
        private seriesService: WordCloudSeriesService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        this.invalidate();
    }

    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data || [],
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
