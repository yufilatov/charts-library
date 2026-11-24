import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAppStore } from './app/state/provide-app-store';
import { environment } from './environments/environment';
import { PagesModule } from 'src/pages/pages.module';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideRouter(routes),
        provideHttpClient(),
        provideAppStore(),
    ],
}).catch(err => console.error(err));
