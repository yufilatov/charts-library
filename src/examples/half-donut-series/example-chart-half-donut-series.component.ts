import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { HalfDonutSeriesChartComponent } from 'src/components/series/half-donut-series/half-donut-series.component';

@Component({
    selector: 'app-example-chart-half-donut',
    templateUrl: './example-chart-half-donut-series.component.html',
    styleUrls: ['./example-chart-half-donut-series.component.scss'],
    imports: [ChartComponent, HalfDonutSeriesChartComponent],
})
export class ExampleChartHalfDonutSeriesComponent {
    data = DATA;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d, i) => {
            const colors = ['#709a28', '#f7a704', '#c23612'];

            return { fill: colors[i], strokeWidth: 2 };
        })
        .for(ChartStyle.pie, () => {
            return { innerRadius: 70 };
        });
}
