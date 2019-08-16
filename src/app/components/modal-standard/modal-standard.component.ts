import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-standard',
  templateUrl: './modal-standard.component.html',
  styleUrls: ['./modal-standard.component.scss']
})
export class ModalStandardComponent implements OnInit {

  constructor() { }

  @Output() primaryButtonEvent = new EventEmitter<string>();

  ngOnInit() {
  }

  primaryEvent($event) {
    this.primaryButtonEvent.emit($event);
  }

}
