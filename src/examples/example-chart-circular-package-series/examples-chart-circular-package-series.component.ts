import * as d3 from 'd3';
import { Component } from '@angular/core';
import { ChartStyle } from 'src/charts/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/charts/chart-style/chart-style.builder';
import { DATA } from './data';

@Component({
    selector: 'app-examples-chart-circular-package',
    templateUrl: './examples-chart-circular-package-series.component.html',
    styleUrls: ['./examples-chart-circular-package-series.component.scss'],
})
export class ExampleChartCircularPackageSeriesComponent {
    data = DATA;
    color = d3.scaleOrdinal(d3.schemeCategory10);

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (d, i) => {

            return {
                fill: this.color(i),
                stroke: this.color(i),
                opacity: 0.67,
                innerRadius: 300,
                outerRadius: 320,
            };
        });
}
