import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-tariffs',
  templateUrl: './context-menu-tariffs.component.html',
  styleUrls: ['./context-menu-tariffs.component.scss']
})
export class ContextMenuTariffsComponent implements OnInit {

  constructor() { }

  @Output() dutyTypes = new EventEmitter<void>();

  ngOnInit() {
  }

}
