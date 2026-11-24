import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartPortalService } from './chart-portal.service';
import { ChartPortalComponent } from './chart-portal.component';

@NgModule({
    providers: [
        ChartPortalService,
    ],
    imports: [
        CommonModule,
        ChartPortalComponent,
    ],
    exports: [
        ChartPortalComponent,
    ],
})
export class ChartPortalModule {
}
