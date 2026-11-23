import * as d3 from 'd3';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { DATA } from './data';

@Component({
    selector: 'app-examples-chart-word-cloud',
    templateUrl: './examples-chart-word-cloud-series.component.html',
    styleUrls: ['./examples-chart-word-cloud-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExampleChartWordCloudSeriesComponent {
    data = DATA;
    color = d3.scaleOrdinal(d3.schemeCategory10);

    style = new ChartStyleBuilder()
        .for(ChartStyle.label, (d, i) => {

            return { color: this.color(i), fontWeight: 600 };
        });
}
