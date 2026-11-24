import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, effect, inject } from '@angular/core';
import { IcicleSeriesChartService } from './icicle-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="icicle"]',
    template: '',
    styleUrls: ['./icicle-series.component.scss'],
    providers: [
        IcicleSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line:use-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class IcicleSeriesChartComponent {
    data = input<any>();
    style = input(new ChartStyleBuilder());
    total = input<number>();

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(IcicleSeriesChartService);
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
            total: this.total(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
