import { Component } from '@angular/core';
import { ChartStyleBuilder } from 'src/charts/chart-style/chart-style.builder';
import { ChartStyle } from 'src/charts/chart-style/chart-style';
import { DATA } from 'src/examples/sandbox-chart-chord-series/data';
import * as d3 from 'd3';

@Component({
  selector: 'app-sandbox-chart-chord',
  templateUrl: './sandbox-chart-chord-series.component.html',
  styleUrls: ['./sandbox-chart-chord-series.component.scss'],
})
export class SandboxChartChordSeriesComponent {

  data = DATA;
  color = d3.scaleOrdinal(d3.schemeCategory10);

  style =
      new ChartStyleBuilder()
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