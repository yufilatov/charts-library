import { Component, ChangeDetectionStrategy, ViewEncapsulation, Output, input, effect, inject } from '@angular/core';
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
export class RadialTreeSeriesChartComponent {
    data = input<any[]>();
    style = input(new ChartStyleBuilder());
    layout = input<'tidy'>();
    links = input<'straight'>();
    levels = input(0);
    offset = input(100);
    selection = input<any[]>();

    @Output() get selectionChange(): any {
        return this.seriesService.selectionChange;
    }

    private readonly chart = inject(ChartComponent);
    private readonly seriesService = inject(RadialTreeSeriesChartService);
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
            layout: this.layout(),
            levels: this.levels(),
            links: this.links(),
            offset: this.offset(),
            rect: this.chart.rect,
            margin: this.chart.margin(),
        });
    }
}
