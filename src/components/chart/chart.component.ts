import {
    Component,
    HostBinding, ChangeDetectionStrategy, HostListener, Output, EventEmitter, AfterViewInit,
    ViewEncapsulation, Input, OnChanges, SimpleChanges, ElementRef
} from '@angular/core';

import { ChartService } from './chart.service';
import { IChartMargin, CHART_MARGIN_EMPTY } from '../common/chart-margin';
import { IChartRect, CHART_RECT_EMPTY } from '../common/chart-rect';
import { IChartSeriesState } from '../common/chart-series';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    providers: [ChartService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnChanges {
    @HostBinding('class.app-chart') hostClass = true;

    @Input() margin: IChartMargin = CHART_MARGIN_EMPTY;

    @Output() rectChange = new EventEmitter<IChartRect>();
    @Output() seriesListChange = new EventEmitter<IChartSeriesState[]>();

    rect = CHART_RECT_EMPTY;
    seriesList: IChartSeriesState[] = [];

    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.invalidateSize();
    }

    invalidateSize() {
        const { nativeElement } = this.elementRef;
        const rect = nativeElement.getBoundingClientRect();
        const margin = this.margin;

        this.rect = {
            top: rect.top + margin.top,
            bottom: rect.bottom - margin.bottom,
            left: rect.left + margin.left,
            right: rect.right - margin.right,
            height: rect.height - margin.top - margin.bottom,
            width: rect.width - margin.left - margin.right,
        };

        this.rectChange.emit(this.rect);
    }

    ngOnChanges(changes: SimpleChanges) {
        // tslint:disable-next-line:no-string-literal
        const marginChange = changes['margin'];
        if (marginChange) {
            this.margin = marginChange.currentValue;
            this.invalidateSize();
        }
        this.invalidateSize();
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.invalidateSize();
    }

    addSeries(series: IChartSeriesState) {
        const index = this.seriesList.findIndex(x => x.id === series.id);
        if (index >= 0) {
            this.seriesList[index] = series;
        } else {
            this.seriesList.push(series);
        }

        this.seriesListChange.emit(this.seriesList);
    }

    removeSeries(series: IChartSeriesState) {
        const index = this.seriesList.findIndex(x => x.id === series.id);
        if (index >= 0) {
            this.seriesList.splice(index, 1);
            this.seriesListChange.emit(this.seriesList);
        }
    }
}
