import { Component, Input, TemplateRef, NgZone, ContentChild, AfterContentInit, ChangeDetectionStrategy, ViewEncapsulation, Renderer2, HostBinding } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { ChartPortalService } from '../chart-portal/chart-portal.service';
import { ChartDisposable } from '../common/chart-disposable';
import { ChartService } from '../chart/chart.service';
import { ChartComponent } from '../chart/chart.component';
import { ChartPortalPositionStrategy } from '../chart-portal/chart-portal-position.strategy';

@Component({
    selector: 'app-chart-popup',
    templateUrl: './chart-popup.component.html',
    styleUrls: ['./chart-popup.component.scss'],
    providers: [
        ChartDisposable,
        ChartPortalService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line:use-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class ChartPopupComponent implements AfterContentInit {
    @ContentChild(TemplateRef, { static: false }) templateRef: TemplateRef<any>;
    @Input() for: string;
    @Input() openDelay = 1000;
    @Input() panelClass = 'chart-popup';

    constructor(
        private chartService: ChartService,
        private zone: NgZone,
        private portalService: ChartPortalService,
        private renderer: Renderer2,
        private chart: ChartComponent,
        private disposable: ChartDisposable,
    ) { }

    ngAfterContentInit() {
        let attachment = null;
        let position: [number, number];

        const show = () => {
            if (position) {
                const path = this.chartService.hitTest(position);
                const target = path.filter(x => x.hasAttribute(`chart-${this.for}-selector-hover`));
                if (target.length) {
                    const datum = d3.select(target[0]).datum();
                    const classList = ['chart-popup', this.panelClass];
                    const strategy = new ChartPortalPositionStrategy(classList, document, position);
                    const link = {
                        templateRef: this.templateRef,
                        context: {
                            $implicit: datum,
                        },
                    };

                    attachment = this.portalService.enter(link, strategy);
                    attachment.attach();
                }
            }
        };

        const hide = () => {
            position = null;

            if (attachment) {
                attachment.detach();
                attachment = null;
            }
        };

        this.zone.runOutsideAngular(() => {
            const showWithDelay = _.debounce(show, this.openDelay);

            this.chartService
                .selectRoot()
                .on('mousemove', (event) => {
                    hide();

                    position = [event.clientX, event.clientY];

                    showWithDelay();
                })
                .on('mouseleave', hide);
        });

        this.zone.runOutsideAngular(() => {
            document.addEventListener('scroll', hide, true);
            this.disposable.add(() => document.removeEventListener('scroll', hide));

            const rectChange = this.chart.rectChange.subscribe(hide);
            this.disposable.add(() => rectChange.unsubscribe());

            this.disposable.add(this.renderer.listen(document, 'mousedown', hide));
        });
    }
}
