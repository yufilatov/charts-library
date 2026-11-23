import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExampleChartAreaSeriesComponent } from 'src/examples/example-chart-area-series/example-chart-area-series.component';
import { ExampleChartBarHorizontalSeriesComponent } from 'src/examples/example-chart-bar-horizontal-series/example-chart-bar-horizontal-series.component';
import { ExampleChartBarVerticalSeriesComponent } from 'src/examples/example-chart-bar-vertical-series/example-chart-bar-vertical-series.component';
import { ExampleChartBarSimpleSeriesComponent } from 'src/examples/example-chart-bar-simple-series/examples-chart-bar-simple-series.component';
import { ExampleChartBarProgressSeriesComponent } from 'src/examples/example-chart-bar-progress-series/examples-chart-bar-progress-series.component';
import { ExampleChartChordSeriesComponent } from 'src/examples/example-chart-chord-series/examples-chart-chord-series.component';
import { ExampleChartCircularPackageSeriesComponent } from 'src/examples/example-chart-circular-package-series/examples-chart-circular-package-series.component';
import { ExampleChartDonutSeriesComponent } from 'src/examples/example-chart-donut-series/example-chart-donut-series.component';
import { ExampleChartDoubleDonutSeriesComponent } from 'src/examples/example-chart-double-donut-series/example-chart-double-donut-series.component';
import { ExampleChartHalfDonutSeriesComponent } from 'src/examples/example-chart-half-donut-series/example-chart-half-donut-series.component';
import { ExampleChartIcicleSeriesComponent } from 'src/examples/example-chart-icicle-series/example-chart-icicle-series.component';
import { ExampleChartLineSeriesComponent } from 'src/examples/example-chart-line-series/example-chart-line-series.component';
import { ExampleChartLineSeriesTypesComponent } from 'src/examples/example-chart-line-series-types/example-chart-line-series-types.component';
import { ExampleChartMatrixSeriesComponent } from 'src/examples/example-chart-matrix-series/example-chart-matrix-series.component';
import { ExampleChartPieSeriesComponent } from 'src/examples/example-chart-pie-series/example-chart-pie-series.component';
import { ExampleChartRadialTreeComponent } from 'src/examples/example-chart-radial-tree-series/example-chart-radial-tree-series..component';
import { ExampleChartSunburstSeriesComponent } from 'src/examples/example-chart-sunburst-series/example-chart-sunburst-series.component';
import { ExampleChartWordCloudSeriesComponent } from 'src/examples/example-chart-word-cloud-series/examples-chart-word-cloud-series.component';
import { ExampleChartMapSeriesComponent } from 'src/examples/example-chart-map-series/example-chart-map-series.component';
import { ExampleLeagueSimulationComponent } from 'src/examples/example-league-simulation/example-league-simulation.component';
import { ExampleChampionsLeague2024Component } from 'src/examples/example-champions-league-2024/example-champions-league-2024.component';

export const routes: Routes = [
    // { path: '', redirectTo: 'pie', pathMatch: 'full'},
    { path: 'area', component: ExampleChartAreaSeriesComponent },
    { path: 'bar-horizontal', component: ExampleChartBarHorizontalSeriesComponent },
    { path: 'bar-vertical', component: ExampleChartBarVerticalSeriesComponent },
    { path: 'bar-simple', component: ExampleChartBarSimpleSeriesComponent },
    { path: 'bar-progress', component: ExampleChartBarProgressSeriesComponent },
    { path: 'chord', component: ExampleChartChordSeriesComponent },
    { path: 'circular-package', component: ExampleChartCircularPackageSeriesComponent },
    { path: 'donut', component: ExampleChartDonutSeriesComponent },
    { path: 'double-donut', component: ExampleChartDoubleDonutSeriesComponent },
    { path: 'half-donut', component: ExampleChartHalfDonutSeriesComponent },
    { path: 'icicle', component: ExampleChartIcicleSeriesComponent },
    { path: 'line', component: ExampleChartLineSeriesComponent },
    { path: 'line-types', component: ExampleChartLineSeriesTypesComponent },
    { path: 'map', component: ExampleChartMapSeriesComponent },
    { path: 'matrix', component: ExampleChartMatrixSeriesComponent },
    { path: 'pie', component: ExampleChartPieSeriesComponent },
    { path: 'radial-tree', component: ExampleChartRadialTreeComponent },
    { path: 'sunburst', component: ExampleChartSunburstSeriesComponent },
    { path: 'word-cloud', component: ExampleChartWordCloudSeriesComponent },
    { path: 'league', component: ExampleLeagueSimulationComponent },
    { path: 'league-2024', component: ExampleChampionsLeague2024Component },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
