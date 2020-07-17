import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'loader',
  templateUrl: './spinning-loader.component.html',
  styleUrls: ['./spinning-loader.component.scss']
})
export class SpinningLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
