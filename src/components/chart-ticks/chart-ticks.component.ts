import { Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartComponent } from '../chart/chart.component';

@Component({
    selector: 'app-chart-ticks',
    templateUrl: './chart-ticks.component.html',
    styleUrls: ['./chart-ticks.component.scss'],
    providers: [
        ChartDisposable,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ChartTicksComponent {
    @HostBinding('class.chart-ticks') hostClass = true;
    @Input() data: any[];
    @Input() for = 'bar';

    scale: (d: number) => number = () => 0;

    constructor(
        private chart: ChartComponent,
        private cd: ChangeDetectorRef,
        private disposable: ChartDisposable,
    ) {
        const rectChange = chart.rectChange.subscribe(() => this.invalidate());
        const seriesListChange = chart.seriesListChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
        this.disposable.add(() => seriesListChange.unsubscribe());
    }

    invalidate() {
        const { seriesList } = this.chart;
        const series = seriesList.find(x => x.type === this.for);
        if (series) {
            this.scale = series.scaleY;
            this.cd.markForCheck();
            this.cd.detectChanges();
        }
    }
}
