import { Component, Output, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
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
})
export class BarSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    range = input<{ x: number[], y: number[] }>({ x: [0, 100], y: [0, 100] });
    total = input(100);
    animation = input(false);
    orientation = input<'vertical' | 'horizontal'>('vertical');

    @Output() get selectionChange() {
        return this.orientation() === 'vertical' ?
            this.seriesServiceVertical.selectionChange : this.seriesServiceHorizontal.selectionChange;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesServiceVertical = inject(BarVerticalSeriesChartService);
    private readonly seriesServiceHorizontal = inject(BarHorizontalSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate(this.data()));
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate(this.data()));

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate(d: any): void {
        const service = this.orientation() === 'vertical' ? this.seriesServiceVertical : this.seriesServiceHorizontal;

        const state = service.setState({
            data: this.data() || [],
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
            range: this.range(),
            total: this.total(),
            animation: this.animation(),
        });

        this.chart.addSeries(state);
        this.disposable.add(() => this.chart.removeSeries(state));
    }
}
