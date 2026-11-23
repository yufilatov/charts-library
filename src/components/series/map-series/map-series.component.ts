import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class MapSeriesChartComponent implements OnChanges {
    @Input() data: any;
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

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data || changes.style) {
            this.invalidate();
        }
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
