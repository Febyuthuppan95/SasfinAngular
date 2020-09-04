import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-capture-errors',
  templateUrl: './capture-errors.component.html',
  styleUrls: ['./capture-errors.component.scss']
})
export class CaptureErrorsComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() errors: any = [];
  @Input() lines: any = [];
  @Input() lineErrors: any = [];
  @Input() open = false;

  ngOnInit() {
    console.log(this.lineErrors);
  }

  ngOnChanges() {
    console.log(this.lineErrors);
  }

}
