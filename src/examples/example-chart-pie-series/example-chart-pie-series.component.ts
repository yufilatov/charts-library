import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { DATA } from './data';

@Component({
    selector: 'app-example-chart-pie',
    templateUrl: './example-chart-pie-series.component.html',
    styleUrls: ['./example-chart-pie-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartPieSeriesComponent {
    data = DATA;

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d, i) => {
            const colors = ['#709a28', '#f7a704', '#c23612'];

            return { fill: colors[i], strokeWidth: 2 };
        });
}
