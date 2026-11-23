import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StopPropagationDirective } from 'src/directives/stop-propagation.directive';
import { ChartPlotComponent } from './chart-plot/chart-plot.component';
import { ChartPopupComponent } from './chart-popup/chart-popup.component';
import { ChartPortalModule } from './chart-portal/chart-portal.module';
import { ChartTicksComponent } from './chart-ticks/chart-ticks.component';
import { ChartComponent } from './chart/chart.component';
import { BreadcrumbChartComponent } from './breadcrumb/breadcrumb.component';
import { AreaSeriesChartComponent } from './series/area-series/area-series.component';
import { BarProgressSeriesChartComponent } from './series/bar-progress-series/bar-progress-series.component';
import { BarSeriesChartComponent } from './series/bar-series/bar-series.component';
import { BarSimpleSeriesChartComponent } from './series/bar-simple-series/bar-simple-series.component';
import { ChordSeriesChartComponent } from './series/chord-series/chord-series.component';
import { CircularPackageSeriesChartComponent } from './series/circular-package-series/circular-package-series.component';
import { DonutSeriesChartComponent } from './series/donut-series/donut-series.component';
import { DoubleDonutSeriesChartComponent } from './series/double-donut-series/double-donut-series.component';
import { GridSeriesChartComponent } from './series/grid-series/grid-series.component';
import { HalfDonutSeriesChartComponent } from './series/half-donut-series/half-donut-series.component';
import { IcicleSeriesChartComponent } from './series/icicle-series/icicle-series.component';
import { LineSeriesChartComponent } from './series/line-series/line-series.component';
import { MapSeriesChartComponent } from './series/map-series/map-series.component';
import { MatrixSeriesChartComponent } from './series/matrix-series/matrix-series.component';
import { PieSeriesChartComponent } from './series/pie-series/pie-series.component';
import { RadialTreeSeriesChartComponent } from './series/radial-tree-series/radial-tree-series.component';
import { RectSeriesChartComponent } from './series/rect-series/rect-series.component';
import { SunburstSeriesChartComponent } from './series/sunburst-series/sunburst-series.component';
import { WordCloudSeriesChartComponent } from './series/word-cloud-series/word-cloud-series.component';
import { XAxisChartComponent } from './x-axis/x-axis.component';
import { YAxisChartComponent } from './y-axis/y-axis.component';


@NgModule({
    declarations: [
        StopPropagationDirective,
    ],
    imports: [
        CommonModule,
        ChartPortalModule,
        AreaSeriesChartComponent,
        BarSeriesChartComponent,
        BarSimpleSeriesChartComponent,
        BarProgressSeriesChartComponent,
        ChordSeriesChartComponent,
        CircularPackageSeriesChartComponent,
        DonutSeriesChartComponent,
        DoubleDonutSeriesChartComponent,
        GridSeriesChartComponent,
        HalfDonutSeriesChartComponent,
        IcicleSeriesChartComponent,
        LineSeriesChartComponent,
        MapSeriesChartComponent,
        MatrixSeriesChartComponent,
        PieSeriesChartComponent,
        RadialTreeSeriesChartComponent,
        RectSeriesChartComponent,
        SunburstSeriesChartComponent,
        WordCloudSeriesChartComponent,
        XAxisChartComponent,
        YAxisChartComponent,
        ChartComponent,
        ChartPlotComponent,
        ChartTicksComponent,
        ChartPopupComponent,
        BreadcrumbChartComponent,
    ],
    exports: [
        AreaSeriesChartComponent,
        BarSeriesChartComponent,
        BarSimpleSeriesChartComponent,
        BarProgressSeriesChartComponent,
        ChordSeriesChartComponent,
        CircularPackageSeriesChartComponent,
        DonutSeriesChartComponent,
        DoubleDonutSeriesChartComponent,
        GridSeriesChartComponent,
        HalfDonutSeriesChartComponent,
        IcicleSeriesChartComponent,
        LineSeriesChartComponent,
        MapSeriesChartComponent,
        MatrixSeriesChartComponent,
        PieSeriesChartComponent,
        RadialTreeSeriesChartComponent,
        RectSeriesChartComponent,
        SunburstSeriesChartComponent,
        WordCloudSeriesChartComponent,
        XAxisChartComponent,
        YAxisChartComponent,
        
        ChartComponent,
        ChartPlotComponent,
        ChartPopupComponent,
        ChartTicksComponent,
        BreadcrumbChartComponent,
        StopPropagationDirective,
    ],
})
export class ChartModule { }
