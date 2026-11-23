import * as d3 from 'd3';
import { DATA } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-example-chart-icicle',
    templateUrl: './example-chart-icicle-series.component.html',
    styleUrls: ['./example-chart-icicle-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
