import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
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
export class LineSeriesChartComponent implements OnChanges {
    @Input() data: any[];
    @Input() range: { x: number[], y: number[] } = { x: [], y: [] };
    @Input() style = new ChartStyleBuilder();
    @Input() curveType = 'curveLinear';

    constructor(
        private chart: ChartComponent,
        private seriesService: LineSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        this.invalidate();
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data,
            range: this.range,
            style: this.style,
            curveType: this.curveType,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }
}
