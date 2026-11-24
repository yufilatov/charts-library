import { Component, Output, ViewEncapsulation, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { SunburstSeriesChartService } from './sunburst-series.service';

@Component({
    selector: 'app-chart-series[type="sunburst"]',
    templateUrl: './sunburst-series.component.html',
    styleUrls: ['./sunburst-series.component.scss'],
    providers: [
        SunburstSeriesChartService,
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class SunburstSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    rings = input(2);
    selection = input<any[]>();

    @Output() get selectionChange() {
        return this.seriesService.selectionChange;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(SunburstSeriesChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        this.disposable.add(() => rectChange.unsubscribe());

        effect(() => {
            const value = this.selection();
            if (value !== undefined) {
                this.seriesService.selection = value;
            }
        });
        effect(() => this.invalidate());
    }

    private invalidate() {
        this.seriesService.setState({
            data: this.data(),
            style: this.style(),
            rings: this.rings(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
