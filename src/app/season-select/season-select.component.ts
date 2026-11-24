import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { appFeature, seasonSelected } from '../state/app.feature';

@Component({
    selector: 'app-season-select',
    templateUrl: './season-select.component.html',
    styleUrls: ['./season-select.component.scss'],
})
export class SeasonSelectComponent {
    readonly seasons = ['2026/27', '2025/26'];

    open = false;

    private readonly store = inject(Store);

    readonly selectedSeason = this.store.selectSignal(appFeature.selectSelectedSeason);

    formatSeason(season: string | null): string {
        if (season == null) {
            return '';
        }

        return season;
    }

    toggle(): void {
        this.open = !this.open;
    }

    choose(season: string): void {
        this.store.dispatch(seasonSelected({ season }));
        this.open = false;
    }
}
