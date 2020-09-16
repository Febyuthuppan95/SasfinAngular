import {Directive, Input, ElementRef, Inject, HostListener} from '@angular/core';
import { HelpSnackbar } from '../services/HelpSnackbar.service';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[help]'
})
export class HelpDirective {

    @Input()
    slug: string;

    constructor(
      @Inject(ElementRef) private element: ElementRef,
      private help: HelpSnackbar) {}

    @HostListener('focusin')
    setHelp = (): void => {
      console.log(this.slug);

      this.help.setHelpContext({
        display: true,
        slug: this.slug
      });
    }
}
