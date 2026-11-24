import { Injectable, EventEmitter, inject } from '@angular/core';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { nextId } from '../../kit';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import { ChartStyle } from '../../chart-style/chart-style';
import * as d3 from 'd3';

export interface IChartBarSeriesState extends IChartSeriesState {
    total?: number;
    range?: { x: number[], y: number[] };
    animation?: boolean;
}

const DEFAULT_STATE: IChartBarSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
    type: 'bar',
    total: 100,
};

@Injectable()
export class BarVerticalSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-bar-${nextId()}`,
    };

    selectionChange = new EventEmitter<any>();


    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);
        this.root.classed('chart-series-bar', true);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartBarSeriesState): IChartBarSeriesState {
        this.state = {
            ...this.state,
            ...state,
        };

        const { data, style, animation, range, total, rect, margin } = this.state;

        // this.root.selectAll('rect').remove();

        if (!rect.width || !rect.height) {
            return this.state;
        }

        const datum = data.map((x, i) => i);
        datum.push(data.length);

        const scaleX = createScaleX('band', {
            ...state as IChartSeriesState,
            data: datum,
        });

        console.log(datum)

        const scaleY = createScaleY('linear', {
            ...state as IChartSeriesState,
            data: range.y,
        });

        this.state = {
            ...this.state,
            ...state,
        };

        this.root.selectAll('rect').remove();

        const barStyle = style.compile(ChartStyle.bar);
        const labelStyle = style.compile(ChartStyle.label);
        const animationStyle = style.compile(ChartStyle.animation);

        // const draw = ChartDrawFactory(this.root, data);
        let draw;
        const format = d3.format(animationStyle(null, 0).format);

        for (let i = 0; i < data.length; i++) {
            draw = ChartDrawFactory(this.root, data[i]);

            draw(`.chart-bar-value-${nextId()}`, {
                create: selection =>
                    selection
                        .append('rect'),
                update: selection =>
                    selection
                        .classed('animated-bar', true)
                        .attr('width', (d, c) => barStyle(d, c).size)
                        .attr('height', d => {
                            return animation ? 0 : scaleY(d) - scaleY(0);
                        })
                        .attr('transform', (d, c) => {
                            let previous = 0;
                            for (let j = 0; j < c; j++) {
                                previous = previous + data[i][j];
                            }
                            return `translate(${scaleX(data.length) / data.length - barStyle(d, i).size / 2}, ${c > 0 ? -scaleY(previous) + scaleY(0) : 0})`;
                        })
                        .attr('x', scaleX(i))
                        .attr('y', (d, c) => scaleY(d3.max(range.y)) - scaleY(d) + scaleY(0))
                        .attr('fill', (d, c) => barStyle(d, c).fill)
                        .on('mouseover', (d, c) => {
                            this.selectionChange.emit();
                        }),
            });
        }

        // if (label !== 'none') {
        //   draw('.chart-label', {
        //     create: selection =>
        //       selection
        //         .append('text'),
        //     update: selection =>
        //       selection
        //         .attr('x', () => {
        //           if (label === 'start') {
        //             return scaleX(0) - 10;
        //           } return scaleX(total) + 10;
        //         })
        //         .attr('y', (d, i) => scaleY(i) + scaleY(0) / 2)
        //         .style('text-anchor', () => {
        //           if (label === 'start') {
        //             return 'end';
        //           } return 'start';
        //         })
        //         .attr('vertical-align', 'middle')
        //         .attr('font-size', (d, i) => labelStyle(d, i).fontSize)
        //         .attr('fill', (d, i) => labelStyle(d, i).color)
        //         .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
        //         .attr('transform', (d, i) => {
        //           if (labelStyle(d, i).padding !== null) {
        //             return `translate(${-scaleX(total) - 10 + scaleX(d) + labelStyle(d, i).padding}, 0)`;
        //           }
        //         })
        //         .text((d, i) => animation ? format(0) : labelStyle(d, i).text),
        //   });
        // }

        if (animation) {

            this.root.selectAll('.animated-bar')
                .transition()
                .duration((d, i) => animationStyle(d, i).duration)
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
                            const j = d3.interpolate('0', `${labelStyle(d, i).text}`);
                            return (t) => { that.text(format(j(t))); };
                        });

                });
        }

        return this.state;
    }
}
