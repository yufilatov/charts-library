import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { DonutSeriesChartComponent } from 'src/components/series/donut-series/donut-series.component';

@Component({
    selector: 'app-example-chart-donut',
    templateUrl: './example-chart-donut-series.component.html',
    styleUrls: ['./example-chart-donut-series.component.scss'],
    imports: [ChartComponent, DonutSeriesChartComponent],
})
export class ExampleChartDonutSeriesComponent {
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
