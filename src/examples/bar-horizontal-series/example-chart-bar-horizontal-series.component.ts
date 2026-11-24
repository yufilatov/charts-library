import { Observable, empty } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ExampleDataService } from '../data-service';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { getSumFromObjectValues } from 'src/components/kit';
import { AsyncPipe, NgClass } from '@angular/common';
import { ChartComponent } from 'src/components/chart/chart.component';
import { BarSeriesChartComponent } from 'src/components/series/bar-series/bar-series.component';
import { GridSeriesChartComponent, Range } from 'src/components/series/grid-series/grid-series.component';
import { XAxisChartComponent } from 'src/components/x-axis/x-axis.component';
import { YAxisChartComponent } from 'src/components/y-axis/y-axis.component';
import { ChartPlotComponent } from 'src/components/chart-plot/chart-plot.component';

@Component({
    selector: 'app-example-chart-bar-horizontal',
    templateUrl: './example-chart-bar-horizontal-series.component.html',
    styleUrls: [
        './example-chart-bar-horizontal-series.component.scss',
        '../../styles/epl-emblems.scss',
    ],
    imports: [
        AsyncPipe,
        NgClass,
        ChartComponent,
        BarSeriesChartComponent,
        GridSeriesChartComponent,
        XAxisChartComponent,
        YAxisChartComponent,
        ChartPlotComponent,
    ],
    providers: [ExampleDataService],
})
export class ExampleChartBarHorizontalSeriesComponent implements OnInit {
    @ViewChild('inputScored', { static: true }) inputScored: ElementRef;
    @ViewChild('inputConceded', { static: true }) inputConceded: ElementRef;

    data$: Observable<any>;
    clubs$: Observable<any>;

    margin = { left: 30, bottom: 20, right: 20, top: 0 };
    range: Range = { x: [0, 100], y: [0, 21] };
    gridStep = { x: 5, y: 0 };

    ticksX = [];
    ticksY = [];

    seasons = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15];
    sorts = ['Position', 'Name', 'Goals Ascending', 'Goals Descending'];

    colors = ['#709a28', '#87ba30', '#c23612', '#e0471f'];

    sortBy;
    selectedSeason = 27;
    selectedSortBy = 'Position';
    openMenu: 'season' | 'sort' | null = null;

    private readonly dataService = inject(ExampleDataService);

    style = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => ({ fill: this.colors[i], background: '#f1f3ca', size: 25 }))
        .for(ChartStyle.label, (d) => {
            const text = `${d}%`;

            return { text, fontSize: 9, fontWeight: 600 };
        });

    gridStyle = new ChartStyleBuilder()
        .for(ChartStyle.line, (d, i) => ({ stroke: '#C0C0C0', strokeDasharray: '1 1' }));

    ngOnInit(): void {
        for (let i = 5; i < Math.max(...this.range.x); i += 5) {
            this.ticksX.push(i);
        }

        for (let i = 1; i < Math.max(...this.range.y); i++) {
            this.ticksY.push(i);
        }

        this.requestData('for');
        this.requestClubs();
    }

    toggleMenu(menu: 'season' | 'sort') {
        this.openMenu = this.openMenu === menu ? null : menu;
    }

    chooseSeason(season: number) {
        this.selectedSeason = season;
        this.openMenu = null;
        this.onSeasonChange();
        this.updateData(this.inputScored.nativeElement.checked, this.inputConceded.nativeElement.checked);
    }

    chooseSort(sort: string) {
        this.selectedSortBy = sort;
        this.openMenu = null;
        this.onSortChange();
        this.updateData(this.inputScored.nativeElement.checked, this.inputConceded.nativeElement.checked);
    }

    onSeasonChange() {
        this.requestClubs();
    }

    onSortChange() {
        switch (this.selectedSortBy) {
            case 'Name': {
                this.sortBy = (a, b) => a.club.localeCompare(b.club);
                break;
            }
            case 'Position': {
                this.sortBy = (a, b) => a.points != null && b.points != null ? b.points - a.points : a.position - b.position;
                break;
            }
            case 'Goals Descending': {
                if (this.inputScored.nativeElement.checked && this.inputConceded.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(a.goals.for, a.goals.against) - getSumFromObjectValues(b.goals.for, b.goals.against);
                } else if (this.inputScored.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(a.goals.for) - getSumFromObjectValues(b.goals.for);
                } else if (this.inputConceded.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(a.goals.against) - getSumFromObjectValues(b.goals.against);
                }
                break;
            }
            case 'Goals Ascending': {
                if (this.inputScored.nativeElement.checked && this.inputConceded.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(b.goals.for, b.goals.against) - getSumFromObjectValues(a.goals.for, a.goals.against);
                } else if (this.inputScored.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(b.goals.for) - getSumFromObjectValues(a.goals.for);
                } else if (this.inputConceded.nativeElement.checked) {
                    this.sortBy = (a, b) => getSumFromObjectValues(b.goals.against) - getSumFromObjectValues(a.goals.against);
                }
                break;
            }
            default: {
                this.sortBy = (a, b) => a.club.localeCompare(b.club);
                break;
            }
        }

        this.requestClubs();
    }

    requestData(goals: 'for' | 'against' | 'both'): void {
        this.data$ = this.dataService.getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(map(x => x
                .sort(this.sortBy)
                .map(club =>
                    goals === 'for' ? [club.goals.for.home, club.goals.for.away] :
                        goals === 'against' ? [club.goals.against.home, club.goals.against.away] :
                            [club.goals.for.home, club.goals.for.away, club.goals.against.home, club.goals.against.away])
            ));
    }

    requestClubs(): void {
        this.clubs$ = this.dataService.getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(map(data => data
                .sort(this.sortBy)
                .map(club => club)
            ));
    }

    updateData(scored = true, conceded = false): void {
        if (scored && conceded) {
            this.colors = ['#709a28', '#87ba30', '#c23612', '#e0471f'];

            this.onSortChange();
            this.requestData('both');
        } else {
            if (scored) {
                this.colors = ['#709a28', '#87ba30'];

                this.onSortChange();
                this.requestData('for');
            } else {
                if (conceded) {
                    this.colors = ['#c23612', '#e0471f'];

                    this.onSortChange();
                    this.requestData('against');
                } else {
                    this.data$ = empty();
                    this.clubs$ = empty();
                }
            }
        }
    }

    getSeason(season): string {
        return `20${season - 1}/20${season}`;
    }

    getLogo(club): string {
        return `logo logo-${club.replace(/\s+/g, '-').toLowerCase()}`;
    }
}
