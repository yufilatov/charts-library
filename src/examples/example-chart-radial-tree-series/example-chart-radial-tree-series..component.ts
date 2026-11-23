import { DATA } from './chart-data';
import { findDescendants } from 'src/components/kit';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';

@Component({
    selector: 'app-example-chart-radial-tree-series',
    templateUrl: './example-chart-radial-tree-series.component.html',
    styleUrls: ['./example-chart-radial-tree-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartRadialTreeComponent {
    data = DATA;
    initialData = DATA;
    layoutType = 'tree';
    linkStyle = 'curved';

    selection = this.data;
    breadcrumb: any[] = [this.data];

    style = new ChartStyleBuilder()
        .for(ChartStyle.node, (d) => {

            const fill = d.children ? 'lightsteelblue' : '#ff7f0e';

            return { fill, radius: 4, stroke: '#000' };
        })
        .for(ChartStyle.label, () => {

            return { fontSize: 12 };
        });

    onSelectionChange(value: any[]) {
        switch (value.length) {
            case 0:
                this.breadcrumb = [];
                return;
            case 1:
                if (this.data !== value[0]) {
                    this.data = value[0];
                    this.breadcrumb = this.findPath(value[0], this.initialData);
                    this.selection = this.data;
                }
                break;
        }
    }

    onBreadcrumbSelectionChange(value: any) {
        if (value !== this.selection[0]) {
            this.selection = value;
            this.data = this.selection;
            this.breadcrumb = this.findPath(value, this.initialData);
        }
    }

    formatBreadcrumb(value: any) {
        return value && value.name || '';
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

}


