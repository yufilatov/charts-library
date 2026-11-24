import { Routes } from '@angular/router';
import { AboutComponent } from 'src/pages/about/about.component';
import { ContactsComponent } from 'src/pages/contacts/contacts.component';
import { HomeComponent } from 'src/pages/home/home.component';
import { ExampleChartAreaSeriesComponent } from 'src/examples/area-series/example-chart-area-series.component';
import { ExampleChartBarHorizontalSeriesComponent } from 'src/examples/bar-horizontal-series/example-chart-bar-horizontal-series.component';
import { ExampleChartBarVerticalSeriesComponent } from 'src/examples/bar-vertical-series/example-chart-bar-vertical-series.component';
import { ExampleChartBarSimpleSeriesComponent } from 'src/examples/bar-simple-series/examples-chart-bar-simple-series.component';
import { ExampleChartBarProgressSeriesComponent } from 'src/examples/bar-progress-series/examples-chart-bar-progress-series.component';
// import { ExampleChartChordSeriesComponent } from 'src/examples/example-chart-chord-series/examples-chart-chord-series.component';
import { ExampleChartCircularPackageSeriesComponent } from 'src/examples/circular-package-series/examples-chart-circular-package-series.component';
import { ExampleChartDonutSeriesComponent } from 'src/examples/donut-series/example-chart-donut-series.component';
import { ExampleChartDoubleDonutSeriesComponent } from 'src/examples/double-donut-series/example-chart-double-donut-series.component';
import { ExampleChartHalfDonutSeriesComponent } from 'src/examples/half-donut-series/example-chart-half-donut-series.component';
import { ExampleChartIcicleSeriesComponent } from 'src/examples/icicle-series/example-chart-icicle-series.component';
import { ExampleChartPieSeriesComponent } from 'src/examples/pie-series/example-chart-pie-series.component';
import { ExampleChartRadialTreeComponent } from 'src/examples/radial-tree-series/example-chart-radial-tree-series.component';
import { ExampleChartSunburstSeriesComponent } from 'src/examples/sunburst-series/example-chart-sunburst-series.component';
import { ExampleChartWordCloudSeriesComponent } from 'src/examples/word-cloud-series/examples-chart-word-cloud-series.component';
import { ExampleChartMapSeriesComponent } from 'src/examples/map-series/example-chart-map-series.component';
import { ExampleChampionsLeague2024Component } from 'src/examples/example-champions-league-2024/example-champions-league-2024.component';
import { ExampleChartChordSeriesComponent } from 'src/examples/chord-series/examples-chart-chord-series.component';
import { ExampleChartLineSeriesTypesComponent } from 'src/examples/chart-line-series-types/example-chart-line-series-types.component';
import { ExampleLeagueSimulationComponent } from 'src/examples/league-simulation/example-league-simulation.component';
import { ExampleChartLineSeriesComponent } from 'src/examples/line-series/example-chart-line-series.component';
import { ExampleChartMatrixSeriesComponent } from 'src/examples/matrix-series/example-chart-matrix-series.component';

export const chartRoutes: Routes = [
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

export const routes: Routes = [
    { path: '', redirectTo: 'area', pathMatch: 'full' },
    ...chartRoutes,
    { path: 'Home', component: HomeComponent },
    { path: 'Contacts', component: ContactsComponent },
    { path: 'About', component: AboutComponent },
    { path: '**', redirectTo: '/area' },
];
