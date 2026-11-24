import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export const seasonSelected = createAction(
    '[Season Select] Season Selected',
    props<{ season: string }>(),
);

export interface AppState {
    ready: boolean;
    selectedSeason: string | null;
}

export const initialAppState: AppState = {
    ready: true,
    selectedSeason: '2026/27',
};

export const appFeature = createFeature({
    name: 'app',
    reducer: createReducer(
        initialAppState,
        on(seasonSelected, (state, { season }) => ({
            ...state,
            selectedSeason: season,
        })),
    ),
});
