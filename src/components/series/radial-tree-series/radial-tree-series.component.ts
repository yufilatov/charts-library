import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, Input, Output } from '@angular/core';
import { RadialTreeSeriesChartService } from './radial-tree-series.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';

@Component({
    selector: 'app-chart-series[type="radial-tree"]',
    template: '',
    styleUrls: ['./radial-tree-series.component.scss'],
    providers: [
        RadialTreeSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line:use-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class RadialTreeSeriesChartComponent implements OnChanges {
    @Input() data: any[];
    @Input() style = new ChartStyleBuilder();
    @Input() layout: 'tidy';
    @Input() links: 'straight';
    @Input() levels = 0;
    @Input() offset = 100;

    @Output() get selectionChange(): any {
        return this.seriesService.selectionChange;
    }

    @Input() set selection(value: any[]) {
        this.seriesService.selection = value;
    }

    get selection() {
        return this.seriesService.selection;
    }

    constructor(
        private chart: ChartComponent,
        private seriesService: RadialTreeSeriesChartService,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data,
            style: this.style,
            layout: this.layout,
            levels: this.levels,
            links: this.links,
            offset: this.offset,
            rect: this.chart.rect,
            margin: this.chart.margin,
        });
    }
}
