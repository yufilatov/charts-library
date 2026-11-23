import { DATA_GT } from './data';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';

@Component({
    selector: 'app-example-chart-matrix',
    templateUrl: './example-chart-matrix-series.component.html',
    styleUrls: ['./example-chart-matrix-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartMatrixSeriesComponent {
    data = DATA_GT;
    order = 'name';
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

    onOrderDropdownClick(order: string) {
        this.order = order;
    }

    onChange(event) {
        this.order = event.target.value;
    }

}
