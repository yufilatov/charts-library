import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, input, effect, inject } from '@angular/core';
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
    data = input<any[]>();
    for = input('bar');

    scale: (d: number) => number = () => 0;

    private readonly chart = inject(ChartComponent);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        effect(() => this.invalidate());
        const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
        const seriesListChange = this.chart.seriesListChange.subscribe(() => this.invalidate());

        this.disposable.add(() => rectChange.unsubscribe());
        this.disposable.add(() => seriesListChange.unsubscribe());
    }

    invalidate() {
        const { seriesList } = this.chart;
        const series = seriesList.find(x => x.type === this.for());
        if (series) {
            this.scale = series.scaleY;
            this.cd.markForCheck();
            this.cd.detectChanges();
        }
    }
}
