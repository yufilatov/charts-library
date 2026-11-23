import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ChartStyleBuilder } from 'src/components/chart-style/chart-style.builder';
import { ChartStyle } from 'src/components/chart-style/chart-style';
import { Observable, empty } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExampleDataService } from '../example-data-service';
import { getSumFromObjectValues } from 'src/components/kit';

@Component({
    selector: 'app-example-chart-bar-vertical',
    templateUrl: './example-chart-bar-vertical-series.component.html',
    styleUrls: [
        './example-chart-bar-vertical-series.component.scss',
        '../../styles/epl-emblems.scss',
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class ExampleChartBarVerticalSeriesComponent implements OnInit {
    @ViewChild('inputScored', { static: true }) inputScored: ElementRef;
    @ViewChild('inputConceded', { static: true }) inputConceded: ElementRef;

    data$: Observable<any>;
    clubs$: Observable<any>;

    margin = { left: 30, bottom: 25, right: 20, top: 0 };
    range = { x: [0, 21], y: [0, 130] };
    gridStep = { x: 0, y: 5 };

    ticksX = [];
    ticksY = [];

    seasons = [27, 26, 25, 24, 23, 20, 19, 18, 17, 16, 15];
    sorts = ['Position', 'Name', 'Goals Ascending', 'Goals Descending'];

    colors = ['#709a28', '#87ba30', '#c23612', '#e0471f'];

    sortBy;
    selectedSeason = 19;
    selectedSortBy = 'Position';

    constructor(private dataService: ExampleDataService) { }

    style = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {

            return { fill: this.colors[i], background: '#f1f3ca', size: 30 };
        })
        .for(ChartStyle.label, (d) => {
            const text = `${d}%`;

            return { text, fontSize: 9, fontWeight: 600 };
        });

    gridStyle = new ChartStyleBuilder()
        .for(ChartStyle.line, (d, i) => {

            return { stroke: '#C0C0C0', strokeDasharray: '1 1' };
        });

    ngOnInit() {
        for (let i = 1; i < Math.max(...this.range.x); i++) {
            this.ticksX.push(i);
        }

        for (let i = 5; i < Math.max(...this.range.y); i += 5) {
            this.ticksY.push(i);
        }

        this.requestData('for');
        this.requestClubs();
    }

    onSeasonChange() {
        this.requestClubs();
    }

    onSortChange() {
        switch (this.selectedSortBy) {
            case 'Name':
            default: {
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
        }

        this.requestClubs();
    }

    requestData(goals: 'for' | 'against' | 'both') {
        this.data$ = this.dataService.getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(map(x => x
                .sort(this.sortBy)
                .map(club =>
                    goals === 'for' ? [club.goals.for.home, club.goals.for.away] :
                        goals === 'against' ? [club.goals.against.home, club.goals.against.away] :
                            [club.goals.for.home, club.goals.for.away, club.goals.against.home, club.goals.against.away])
            ));
    }

    requestClubs() {
        this.clubs$ = this.dataService.getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(map(data => data
                .sort(this.sortBy)
                .map(club => club)
            ));
    }

    updateData(scored = true, conceded = false) {
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

    getSeason(season) {
        return `20${season - 1}/20${season}`;
    }

    getLogo(club) {
        return `logo logo-${club.replace(/\s+/g, '-').toLowerCase()}`;
    }
}
