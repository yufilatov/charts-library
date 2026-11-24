import { Component, ChangeDetectionStrategy, input, effect, inject } from '@angular/core';
import { ChartStyleBuilder } from '../../chart-style/chart-style.builder';
import { ChartComponent } from '../../chart/chart.component';
import { BarSimpleSeriesChartService } from './bar-simple-series.service';
import { ChartDisposable } from '../../common/chart-disposable';

@Component({
    selector: 'app-chart-series[type="bar-simple"]',
    templateUrl: './bar-simple-series.component.html',
    styleUrls: ['./bar-simple-series.component.scss'],
    providers: [
        ChartDisposable,
        BarSimpleSeriesChartService,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class BarSimpleSeriesChartComponent {
  data = input<any[]>();
  style = input(new ChartStyleBuilder());
  total = input(100);
  animation = input(false);

  private readonly chart = inject(ChartComponent);
  private readonly seriesService = inject(BarSimpleSeriesChartService);
  private readonly disposable = inject(ChartDisposable);

  constructor() {
    const rectChange = this.chart.rectChange.subscribe(() => this.invalidate());
    this.disposable.add(() => rectChange.unsubscribe());
    effect(() => this.invalidate());
  }

  private invalidate() {
    const state = this.seriesService.setState({
      data: this.data() || [],
      style: this.style(),
      rect: this.chart.rect,
      margin: this.chart.margin(),
      total: this.total(),
      animation: this.animation(),
    });

    this.chart.addSeries(state);
    this.disposable.add(() => this.chart.removeSeries(state));
  }
}
