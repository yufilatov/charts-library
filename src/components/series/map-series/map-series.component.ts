import { Component, ChangeDetectionStrategy, ViewEncapsulation, Output, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartComponent } from '../../chart/chart.component';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { MapSeriesChartService } from './map-series.service';

@Component({
    selector: 'app-chart-series[type="map"]',
    template: '',
    styleUrls: [],
    providers: [
        MapSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSeriesChartComponent {
    data = input<any>();
    style = input(new ChartStyleBuilder());

    @Output() get onHover() {
        return this.seriesService.mouseover;
    }

    @Output() get onLeave() {
        return this.seriesService.mouseleave;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(MapSeriesChartService);
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
