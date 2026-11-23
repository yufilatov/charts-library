import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';
import { CHART_MARGIN_EMPTY, IChartMargin } from '../common/chart-margin';

@Component({
    selector: 'app-chart-plot',
    template: '',
    styleUrls: [],
    providers: [ChartDisposable],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ChartPlotComponent implements OnChanges {
    @Input() margin: IChartMargin = CHART_MARGIN_EMPTY;

    constructor(
        private chart: ChartComponent,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
    }

    ngOnChanges() {
        this.invalidate();
    }

    private invalidate() {
        this.chart.margin = { ...CHART_MARGIN_EMPTY, ...this.margin };
    }
}
