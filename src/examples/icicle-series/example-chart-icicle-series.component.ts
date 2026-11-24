import * as d3 from 'd3';
import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { Component } from '@angular/core';
import { ChartComponent } from 'src/components/chart/chart.component';
import { IcicleSeriesChartComponent } from 'src/components/series/icicle-series/icicle-series.component';

@Component({
    selector: 'app-example-chart-icicle',
    templateUrl: './example-chart-icicle-series.component.html',
    styleUrls: ['./example-chart-icicle-series.component.scss'],
    imports: [ChartComponent, IcicleSeriesChartComponent],
})
export class ExampleChartIcicleSeriesComponent {
    data = DATA;
    color = d3.scaleOrdinal(d3.schemeCategory10);

    style = new ChartStyleBuilder()
        .for(ChartStyle.cell, d => {
            let fill;

            while (d.depth > 1) {
                d = d.parent;
            }
            fill = this.color(d.data.name);

            return { fill };
        })
        .for(ChartStyle.label, d => {
            const text = `${d.data.name}: ${d.value}`;

            return { text };
        });

}
