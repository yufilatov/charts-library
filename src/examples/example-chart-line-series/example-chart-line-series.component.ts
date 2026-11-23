import { Component, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { DATA19, DATA20 } from './data';
import { COLORS_EPL } from 'src/styles/colors';

@Component({
    selector: 'app-example-chart-line-types',
    templateUrl: './example-chart-line-series.component.html',
    styleUrls: ['./example-chart-line-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ExampleChartLineSeriesComponent implements OnInit {
    COLORS = COLORS_EPL;
    DATA = DATA19;

    seasons = [27, 26, 25, 24, 23, 20, 19, 18, 17, 15, 16];
    selectedSeason = 27;

    data = [];
    range = { x: [], y: {} };
    ticksX = [];
    ticksY = [];
    indicators = [];
    colors = [];
    reverse;
    chart;
    season;
    zones;
    margin = { left: 30, bottom: 30 };

    barStyle = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {

            return { height: 150, fill: this.colors[i + 9] };
        });

    ngOnInit() {
        this.onSeasonChange('19');
        this.onChartChange('position');
        this.zones = [[0, 4.5], [4.5, 6.5], [6.5, 7.5], [7.5, 17.5], [17.5, 21]];

    }

    onClick(index) {
        if (!this.indicators.includes(index)) {
            this.indicators.push(index);
        }
        if (this.chart === 'position') {
            if (!this.data[index] || this.data[index].length < 1) {
                this.data[index] = this.getDataPosition(this.DATA[index].position);
            } else { this.data[index] = []; }
        } else {
            if (!this.data[index] || this.data[index] < 1) {
                this.data[index] = this.getDataPoints(this.DATA[index].points);
            } else { this.data[index] = []; }
        }
    }

    getStyle(index) {
        let ind = index;
        if (index === this.data.length - 1 && this.indicators.length) {
            ind = this.indicators[0];
            this.indicators.shift();
        }
        return new ChartStyleBuilder()
            .for(ChartStyle.circle, d => {
                return { fill: this.colors[ind], stroke: this.colors[ind], radius: 2.5 };
            })
            .for(ChartStyle.line, () => {
                return { stroke: this.colors[ind], strokeWidth: 1.5 };
            });
    }

    rectStyle(index) {
        return new ChartStyleBuilder()
            .for(ChartStyle.rect, () => {
                const colors = ['#BBF3BB', '#BBF3FF', '#CCF9FF', '#ffffff', '#FFBBBB'];

                return { fill: colors[index] };
            });
    }

    getDataPosition(position) {
        const result = [];
        for (let i = 0; i < position.length; i++) {
            result.push([i + 1, 21 - position[i]]);
        }

        return result;
    }

    getDataPoints(points) {
        const result = [];
        for (let i = 0; i < points.length; i++) {
            result.push([i, points[i]]);
        }

        return result;
    }

    onSeasonChange(season) {
        if (season === this.season) {
            return;
        }

        if (season === '19') {
            this.DATA = DATA19;
            this.season = '19';

        } else {
            this.DATA = DATA20;
            this.season = '20';
        }
        this.data = this.chart === 'position' ? [this.getDataPosition(this.DATA[0].position)] : [this.getDataPoints(this.DATA[0].points)];
        this.colors = [];

        for (let i = 0; i <= this.DATA.length - 1; i++) {
            for (let j = 0; j <= this.COLORS.length - 1; j++) {
                if (this.DATA[i].club === this.COLORS[j].club) {
                    this.colors.push(this.COLORS[j].color);
                }
            }

        }
    }

    onChartChange(chart) {
        if (this.chart === chart) {
            return;
        }

        this.chart = chart;
        this.ticksX = [];
        this.ticksY = [];
        const newData = [];

        switch (chart) {
            case 'position': {
                for (let i = 0; i <= this.data.length - 1; i++) {
                    if (this.data[i] && this.data[i].length) {
                        newData[i] = this.getDataPosition(this.DATA[i].position);
                    } else {
                        newData[i] = [];
                    }
                }
                this.data = newData;
                this.range = {
                    x: [0, 39],
                    y: [0, 21],
                };
                for (let i = 0; i <= 38; i++) {
                    this.ticksX.push(i);
                }

                for (let i = 21; i >= 0; i--) {
                    if (i !== 0 && i !== 21) {
                        this.ticksY.push(i);
                    }
                }
                this.reverse = true;
                break;
            }
            case 'points': {
                for (let i = 0; i <= this.data.length - 1; i++) {
                    if (this.data[i] && this.data[i].length) {
                        newData[i] = this.getDataPoints(this.DATA[i].points);
                    } else {
                        newData[i] = [];
                    }
                }
                this.data = newData;
                this.range = {
                    x: [0, 39],
                    y: [0, 100],
                };

                for (let i = 0; i <= 38; i++) {
                    this.ticksX.push(i);
                }
                for (let i = 0; i <= 100; i = i + 5) {
                    this.ticksY.push(i);
                }
                this.reverse = false;
                break;
            }
        }
    }

    format(name) {
        return `form-check form-check-${name.toLowerCase().replace(/[&, \s]/g, '')}`;
    }

    getSeason(season) {
        return `20${season - 1}/20${season}`;
    }

}
