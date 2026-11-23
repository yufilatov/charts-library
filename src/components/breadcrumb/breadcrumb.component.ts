import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ChartStyleBuilder } from '../chart-style/chart-style.builder';
import { IChartLabelStyle, ChartStyle } from '../chart-style/chart-style';
import { NgClass } from '@angular/common';
@Component({
    selector: 'app-chart-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    imports: [NgClass],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class BreadcrumbChartComponent {
    @HostBinding('class.chart-breadcrumb') hostClass = true;

    @Output() selectionChange = new EventEmitter<any>();

    @Input() path: any[] = [];
    @Input() style = new ChartStyleBuilder();
    @Input() icon: 'sunburst' | 'bubble' = 'sunburst';
    @Input() format = (x: any) => '' + x;
    @Input() set selection(value: any) {
        if (value !== this.#selection) {
            this.#selection = value;
            this.selectionChange.emit(value);
        }
    }

    #selection: any;

    get selection() {
        return this.#selection;
    }

    getColor(index: number): string {
        const labelStyle = this.style.compile<IChartLabelStyle>(ChartStyle.label);
        const color = labelStyle(null, index).color;

        return color;
    }
}
