import { Component, HostBinding, ChangeDetectionStrategy, HostListener, Output, EventEmitter, AfterViewInit, ElementRef, input, signal, effect, untracked, inject } from '@angular/core';

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
export class ChartComponent implements AfterViewInit {
    @HostBinding('class.app-chart') hostClass = true;

    readonly marginInput = input(CHART_MARGIN_EMPTY, { alias: 'margin' });
    readonly margin = signal<IChartMargin>(CHART_MARGIN_EMPTY, {
        equal: (a, b) => a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left,
    });

    @Output() rectChange = new EventEmitter<IChartRect>();
    @Output() seriesListChange = new EventEmitter<IChartSeriesState[]>();

    rect = CHART_RECT_EMPTY;
    seriesList: IChartSeriesState[] = [];

    private readonly elementRef = inject(ElementRef);

    constructor() {
        effect(() => {
            const next = this.marginInput();
            untracked(() => {
                this.margin.set(next);
                this.invalidateSize();
            });
        });
    }

    setMargin(margin: IChartMargin) {
        this.margin.set(margin);
    }

    ngAfterViewInit() {
        this.invalidateSize();
    }

    invalidateSize() {
        const { nativeElement } = this.elementRef;
        const rect = nativeElement.getBoundingClientRect();
        const margin = this.margin();

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
