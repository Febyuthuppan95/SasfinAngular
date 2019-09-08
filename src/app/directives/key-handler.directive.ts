import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appKeyHandler]'
})
export class KeyHandlerDirective {

  // Predefined shortcut sequences
  shortcutCompanyInfo = [17, 18, 76]; // CTRL + ALT + L
  shortcutExitCapture = [17, 18, 79]; // CTRL + ALT + O
  shortcutPDFZoomOut = [17, 18, 109]; // CTRL + ALT + '-'
  shortcutPDFZoomIn = [17, 18, 107]; // CTRL + ALT + '+'
  shortcutPDFScrollDown = [17, 18, 40]; // CTRL + ALT + ArrowDown
  shortcutPDFScrollUp = [17, 18, 38]; // CTRL + ALT + ArrowUp
  // Control variables
  enteredShortcut: number[] = [];
  enteredCount = 0;
  previousKey = -1;
  sequenceLimit = 3;

  // Output declarations
  @Output() exitScreenEmit = new EventEmitter<void>();
  @Output() companyInfoEmit = new EventEmitter<void>();
  @Output() pdfZoomInEmit = new EventEmitter<void>();
  @Output() pdfZoomOutEmit = new EventEmitter<void>();
  @Output() pdfScrollDownEmit = new EventEmitter<void>();
  @Output() pdfScrollUpEmit = new EventEmitter<void>();

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    // Prevents duplicate keys
    if (this.previousKey !== e.keyCode) {
      this.previousKey = e.keyCode;

      // Add key to entered shortcut sequence
      this.enteredShortcut[this.enteredCount] = e.keyCode;
      this.enteredCount++;

      // Checks if entered keys equals shortcut sequence limit
      if (this.enteredShortcut.length === this.sequenceLimit) {

        // Execute sequence
        this.executeShortcut();

        // Reset control variables
        this.clearShortcut();
      }
    }

    this.timeoutClear();
  }

  // Determine shortcut entered
  executeShortcut(): void {
    if (this.match(this.shortcutCompanyInfo)) {
      this.companyInfo();
    } else if (this.match(this.shortcutExitCapture)) {
      this.exitScreen();
    } else if (this.match(this.shortcutPDFZoomIn)) {
      this.pdfZoomIn();
    } else if (this.match(this.shortcutPDFZoomOut)) {
      this.pdfZoomOut();
    } else if (this.match(this.shortcutPDFScrollDown)) {
      this.pdfScrollDown();
    } else if (this.match(this.shortcutPDFScrollUp)) {
      this.pdfScrollUp();
    }
  }

  match(shortcut: Array<number>): boolean {
    if (shortcut.length !== this.enteredShortcut.length) {
        return false;
    }
    for (let i = shortcut.length; i--;) {
        if (shortcut[i] !== this.enteredShortcut[i]) {
            return false;
        }
    }

    return true;
  }

  clearShortcut(): void {
    this.previousKey = -1;
    this.enteredCount = 0;
    this.enteredShortcut = [];
  }

  timeoutClear(): void {
    setTimeout(() => this.clearShortcut(), 3000);
  }

  /*
  * Shortcut Emissions
  */

  // Common Controls
  exitScreen() { this.exitScreenEmit.emit(); }

  // Company Controls
  companyInfo() { this.companyInfoEmit.emit(); }

  // PDF Controls
  pdfZoomIn() { this.pdfZoomInEmit.emit(); }
  pdfZoomOut() { this.pdfZoomOutEmit.emit(); }
  pdfScrollDown() { this.pdfScrollDownEmit.emit(); }
  pdfScrollUp() { this.pdfScrollUpEmit.emit(); }
}
