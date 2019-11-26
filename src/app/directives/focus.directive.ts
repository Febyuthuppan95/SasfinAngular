import {Directive, Input, ElementRef, Inject, OnChanges} from '@angular/core';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[focus]'
})
export class FocusDirective implements OnChanges {

    @Input()
    focus: boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}

    ngOnChanges() {
        this.element.nativeElement.focus();
    }
}
