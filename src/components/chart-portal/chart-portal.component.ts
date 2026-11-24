import { NgTemplateOutlet } from '@angular/common';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef, Renderer2, TemplateRef, inject } from '@angular/core';
import { ChartPortalPositionStrategy } from './chart-portal-position.strategy';

@Component({
    selector: 'app-chart-portal',
    templateUrl: './chart-portal.component.html',
    styleUrls: ['./chart-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class ChartPortalComponent {
    link: { templateRef: TemplateRef<any>, context: any };

    private readonly cd = inject(ChangeDetectorRef);
    private readonly elementRef = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    constructor() {
        this.renderer.addClass(this.elementRef.nativeElement, 'chart-portal');
    }

    attach(positionStrategy: ChartPortalPositionStrategy) {
        const move = positionStrategy.attach(this.elementRef.nativeElement, this.renderer);
        this.cd.detectChanges();

        return move;
    }
}
