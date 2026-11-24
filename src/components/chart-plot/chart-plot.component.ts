import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
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
export class ChartPlotComponent {
    margin = input<IChartMargin>(CHART_MARGIN_EMPTY);

    private readonly chart = inject(ChartComponent);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
        effect(() => this.invalidate());
    }

    private invalidate() {
        this.chart.setMargin({ ...CHART_MARGIN_EMPTY, ...this.margin() });
    }
}
