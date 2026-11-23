import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';

@Component({
    selector: 'app-example-chart-double-donut',
    templateUrl: './example-chart-double-donut-series.component.html',
    styleUrls: ['./example-chart-double-donut-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
