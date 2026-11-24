import { DATA_GT } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { MatrixSeriesChartComponent } from 'src/components/series/matrix-series/matrix-series.component';
import { ChartMatrixOrderType } from 'src/components/series/matrix-series/matrix-series.service';

@Component({
    selector: 'app-example-chart-matrix',
    templateUrl: './example-chart-matrix-series.component.html',
    styleUrls: ['./example-chart-matrix-series.component.scss'],
    imports: [ChartComponent, MatrixSeriesChartComponent],
})
export class ExampleChartMatrixSeriesComponent {
    data = DATA_GT;
    order: ChartMatrixOrderType = 'name';
    chart = 1;

    options = [
        { name: 'Action' },
        { name: 'Another action' },
        { name: 'Something else here' },
        { isDivider: true },
        { name: 'Separated link' },
    ];

    style = new ChartStyleBuilder()
        .for(ChartStyle.label, () => {
            return { fontSize: 15, color: '#000', colorHover: '#ff0000' };
        });

    onOrderDropdownClick(order: ChartMatrixOrderType) {
        this.order = order;
    }

    onChange(event) {
        this.order = event.target.value;
    }

}
