import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
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
export class WordCloudSeriesChartComponent {
    data = input<any>();
    style = input(new ChartStyleBuilder());

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(WordCloudSeriesService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data() || [],
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
