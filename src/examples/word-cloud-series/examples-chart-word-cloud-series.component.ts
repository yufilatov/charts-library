import * as d3 from 'd3';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { DATA } from './data';
import { ChartComponent } from 'src/components/chart/chart.component';
import { WordCloudSeriesChartComponent } from 'src/components/series/word-cloud-series/word-cloud-series.component';

@Component({
    selector: 'app-examples-chart-word-cloud',
    templateUrl: './examples-chart-word-cloud-series.component.html',
    styleUrls: ['./examples-chart-word-cloud-series.component.scss'],
    imports: [ChartComponent, WordCloudSeriesChartComponent],
})
export class ExampleChartWordCloudSeriesComponent {
    data = DATA;
    color = d3.scaleOrdinal(d3.schemeCategory10);

    style = new ChartStyleBuilder()
        .for(ChartStyle.label, (d, i) => {

            return { color: this.color(i), fontWeight: 600 };
        });
}
