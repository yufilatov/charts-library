import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output } from '@angular/core';
import { MapSeriesChartService } from './map-series.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';

@Component({
    selector: 'app-chart-series[type="map"]',
    templateUrl: './map-series.component.html',
    styleUrls: ['./map-series.component.scss'],
    providers: [
        MapSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class MapSeriesChartComponent {
    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();

    @Output() get onHover() {
        return this.seriesService.mouseover;
    }

    @Output() get onLeave() {
        return this.seriesService.mouseleave;
    }

    constructor(
        private chart: ChartComponent,
        private seriesService: MapSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data,
            style: this.style,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }
}
