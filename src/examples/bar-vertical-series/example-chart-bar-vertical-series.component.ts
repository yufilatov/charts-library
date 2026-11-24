import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { appFeature } from 'src/app/state/app.feature';
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

type GoalsMode = 'for' | 'against';

@Component({
    selector: 'app-example-chart-bar-vertical',
    templateUrl: './example-chart-bar-vertical-series.component.html',
    styleUrls: [
        './example-chart-bar-vertical-series.component.scss',
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
})
export class ExampleChartBarVerticalSeriesComponent implements OnInit {
    margin = { left: 30, bottom: 20, right: 20, top: 0 };
    range: Range = { x: [0, 21], y: [0, 100] };
    gridStep = { x: 0, y: 5 };

    ticksX = [];
    ticksY = [];

    sorts = ['Position', 'Name', 'Goals Ascending', 'Goals Descending'];

    colors = ['#709a28', '#87ba30'];
    goalsMode: GoalsMode = 'for';

    sortBy = (a, b) => a.points != null && b.points != null ? b.points - a.points : (a.position ?? 0) - (b.position ?? 0);
    selectedSortBy = 'Position';
    openMenu: 'sort' | null = null;

    private readonly dataService = inject(ExampleDataService);
    private readonly store = inject(Store);
    private readonly goals$ = new BehaviorSubject<GoalsMode>('for');
    private readonly resort$ = new BehaviorSubject(0);

    private readonly clubsSource$ = this.store.select(appFeature.selectSelectedSeason).pipe(
        filter((season): season is string => !!season),
        distinctUntilChanged(),
        switchMap(season => this.dataService.getData(season).pipe(
            catchError(() => of([])),
        )),
        shareReplay({ bufferSize: 1, refCount: true }),
    );

    clubs$: Observable<any> = combineLatest([this.clubsSource$, this.goals$, this.resort$]).pipe(
        map(([clubs]) => clubs.slice().sort(this.sortBy)),
    );

    data$: Observable<any> = combineLatest([this.clubsSource$, this.goals$, this.resort$]).pipe(
        map(([clubs, goals]) => this.toSeries(clubs, goals)),
    );

    style = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => ({ fill: this.colors[i], background: '#f1f3ca', size: 25 }))
        .for(ChartStyle.label, (d) => {
            const text = `${d}%`;

            return { text, fontSize: 9, fontWeight: 600 };
        });

    gridStyle = new ChartStyleBuilder()
        .for(ChartStyle.line, (d, i) => ({ stroke: '#C0C0C0', strokeDasharray: '1 1' }));

    ngOnInit(): void {
        for (let i = 1; i < Math.max(...this.range.x); i++) {
            this.ticksX.push(i);
        }

        for (let i = 5; i < Math.max(...this.range.y); i += 5) {
            this.ticksY.push(i);
        }

        this.onSortChange();
    }

    toggleMenu(menu: 'sort') {
        this.openMenu = this.openMenu === menu ? null : menu;
    }

    chooseSort(sort: string) {
        this.selectedSortBy = sort;
        this.openMenu = null;
        this.refresh();
    }

    onSortChange() {
        switch (this.selectedSortBy) {
            case 'Name': {
                this.sortBy = (a, b) => a.club.localeCompare(b.club);
                break;
            }
            case 'Position': {
                this.sortBy = (a, b) => a.points != null && b.points != null ? b.points - a.points : (a.position ?? 0) - (b.position ?? 0);
                break;
            }
            case 'Goals Descending': {
                this.sortBy = this.goalsMode === 'for'
                    ? (a, b) => getSumFromObjectValues(a.goals.for) - getSumFromObjectValues(b.goals.for)
                    : (a, b) => getSumFromObjectValues(a.goals.against) - getSumFromObjectValues(b.goals.against);
                break;
            }
            case 'Goals Ascending': {
                this.sortBy = this.goalsMode === 'for'
                    ? (a, b) => getSumFromObjectValues(b.goals.for) - getSumFromObjectValues(a.goals.for)
                    : (a, b) => getSumFromObjectValues(b.goals.against) - getSumFromObjectValues(a.goals.against);
                break;
            }
            default: {
                this.sortBy = (a, b) => a.club.localeCompare(b.club);
                break;
            }
        }
    }

    selectGoals(goals: GoalsMode): void {
        this.goalsMode = goals;
        this.colors = goals === 'for'
            ? ['#709a28', '#87ba30']
            : ['#c23612', '#e0471f'];
        this.refresh();
    }

    private refresh(): void {
        this.onSortChange();
        this.goals$.next(this.goalsMode);
        this.resort$.next(this.resort$.value + 1);
    }

    getLogo(club): string {
        return `logo logo-${club.replace(/\s+/g, '-').toLowerCase()}`;
    }

    private toSeries(clubs: any[], goals: GoalsMode) {
        return clubs.slice().sort(this.sortBy).map(club =>
            goals === 'for'
                ? [club.goals.for.home, club.goals.for.away]
                : [club.goals.against.home, club.goals.against.away],
        );
    }
}
