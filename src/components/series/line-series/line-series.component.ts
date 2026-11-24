import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, effect, inject } from '@angular/core';
import { LineSeriesChartService } from './line-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="line"]',
    template: '',
    styleUrls: ['./line-series.component.scss'],
    providers: [
        LineSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line:use-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class LineSeriesChartComponent {
    data = input<any[]>();
    range = input<{ x: number[], y: number[] }>({ x: [], y: [] });
    style = input(new ChartStyleBuilder());
    curveType = input('curveLinear');

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(LineSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }


    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            range: this.range(),
            style: this.style(),
            curveType: this.curveType(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
