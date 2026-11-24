import { Injectable, inject } from '@angular/core';
import * as d3 from 'd3';
import { nextId } from '../../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';

export interface IChartIcicleSeriesState extends IChartSeriesState {
    total?: number;
}

const DEFAULT_STATE: IChartIcicleSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class IcicleSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: `chart-series-pie-${nextId()}`, level: 0 };
        this.root = this.chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartIcicleSeriesState) {
        const { rect, data, style, total } = state;

        if (!rect.height || !rect.width) {
            return;
        }

        const values = d3.hierarchy(data[0])
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        let datum = d3.partition()
            .size([rect.height, (values.height + 1) * rect.width / 3])(values);

        const draw = ChartDrawFactory<number>(this.root, datum.descendants());

        const cellStyle = style.compile(ChartStyle.cell);
        const labelStyle = style.compile(ChartStyle.label);

        draw('.chart-icicle-cell', {
            create: selection =>
                selection
                    .append('rect'),
            update: selection =>
                selection
                    .attr('width', d => d.y1 - d.y0 - 1)
                    .attr('height', d => d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2))
                    .attr('transform', d => `translate(${d.y0},${d.x0})`)
                    .attr('fill-opacity', 0.6)
                    .attr('fill', (d, i) => cellStyle(d, i).fill)
                    .attr('cursor', 'pointer')
                    .on('click', (d) => {
                        datum = datum === d ? d.parent ? d = d.parent : d : d;
                        this.animation(d, state);
                    }),
        });

        draw('.chart-icicle-cell-text', {
            create: selection =>
                selection
                    .append('text'),
            update: selection =>
                selection
                    .style('user-select', 'none')
                    .attr('pointer-events', 'none')
                    .attr('x', d => d.y0 + 7)
                    .attr('y', d => d.x0 + 12)
                    .attr('font-size', '9px')
                    .attr('font-weight', 600)
                    .attr('opacity', d => +this.labelVisible(d, state))
                    .style('text-transform', 'capitalize')
                    .text((d, i) => labelStyle(d, i).text),
        });


    }

    invalidateSelection(d) {

    }

    private animation(d, state) {
        const { rect } = state;

        this.root
            .selectAll('.chart-icicle-cell')
            .each(a => a.target = {
                x0: (a.x0 - d.x0) / (d.x1 - d.x0) * rect.height,
                x1: (a.x1 - d.x0) / (d.x1 - d.x0) * rect.height,
                y0: a.y0 - d.y0,
                y1: a.y1 - d.y0,
            });

        this.root
            .selectAll('.chart-icicle-cell')
            .transition()
            .duration(750)
            .attr('transform', c => `translate(${c.target.y0},${c.target.x0})`)
            .attr('height', c => c.target.x1 - c.target.x0 - Math.min(1, (c.target.x1 - c.target.x0) / 2));

        this.root
            .selectAll('.chart-icicle-cell-text')
            .transition()
            .duration(750)
            .attr('x', a => a.y0 - d.y0 + 7)
            .attr('y', a => (a.x0 - d.x0) / (d.x1 - d.x0) * rect.height + 12)
            .attr('opacity', a => +this.labelVisible(a.target, state));
    }

    private labelVisible(d, state) {
        const { rect } = state;
        return d.y1 <= rect.width + 0.001 && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }
}
