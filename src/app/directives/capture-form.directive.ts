import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCaptureForm]'
})
export class CaptureFormDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
