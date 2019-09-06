import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appKeyHandler]'
})
export class KeyHandlerDirective {

  shortcutCompanyInfo = [17, 18, 76];
  shortcutExitCapture = [17, 18, 81];

  enteredShortcut: number[] = [];
  enteredCount = 1;
  previousKey = -1;

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (this.previousKey !== e.keyCode) {
      this.previousKey = e.keyCode;

      if (this.enteredCount === 3) {
        this.executeShortcut();
        this.previousKey = -1;
        this.enteredCount = 0;
      } else {
        this.enteredShortcut[this.enteredCount - 1] = e.keyCode;
        this.enteredCount++;
      }
    }
  }

  executeShortcut() {
    // Execute shortcut
  }
}
