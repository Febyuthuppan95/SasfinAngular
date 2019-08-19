import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu-location',
  templateUrl: './context-menu-location.component.html',
  styleUrls: ['./context-menu-location.component.scss']
})
export class ContextMenuLocationComponent implements OnInit {

  constructor() { }

  @Input() x: number;
  @Input() y: number;
  @Input() locationID: number;
  @Input() locationName: string;
  @Input() locationType: string;
  @Input() currentTheme: string;

  @Output() editItem = new EventEmitter<string>();

  ngOnInit() {
  }

  edit() {
    this.editItem.emit(JSON.stringify({
      locationID: this.locationID,
      locationName: this.locationName,
      locationType: this.locationType
    }));
  }

}
