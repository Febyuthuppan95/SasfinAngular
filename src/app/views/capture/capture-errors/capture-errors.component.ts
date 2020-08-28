import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-capture-errors',
  templateUrl: './capture-errors.component.html',
  styleUrls: ['./capture-errors.component.scss']
})
export class CaptureErrorsComponent implements OnInit {

  constructor() { }

  @Input() errors: any = [];
  @Input() lines: any = [];
  @Input() lineErrors: any = [];
  @Input() open = false;

  ngOnInit() {
    console.log(this.open);
    console.log(this.lines);
    console.log(this.errors);
    console.log(this.lineErrors);
  }

}
