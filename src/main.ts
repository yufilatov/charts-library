import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { environment } from './environments/environment';
import { ExampleChartsModule } from 'src/examples/example-charts.module';
import { PagesModule } from 'src/pages/pages.module';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideRouter(routes),
        importProvidersFrom(ExampleChartsModule, PagesModule),
    ],
}).catch(err => console.error(err));
