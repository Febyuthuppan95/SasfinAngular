import { Directive, AfterViewInit, OnDestroy, Optional, HostListener } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material';


@Directive({ selector: '[tab-directive]' })
export class TabDirective {
  observable: any;
  constructor(@Optional() private autoTrigger: MatAutocompleteTrigger) { }
  
  @HostListener('keydown.tab', ['$event.target'])onBlur()
  {
      console.log(this.autoTrigger.activeOption.value);
    if (this.autoTrigger.activeOption) {
        this.autoTrigger.writeValue(this.autoTrigger.activeOption.value)
      }
  }
//   ngAfterViewInit() {
//     this.observable = this.autoTrigger.panelClosingActions.subscribe(x => {
//       if (this.autoTrigger.activeOption) {
//         this.autoTrigger.writeValue(this.autoTrigger.activeOption.value)
//       }
//     })
//   }
//   ngOnDestroy() {
//     this.observable.unsubscribe();
//   }
}