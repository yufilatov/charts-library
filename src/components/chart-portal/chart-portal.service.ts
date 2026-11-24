import { Injectable, ApplicationRef, EnvironmentInjector, Injector, EmbeddedViewRef, TemplateRef, createComponent, inject } from '@angular/core';
import { ChartPortalPositionStrategy } from './chart-portal-position.strategy';
import { ChartPortalComponent } from './chart-portal.component';

@Injectable()
export class ChartPortalService {
    private readonly appRef = inject(ApplicationRef);
    private readonly injector = inject(Injector);

    enter(
        link: { templateRef: TemplateRef<any>, context: any },
        positionStrategy: ChartPortalPositionStrategy,
    ) {
        const componentRef = createComponent(ChartPortalComponent, {
            environmentInjector: this.appRef.injector as EnvironmentInjector,
            elementInjector: this.injector,
        });

        componentRef.instance.link = link;

        const hostView = componentRef.hostView as EmbeddedViewRef<any>;
        const hostElement = hostView.rootNodes[0] as Element;
        this.appRef.attachView(hostView);

        const move = componentRef.instance.attach(positionStrategy);

        const resource = {
            attach: move,
            detach: () => {
                if (hostElement.parentNode) {
                    hostElement.parentNode.removeChild(hostElement);
                    this.appRef.detachView(hostView);
                }
            },
        };

        return resource;
    }
}
