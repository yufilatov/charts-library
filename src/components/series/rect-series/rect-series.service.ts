import { Injectable, inject } from '@angular/core';
import * as d3 from 'd3';
import { nextId } from '../../kit';
import { IChartSeriesState, CHART_DEFAULT_SERIES_STATE, createScaleX, createScaleY } from '../../common/chart-series';
import { ChartDisposable } from '../../common/chart-disposable';
import { ChartService } from '../../chart/chart.service';
import { ChartStyle } from '../../chart-style/chart-style';
import { ChartDrawFactory } from '../../common/chart-draw.factory';

export interface IChartRectSeriesState extends IChartSeriesState {
    total?: number;
    range?: { x: number[], y: number[] };
}

const DEFAULT_STATE: IChartRectSeriesState = {
    ...CHART_DEFAULT_SERIES_STATE,
};

@Injectable()
export class RectSeriesChartService {
    private root: d3.Selection<SVGElement, string, SVGElement, number>;
    private state = {
        ...DEFAULT_STATE,
        id: `chart-series-pie-${nextId()}`,
    };

    private readonly chartService = inject(ChartService);
    private readonly disposable = inject(ChartDisposable);

    constructor() {
        const selector = { id: this.state.id, level: 0 };
        this.root = this.chartService.select(selector);

        this.disposable.add(() => this.chartService.remove(selector));
    }

    checkSum(data, total) {
        let values = data;
        const sum = values.reduce((a, b) => a + b);

        if (sum < total) {
            values = values.concat(total - sum);
        }

        return values;
    }

    setState(state: IChartRectSeriesState) {
        const { rect, data, style, range } = state;

        if (!rect.height || !rect.width) {
            return;
        }

        this.root.selectAll('rect').remove();

        const draw = ChartDrawFactory(this.root, data);

        const scaleX = createScaleX('linear', {
            ...state as IChartSeriesState,
            data: range.x,
        });

        const scaleY = createScaleY('linear', {
            ...state as IChartSeriesState,
            data: [d3.max(range.y), d3.min(range.y)],
        });

        const maxX = d3.max(data[0]);
        const minX = d3.min(data[0]);
        const maxY = d3.max(data[1]);
        const minY = d3.min(data[1]);

        const rectStyle = style.compile(ChartStyle.rect);

        draw('.chart-rect', {
            create: selection =>
                selection
                    .append('rect'),
            update: selection =>
                selection
                    .attr('width', scaleX(maxX) - scaleX(minX))
                    .attr('height', scaleY(minY) - scaleY(maxY))
                    .attr('x', 1 + scaleX(minX))
                    .attr('y', scaleY(d3.max(range.y) - minY))
                    .attr('fill', (d, i) => rectStyle(d, i).fill),
        });

    }
}
