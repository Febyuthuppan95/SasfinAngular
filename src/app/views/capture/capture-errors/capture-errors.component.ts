import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-capture-errors',
  templateUrl: './capture-errors.component.html',
  styleUrls: ['./capture-errors.component.scss']
})
export class CaptureErrorsComponent implements OnInit {

  constructor() { }

  @Input() errors: any;

  ngOnInit() {
  }

}
