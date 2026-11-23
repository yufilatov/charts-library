import * as d3 from 'd3';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { DATA } from 'src/examples/example-chart-chord-series/data';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';

@Component({
    selector: 'app-examples-chart-chord',
    templateUrl: './examples-chart-chord-series.component.html',
    styleUrls: ['./examples-chart-chord-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
