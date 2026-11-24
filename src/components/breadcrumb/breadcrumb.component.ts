import { Component, ChangeDetectionStrategy, Output, EventEmitter, HostBinding, input, effect } from '@angular/core';
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

    path = input<any[]>([]);
    style = input(new ChartStyleBuilder());
    icon = input<'sunburst' | 'bubble'>('sunburst');
    format = input<(value: any) => string>((value) => '' + value);
    selection = input<any>();

    #selection: any;

    constructor() {
        effect(() => {
            const value = this.selection();
            if (value !== this.#selection) {
                this.#selection = value;
                this.selectionChange.emit(value);
            }
        });
    }

    select(value: any) {
        if (value !== this.#selection) {
            this.#selection = value;
            this.selectionChange.emit(value);
        }
    }

    getColor(index: number): string {
        const labelStyle = this.style().compile<IChartLabelStyle>(ChartStyle.label);
        const color = labelStyle(null, index).color;

        return color;
    }
}
