import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
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
export class BarProgressSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    label = input<'start' | 'end' | 'none'>('none');
    labelEnd = input(false);
    labelSpaceX = input(30);
    offsetLeft = input(220);
    total = input(100);
    animation = input(false);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(BarProgressSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());

        effect(() => {
            this.recalculateMargins();
            this.invalidate();
        });
    }

    private recalculateMargins() {
        const left = this.offsetLeft() + (this.label() === 'end' ? 0 : this.labelSpaceX());
        const right = this.label() === 'end' ? this.labelSpaceX() : 0;
        this.chart.setMargin({
            left,
            right,
            top: 8,
            bottom: 0,
        });
    }

    private invalidate() {
        const state = this.seriesService.setState({
            data: this.data() || [],
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
            label: this.label(),
            total: this.total(),
            animation: this.animation(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
