import { EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appFeature } from './app.feature';

export function provideAppStore(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStore(),
        provideState(appFeature),
        provideEffects(),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
        }),
    ]);
}
