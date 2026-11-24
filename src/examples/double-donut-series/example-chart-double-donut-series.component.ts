import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { DoubleDonutSeriesChartComponent } from 'src/components/series/double-donut-series/double-donut-series.component';

@Component({
    selector: 'app-example-chart-double-donut',
    templateUrl: './example-chart-double-donut-series.component.html',
    styleUrls: ['./example-chart-double-donut-series.component.scss'],
    imports: [ChartComponent, DoubleDonutSeriesChartComponent],
})
export class ExampleChartDoubleDonutSeriesComponent {
    data = DATA;
    counter = 0;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, () => {
            const colors = ['#94c31a', '#bedb75', '#f7a704', '#faca68'];
            const fill = colors[this.counter];
            this.counter = this.counter < 3 ? this.counter + 1 : 0;

            return { fill, strokeWidth: 2 };
        })
        .for(ChartStyle.pie, () => {
            return { innerRadius: 70 };
        });
}
