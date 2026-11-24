import { Component, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
import { ChartStyle } from "src/components/chart-style/chart-style";
import { ChartStyleBuilder } from "src/components/chart-style/chart-style.builder";
import { Observable, Subscription } from "rxjs";
import { ExampleDataService } from "../data-service";
import { map } from "rxjs/operators";
import { ChartDisposable } from "src/components/common/chart-disposable";
import { ChartComponent } from "src/components/chart/chart.component";
import { BarSimpleSeriesChartComponent } from "src/components/series/bar-simple-series/bar-simple-series.component";
import { AsyncPipe } from '@angular/common';

@Component({
    selector: "app-examples-chart-bar",
    templateUrl: "./examples-chart-bar-simple-series.component.html",
    styleUrls: ["./examples-chart-bar-simple-series.component.scss"],
    providers: [ExampleDataService, ChartDisposable],
    imports: [AsyncPipe, ChartComponent, BarSimpleSeriesChartComponent],
})
export class ExampleChartBarSimpleSeriesComponent implements OnInit {
    prevDuration = 0;
    selectedSeason = 27;

    dataFor$: Observable<any>;
    dataAgainst$: Observable<any>;
    clubs$: Subscription;
    clubs;

    private readonly dataService = inject(ExampleDataService);
    private readonly disposable = inject(ChartDisposable);

    styleFor = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {
            const fill = i === 0 ? "#94c31a" : i === 1 ? "#bedb75" : "#f8f8f8";

            return { fill, height: 20, offsetLeft: 25 };
        })
        .for(ChartStyle.animation, (d, i) => {
            const duration = d * 10 + (100 - d) * 10;
            const delay = this.prevDuration;
            this.prevDuration =
                (i + 1) % 3 > 0 ? this.prevDuration + duration - 210 : 0;

            return { duration, delay, format: ".0" };
        });

    styleAgainst = new ChartStyleBuilder()
        .for(ChartStyle.bar, (d, i) => {
            const fill = i === 0 ? "#f7a704" : i === 1 ? "#faca68" : "#f8f8f8";

            return { fill, height: 20, offsetLeft: 25 };
        })
        .for(ChartStyle.animation, (d, i) => {
            const duration = d * 10 + (100 - d) * 10;
            const delay = this.prevDuration;
            this.prevDuration =
                (i + 1) % 3 > 0 ? this.prevDuration + duration - 210 : 0;

            return { duration, delay };
        });

    ngOnInit() {
        this.dataFor$ = this.dataService
            .getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(
                map((data) =>
                    data.map((club) => [
                        club.goals.for.home,
                        club.goals.for.away,
                        100 - club.goals.for.home - club.goals.for.away,
                    ]),
                ),
            );

        this.dataAgainst$ = this.dataService
            .getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(
                map((data) =>
                    data.map((club) => [
                        club.goals.against.home,
                        club.goals.against.away,
                        100 - club.goals.against.home - club.goals.against.away,
                    ]),
                ),
            );

        this.clubs$ = this.dataService
            .getData(`${this.selectedSeason - 1}${this.selectedSeason}`)
            .pipe(map((data) => data.map((club) => club.club)))
            .subscribe((data) => (this.clubs = data));

        this.disposable.add(() => this.clubs$.unsubscribe());
    }
}
