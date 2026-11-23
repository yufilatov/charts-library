import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ExampleDataService } from '../example-data-service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartComponent } from 'src/components/chart/chart.component';
import { AreaSeriesChartComponent } from 'src/components/series/area-series/area-series.component';
import { XAxisChartComponent } from 'src/components/x-axis/x-axis.component';
import { YAxisChartComponent } from 'src/components/y-axis/y-axis.component';
import { ChartPlotComponent } from 'src/components/chart-plot/chart-plot.component';
import { AsyncPipe } from '@angular/common';
import { ChartModule } from 'src/components/components.module';

@Component({
    selector: 'app-example-chart-area',
    templateUrl: './example-chart-area-series.component.html',
    styleUrls: [
        './example-chart-area-series.component.scss',
        '../../styles/epl-emblems.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartAreaSeriesComponent implements OnInit {

    constructor(private dataService: ExampleDataService) { }

    data$: Observable<any>;

    margin = { left: 30, top: 10, right: 15, bottom: 40 };
    range = {
        x: [1996, 2019],
        y: [0, 100],
    };

    ticksX = [];
    ticksY = [];

    style: ChartStyleBuilder = new ChartStyleBuilder()
        .for(ChartStyle.circle, () =>({ fill: '#ffdd00', radius: 5, stroke: '#000000' }))
        .for(ChartStyle.line, () => ({ fill: '#034694', strokeWidth: 0 }));

    ngOnInit(): void {
        this.data$ = this.dataService
            .getHistoryData()
            .pipe(map(clubs => clubs[0].points.map((x, i) => [i + 1996, x])));

        for (let i = 1995; i < 2020; i++) {
            this.ticksX.push(i);
        }

        for (let i = 5; i < 110; i = i + 5) {
            this.ticksY.push(i);
        }
    }
}
