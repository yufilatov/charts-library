import { ChangeDetectionStrategy, Component, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { ChordSeriesChartService } from './chord-series.service';

@Component({
    selector: 'app-chart-series[type="chord"]',
    template: '',
    providers: [ChordSeriesChartService, ChartDisposable],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ChordSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(ChordSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
