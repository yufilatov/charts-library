import { Directive, ElementRef, OnInit, input, inject } from '@angular/core';
import * as _ from 'lodash';

@Directive({
    selector: '[appStopPropagation]',
    standalone: false
})
export class StopPropagationDirective implements OnInit {
    events = input<string | string[]>();

    private readonly elementRef = inject(ElementRef);

    ngOnInit() {
        let events = [this.events()];

        if (!_.isArray(events)) {
            events = events;
        }

        events.forEach((eventName: string) =>
            this.elementRef.nativeElement.addEventListener(eventName, (e: Event) =>
                e.stopPropagation(),
            ));
    }
}
