import * as d3 from 'd3';
import { DATA } from './data';
import { findDescendants, convertUmlauts } from 'src/components/kit';
import { ChartStyle } from '../../components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from '../../components/chart-style/chart-style.builder';
import { ChartComponent } from 'src/components/chart/chart.component';
import { SunburstSeriesChartComponent } from 'src/components/series/sunburst-series/sunburst-series.component';
import { ChartPopupComponent } from 'src/components/chart-popup/chart-popup.component';
import { BreadcrumbChartComponent } from 'src/components/breadcrumb/breadcrumb.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-example-chart-sunburst',
    templateUrl: './example-chart-sunburst-series.component.html',
    styleUrls: [
        './example-chart-sunburst-series.component.scss',
        '../../styles/germany-lands-logos.scss',
    ],
    imports: [NgClass, ChartComponent, SunburstSeriesChartComponent, ChartPopupComponent, BreadcrumbChartComponent],
})
export class ExampleChartSunburstSeriesComponent {
    constructor() { }
    data = DATA;

    chart = 1;

    selection = [];
    matches = [];
    selectionSource = 'default';

    breadcrumb: any[] = [];
    breadcrumbSelection = this.data;

    color = d3.scaleOrdinal(d3.schemeCategory10);
    colorHover = d3.scaleOrdinal(d3.schemeTableau10);

    style = new ChartStyleBuilder()
        .for(ChartStyle.arc, (node) => {
            const level = node.parent ? node.data.level : '';

            let fill =
                level === 1 ? this.color(1) :
                    level === 2 ? this.color(2) :
                        level === 3 ? this.color(3) :
                            'transparent';

            const fillHover =
                level === 1 ? '#1a6497' :
                    level === 2 ? '#258525' :
                        level === 3 ? '#eb6e00' :
                            'transparent';

            if (node.data === this.selection[0]) {
                fill = fillHover;
            }

            return { fill, fillHover };
        })
        .for(ChartStyle.label, () => {
            return { color: '#ffffff', fontSize: 13, fontWeight: 600 };
        })
        .for(ChartStyle.zoom, () => {
            return { duration: 800 };
        });

    breadcrumbStyle = new ChartStyleBuilder()
        .for(ChartStyle.label, (d, i) => {
            let labelColor;
            const level = this.selection[0].level;

            if (i === this.breadcrumb.length - 1) {
                labelColor = '#000';
            } else {
                labelColor = this.color(this.selection[0].level);
            }

            return { color: labelColor };
        });

    onSelectionChange(value: any[]) {
        if (this.selectionSource !== 'default') {
            this.selectionSource = 'default';
            return;
        }

        switch (value.length) {
            case 0:
                this.breadcrumb = [];
                return;
            case 1:
                const node = value[0];
                this.breadcrumb = this.findPath(node, this.data);
                this.selection = value;
                break;
        }
    }

    onControlChange(value: any) {
        if (JSON.stringify(value) !== JSON.stringify(this.selection)) {
            this.selection = [value];
            this.breadcrumb = value;
        }
    }

    onBreadcrumbChange(value: any) {
        if (value !== this.selection[0]) {
            this.selection = [value];
            this.breadcrumb = this.findPath(value, this.data);
        }
    }

    formatBreadcrumb(value: any) {
        return value.name;
    }

    private findPath(node, root) {
        if (node === root) {
            return [root];
        }

        const path = [root];

        if (root.children) {
            root.children.forEach((n) => {

                const nodes = findDescendants(n).concat(n);
                if (nodes.indexOf(node) >= 0) {
                    path.push(...this.findPath(node, n));
                }
            });
        }

        return path;
    }

    getLogo(name) {
        return `logo logo-${convertUmlauts(name.toLowerCase().replace(/\s+/g, '-'))}`;
    }
}
