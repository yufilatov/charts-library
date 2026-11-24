import * as d3 from 'd3';
import { nextId } from '../../kit';
import { ChartService } from '../../chart/chart.service';
import { Injectable, inject } from '@angular/core';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';

export interface IChartBarProgressSeriesState extends IChartSeriesState {
    label?: 'start' | 'end' | 'none';
    total?: number;
    animation?: boolean;
}

const DEFAULT_STATE: IChartBarProgressSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
    type: 'bar',
    label: 'none',
    total: 100,
};

@Injectable()
export class BarProgressSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-bar-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.root.classed('chart-series-bar', true);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartBarProgressSeriesState): IChartBarProgressSeriesState {

        const scaleX = createScaleX('linear', {
            ...state as IChartSeriesState,
            data: [0, state.total],
        });

        const scaleY = createScaleY('band', state);

        this.state = {
            ...this.state,
            ...state,
            scaleX,
            scaleY,
        };

        const { rect, style, data, label, total, animation } = this.state;
        const barStyle = style.compile(ChartStyle.bar);
        const labelStyle = style.compile(ChartStyle.label);

        if (!rect.height || !rect.width) {
            return this.state;
        }

        const draw = ChartDrawFactory(this.root, data);

        draw('.chart-bar', {
            create: selection =>
                selection
                    .append('rect'),
            update: selection =>
                selection
                    .attr('width', scaleX(total) - scaleX(0))
                    .attr('height', (d, i) => barStyle(d, i).size)
                    .attr('vertical-align', 'middle')
                    .attr('x', scaleX(0))
                    .attr('y', (d, i) => scaleY(i) - barStyle(d, i).size / 2)
                    .attr('fill', (d, i) => '#f8f8f8'),
        });

        draw('.chart-bar-value', {
            create: selection =>
                selection
                    .append('rect'),
            update: selection =>
                selection
                    .classed('bar-animated', animation)
                    .attr('width', (d, i) => animation ? 0 : scaleX(d) - scaleX(0))
                    .attr('height', (d, i) => barStyle(d, i).size)
                    .attr('x', () => scaleX(0))
                    .attr('y', (d, i) => scaleY(i) - barStyle(d, i).size / 2)
                    .attr('fill', (d, i) => barStyle(d, i).fill),
        });

        const animationStyle = style.compile(ChartStyle.animation);

        if (label !== 'none') {
            draw('.chart-label', {
                create: selection =>
                    selection
                        .append('text'),
                update: selection =>
                    selection
                        .attr('x', () => {
                            if (label === 'start') {
                                return scaleX(0) - 10;
                            }
                            return scaleX(total) + 10;
                        })
                        .attr('y', (d, i) => scaleY(i) + scaleY(0) / 2)
                        .style('text-anchor', () => {
                            if (label === 'start') {
                                return 'end';
                            }
                            return 'start';
                        })
                        .attr('vertical-align', 'middle')
                        .attr('font-size', (d, i) => labelStyle(d, i).fontSize)
                        .attr('fill', (d, i) => labelStyle(d, i).color)
                        .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
                        .text((d, i) => animation ? d3.format(animationStyle(d, i).format)(0) : labelStyle(d, i).text),
            });
        }

        if (animation) {

            this.root.selectAll('.bar-animated')
                .transition()
                .duration((d, i) => {
                    return animationStyle(d, i).duration;
                })
                .attr('width', d => scaleX(d) - scaleX(0))
                .delay((d, i) => animationStyle(d, i).delay);

            this.root.selectAll('text')
                .transition()
                .duration((d, i) => animationStyle(d, i).duration)
                .delay((d, i) => animationStyle(d, i).delay)
                .on('start', function repeat() {
                    d3.active(this)
                        .tween('text', (d, i) => {
                            const that = d3.select(this);
                            const с = d3.interpolate('0', `${labelStyle(d, i).text}`);
                            return (t) => { that.text(d3.format(animationStyle(d, i).format)(с(t))); };
                        });

                });
        }

        return this.state;
    }
}
