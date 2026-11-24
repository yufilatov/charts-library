import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { XAxisChartService } from './x-axis.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-x-axis',
    template: '',
    providers: [
        XAxisChartService,
        ChartDisposable,
    ],
})
export class XAxisChartComponent {
    range = input<any[]>();
    style = input(new ChartStyleBuilder());
    ticks = input<number[]>([]);

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(XAxisChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate(): void {
        this.seriesService.setState({
            range: this.range(),
            style: this.style(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
            ticks: this.ticks(),
        });
    }
}
