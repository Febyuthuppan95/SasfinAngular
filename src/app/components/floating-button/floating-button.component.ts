import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {

  constructor() { }

  @Output() myEvent = new EventEmitter<string>();

  ngOnInit() {
  }

  public clickEvent() {
    this.myEvent.emit('toggleEditSidebar');
  }

}
