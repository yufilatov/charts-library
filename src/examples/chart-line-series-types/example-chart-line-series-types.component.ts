import { DATA, DATA_TYPES } from "./data";
import { ChartStyle } from "src/components/chart-style/chart-style";
import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { ChartStyleBuilder } from "src/components/chart-style/chart-style.builder";
import { ChartComponent } from "src/components/chart/chart.component";
import { LineSeriesChartComponent } from "src/components/series/line-series/line-series.component";
import { XAxisChartComponent } from "src/components/x-axis/x-axis.component";
import { YAxisChartComponent } from "src/components/y-axis/y-axis.component";
import { ChartPlotComponent } from "src/components/chart-plot/chart-plot.component";
import { NgClass } from "@angular/common";

@Component({
    selector: "app-example-chart-line-types",
    templateUrl: "./example-chart-line-series-types.component.html",
    styleUrls: ["./example-chart-line-series-types.component.scss"],
    imports: [NgClass, ChartComponent, LineSeriesChartComponent, XAxisChartComponent, YAxisChartComponent, ChartPlotComponent],
})
export class ExampleChartLineSeriesTypesComponent implements OnInit {
    xs = DATA.xs;
    ys = DATA.ys;
    datum = [];
    data = [];
    range = DATA.range;
    ticksX = DATA.ticksX;
    ticksY = DATA.ticksY;
    indicators = [];
    margin = { left: 30, top: 10, right: 10, bottom: 30 };

    types = DATA_TYPES;
    curveType = this.types[0];

    colors = [
        "#3366cc",
        "#dc3912",
        "#ff9900",
        "#109618",
        "#990099",
        "#dd4477",
        "#66aa00",
        "#b82e2e",
        "#316395",
        "#994499",
        "#22aa99",
        "#aaaa11",
        "#6633cc",
        "#e67300",
        "#8b0707",
        "#5574a6",
        "#3b3eac",
    ];

    onClick(index) {
        if (!this.indicators.includes(index)) {
            this.indicators.push(index);
        }
        if (!this.data[index] || !this.data[index].length) {
            this.data[index] = this.datum[index];
        } else {
            this.data[index] = [];
            this.curveType = this.types[index];
        }
    }

    ngOnInit() {
        const point = [];
        for (let i = 0; i < this.types.length; i++) {
            point.push([this.xs[i], this.ys[i]]);
        }

        for (const i of this.types) {
            this.datum.push(point);
        }
        this.data = [this.datum[0]];
    }

    getStyle(index) {
        let ind = index;
        if (index === this.data.length - 1 && this.indicators.length) {
            ind = this.indicators[0];
            this.indicators.shift();
        }
        return new ChartStyleBuilder()
            .for(ChartStyle.circle, (d) => {
                const fill = d > 5 ? "#709a28" : d > 2 ? "#f7a704" : "#c23612";

                return { fill: "#fff" };
            })
            .for(ChartStyle.line, () => {
                return { stroke: this.colors[ind], strokeWidth: 2 };
            });
    }

    getCurve(index) {
        let ind = index;
        if (index === this.data.length - 1 && this.indicators.length) {
            ind = this.indicators[0];
            this.indicators.shift();
        }
        return (this.curveType = this.types[ind]);
    }
}
