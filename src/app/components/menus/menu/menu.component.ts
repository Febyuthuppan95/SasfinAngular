import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() contextShow: boolean;

  @Output() resetContext = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  popOff() {
    this.contextShow = false;
    this.resetContext.emit();
  }
}
