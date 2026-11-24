import { Injectable, inject } from '@angular/core';
import { nextId } from '../../kit';
import { ChartService } from '../../chart/chart.service';
import { ChartDisposable } from '../../common/chart-disposable';
import { IChartPieSeriesState } from '../line-series/line-series.service';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE } from '../../common/chart-series';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';
import cloud from 'd3.layout.cloud';
import * as d3 from 'd3';

const DEFAULT_STATE: IChartSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class WordCloudSeriesService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-word-cloud-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };

        this.root = this.chartService.select(selector);
        this.disposable.add(() => this.chartService.remove(selector));
    }

    setState(state: IChartPieSeriesState) {
        this.state = {
            ...this.state,
            ...state,
        };

        const { style, rect, data } = this.state;

        if (!rect.height || !rect.width) {
            return this.state;
        }
        this.root.selectAll('text').remove();

        const labelStyle = style.compile(ChartStyle.label);

        const fontSize = d3.scaleLinear()
            .domain([Math.min(...data.map((a) => a.area)), Math.max(...data.map((a) => a.area))])
            .range([15, rect.width / 10]);

        const drawChart = (words) => {
            const draw = ChartDrawFactory(this.root, words);

            draw(`.chart-word-cloud-text-${nextId()}`, {
                create: selection =>
                    selection
                        .append('text'),
                update: selection =>
                    selection
                        .attr('font-size', d => fontSize(d.area))
                        .attr('chart-word-cloud-text', true)
                        .attr('font-weight', (d, i) => labelStyle(d, i).fontWeight)
                        .attr('text-anchor', 'middle')
                        .attr('fill', (d, i) => labelStyle(d, i).color)
                        .attr('transform', d => `translate(${d.x + rect.width / 2}, ${d.y + rect.height / 2})rotate(${d.rotate})`)
                        .text(d => d.text),
            });
        };

        const layout = cloud()
            .size([rect.width, rect.height])
            .words(data.map(d => ({ text: d.country, area: d.area })))
            .fontSize(d => fontSize(d.area))
            .padding(2.5)
            .font('Impact')
            .on('end', drawChart);

        layout.start();

        return this.state;
    }
}
