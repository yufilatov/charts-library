import { Injectable, inject } from '@angular/core';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../../components/common/chart-series';
import { ChartDisposable } from '../../../components/common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle, IChartArcStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../../components/common/chart-draw.factory';
import { nextId } from '../../kit';
import * as d3 from 'd3';

const DEFAULT_STATE: IChartSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class ChordSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-chord-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartSeriesState) {
        const { rect, data, style } = state;

        if (!rect.height || !rect.width) {
            return;
        }

        const datum = this.getData(data);
        const arcStyle = style.compile<IChartArcStyle>(ChartStyle.arc);
        const innerRadius = arcStyle(null, 0).innerRadius;
        const outerRadius = arcStyle(null, 0).outerRadius;

        const chord = d3.chord()
            .padAngle(.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon()
            .radius(innerRadius);

        const chords = chord(datum.matrix);

        const draw = ChartDrawFactory(this.root, chords.groups);
        draw('.chart-chord-arc', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('d', d => arc(d))
                    .attr('fill', (d, i) => arcStyle(d, i).fill)
                    .attr('stroke', (d, i) => arcStyle(d, i).stroke)
                    .on('mouseover', (d, i) => {

                        this.root
                            .selectAll('.chart-chord-chord')
                            .filter(e => e.source.index !== i && e.target.index !== i)
                            .transition()
                            .duration(500)
                            .style('opacity', 0);
                    })
                    .on('mouseleave', (d, i) => {

                        this.root
                            .selectAll('.chart-chord-chord')
                            .transition()
                            .duration(500)
                            .style('opacity', 1);
                    }),
        });

        draw('.chart-chord-label', {
            create: selection =>
                selection
                    .append('text'),
            update: selection =>
                selection
                    .each(d => d.angle = (d.startAngle + d.endAngle) / 2)
                    .attr('dy', '.35em')
                    .attr('transform', d => `rotate(${(d.angle * 180 / Math.PI - 90)})
                                             translate(${innerRadius + 26})${d.angle > Math.PI ? 'rotate(180)' : ''}`)
                    .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
                    .text(d => datum.nameByIndex.get(d.index)),
        });

        const drawChords = ChartDrawFactory(this.root, chords);
        drawChords('.chart-chord-chord', {
            create: selection =>
                selection
                    .append('path'),
            update: selection =>
                selection
                    .attr('fill', d => arcStyle(d, d.source.index).fill)
                    .attr('stroke', d => arcStyle(d, d.source.index).stroke)
                    .attr('fill-opacity', (d, i) => arcStyle(d, i).opacity)
                    .attr('d', d => ribbon(d)),
        });

        this.root.attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`);
    }

    getData(data) {
        const indexByName = new Map();
        const nameByIndex = new Map();
        const matrix = [];
        let n = 0;

        data.forEach((d) => {
            if (!indexByName.has(d = this.getName(d.name))) {
                nameByIndex.set(n, d);
                indexByName.set(d, n++);
            }
        });

        data.forEach((d) => {
            const source = indexByName.get(this.getName(d.name));
            let row = matrix[source];
            if (!row) { row = matrix[source] = Array.from({ length: n }).fill(0); }
            d.imports.forEach(e => row[indexByName.get(this.getName(e))]++);
        });

        return {
            matrix,
            indexByName,
            nameByIndex,
        };
    }

    getName(name) {
        return name.substring(0, name.lastIndexOf('.')).substring(6);
    }
}
