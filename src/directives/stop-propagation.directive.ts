import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Directive({
    selector: '[appStopPropagation]',
    standalone: false
})
export class StopPropagationDirective implements OnInit {
    @Input() events: string | string[];

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        let events = [this.events];

        if (!_.isArray(events)) {
            events = events;
        }

        events.forEach((eventName: string) =>
            this.elementRef.nativeElement.addEventListener(eventName, (e: Event) =>
                e.stopPropagation(),
            ));
    }
}
