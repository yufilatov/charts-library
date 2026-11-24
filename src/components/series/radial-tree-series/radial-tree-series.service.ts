import { Injectable, EventEmitter, inject } from '@angular/core';
import * as d3 from 'd3';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { nextId } from '../../kit';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';

// tslint:disable-next-line:no-empty-interface
export interface IKfChartRadialTreeSeriesState extends IChartSeriesState {
    layout?: 'tidy' | 'cluster';
    links?: 'curved' | 'straight';
    levels?;
    offset?;
}

const DEFAULT_STATE: IKfChartRadialTreeSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class RadialTreeSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-radial-tree-${nextId()}`,
    };

    private localSelection: any[] = [];
    selectionChange = new EventEmitter<{ oldValue: any[], currentValue: any[] }>();

    set selection(currentValue: any[]) {
        if (this.localSelection !== currentValue) {
            const oldValue = this.localSelection;
            this.localSelection = currentValue;

            this.selectionChange.emit({ oldValue, currentValue });
        }
    }

    get selection() {
        return this.localSelection;
    }

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IKfChartRadialTreeSeriesState) {
        const { rect, data, style, layout, levels, links } = state;

        const visibleLevels = levels === 0 ? this.maxDepth(data) + 1 : levels;

        if (!rect.height || !rect.width) {
            return;
        }

        this.root
            .attr('transform', `translate(${rect.width / 2}, ${rect.height / 2})`);

        const radius = visibleLevels === 1 ? this.getRadius(state) * this.maxDepth(data) / (visibleLevels) :
            this.getRadius(state) * this.maxDepth(data) / (visibleLevels - 1);

        let tree;
        if (layout === 'cluster') {
            tree = d3.cluster()
                .size([2 * Math.PI, radius])
                (d3.hierarchy(data));
        } else {
            tree = d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => {
                    return (a.parent === b.parent ? 1 : 2);
                })
                (d3.hierarchy(data));
        }

        const nodeStyle = style.compile(ChartStyle.node);
        const linkStyle = style.compile(ChartStyle.link);
        const labelStyle = style.compile(ChartStyle.label);

        let linksDatum;
        let drawLink;

        this.root.selectAll('.chart-link').remove();

        const translateLabel = (d, i) => {
            if (d.x >= Math.PI) {
                return `rotate(${d.x * 180 / Math.PI - 90})
                translate(${d.y})
                rotate(180)`;
            }
            return `rotate(${d.x * 180 / Math.PI - 90})
                translate(${d.y})`;
        };

        const drawNode = ChartDrawFactory(this.root, tree.descendants());
        drawNode('.chart-label', {
            create: selection =>
                selection
                    .append('text'),
            update: selection =>
                selection
                    .attr('display', d => d.depth < visibleLevels ? 'all' : 'none')
                    .attr('x', d => d.x < Math.PI ? 8 : -8)
                    .attr('dy', '.31em')
                    .attr('text-anchor', d => d.x < Math.PI ? 'start' : 'end')
                    .attr('transform', translateLabel)
                    .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
                    .attr('font-size', (d, i) => labelStyle(d, i).fontSize)
                    .text(d => d.data.name),
        });

        drawNode('.chart-node', {
            create: selection =>
                selection
                    .append('circle'),
            update: selection =>
                selection
                    .attr('display', d => d.depth < visibleLevels ? 'all' : 'none')
                    .attr('chart-tree-selector-hover', d => d.parent ? 1 : null)
                    .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90})
                                             translate(${d.y})`)
                    .attr('r', (d, i) => nodeStyle(d, i).radius)
                    .attr('fill', (d, i) => nodeStyle(d, i).fill)
                    .attr('stroke-width', (d, i) => nodeStyle(d, i).strokeWidth)
                    .attr('stroke', (d, i) => nodeStyle(d, i).stroke)
                    .on('click', (d) => {
                        const { event } = d3;
                        event.stopPropagation();

                        this.selection = [d.data];
                    })
                    .on('mouseover', (d, i) => {
                        this.root
                            .selectAll('.chart-node')
                            .filter(n => n === d)
                            .attr('r', nodeStyle(d, i).radiusOnHover);
                    })
                    .on('mouseleave', (d, i) => {
                        this.root
                            .selectAll('.chart-node')
                            .filter(n => n === d)
                            .attr('r', nodeStyle(d, i).radius);
                    }),
        });

        if (links === 'straight') {
            linksDatum = tree.links().map(link => ({
                link,
                x1: this.toRadial(link.source.x, link.source.y)[0],
                y1: this.toRadial(link.source.x, link.source.y)[1],
                x2: this.toRadial(link.target.x, link.target.y)[0],
                y2: this.toRadial(link.target.x, link.target.y)[1],
            }));
            drawLink = ChartDrawFactory(this.root, linksDatum);

            drawLink('.chart-link', {
                create: selection =>
                    selection
                        .append('line'),
                update: selection =>
                    selection
                        .attr('display', d => d.link.target.depth <= visibleLevels - 1 ? 'all' : 'none')
                        .attr('stroke', (d, i) => linkStyle(d, i).stroke)
                        .attr('stroke-opacity', (d, i) => linkStyle(d, i).strokeOpacity)
                        .attr('stroke-width', (d, i) => linkStyle(d, i).strokeWidth)
                        .attr('x1', d => d.x1)
                        .attr('y1', d => d.y1)
                        .attr('x2', d => d.x2)
                        .attr('y2', d => d.y2),
            });
        } else {
            linksDatum = tree.links();
            drawLink = ChartDrawFactory(this.root, linksDatum);

            drawLink('.chart-link', {
                create: selection =>
                    selection
                        .append('path'),
                update: selection =>
                    selection
                        .attr('display', d => d.target.depth <= visibleLevels - 1 ? 'all' : 'none')
                        .attr('d', d3.linkRadial()
                            .angle(d => d.x)
                            .radius(d => d.y))
                        .attr('fill', 'none')
                        .attr('stroke', (d, i) => linkStyle(d, i).stroke)
                        .attr('stroke-opacity', (d, i) => linkStyle(d, i).strokeOpacity)
                        .attr('stroke-width', (d, i) => linkStyle(d, i).strokeWidth),
            });
        }

    }

    private getRadius(state) {
        const { rect, offset } = state;
        return Math.min(rect.height, rect.width) / 2 - offset;
    }

    private toRadial(x: number, y: number) {
        return [(y = y) * Math.cos(x -= Math.PI / 2), (y) * Math.sin(x)];
    }

    private maxDepth(data) {
        const hierarchy = d3.hierarchy(data).sum(d => d.value).descendants();
        return hierarchy[hierarchy.length - 1].depth;
    }
}
