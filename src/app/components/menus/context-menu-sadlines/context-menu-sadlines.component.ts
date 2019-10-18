import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-sadlines',
  templateUrl: './context-menu-sadlines.component.html',
  styleUrls: ['./context-menu-sadlines.component.scss']
})
export class ContextMenuSADLinesComponent implements OnInit {

  constructor() { }

  @Output() editEvent = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<void>();

  ngOnInit() {
  }

  edit() {
    this.editEvent.emit();
  }

  remove() {
    this.deleteEvent.emit();
  }

}
