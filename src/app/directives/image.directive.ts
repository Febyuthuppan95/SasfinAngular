import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
   }
})
export class ImageDirective {
  @Input() src: string;
  @Output() hide: EventEmitter<boolean>;

  public onError() {
      this.hide.emit(true);
  }
}
