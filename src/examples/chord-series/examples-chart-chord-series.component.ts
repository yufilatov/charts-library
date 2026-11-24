import * as d3 from 'd3';
import { Component } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { ChordSeriesChartComponent } from 'src/components/series/chord-series/chord-series.component';
import { DATA } from './data';

@Component({
    selector: 'app-examples-chart-chord',
    templateUrl: './examples-chart-chord-series.component.html',
    styleUrls: ['./examples-chart-chord-series.component.scss'],
    imports: [ChartComponent, ChordSeriesChartComponent],
})
export class ExampleChartChordSeriesComponent {
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
