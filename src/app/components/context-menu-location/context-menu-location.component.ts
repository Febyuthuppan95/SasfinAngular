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
  @Input() parentID: number;

  isCountry = false;
  isRegion = false;
  isCity = false;

  @Output() editItem = new EventEmitter<string>();
  @Output() addRegionEmit = new EventEmitter<number>();
  @Output() addCountryEmit = new EventEmitter<string>();
  @Output() addCityEmit = new EventEmitter<number>();

  ngOnInit() {
    if (this.locationType === 'country') {
      this.isCountry = true;
    } else if (this.locationType === 'region') {
      this.isRegion = true;
    } else if (this.locationType === 'city') {
      this.isCity = true;
    }
  }

  edit() {
    this.editItem.emit(JSON.stringify({
      locationID: this.locationID,
      locationName: this.locationName,
      locationType: this.locationType
    }));
  }

  addCity($event) {
    this.addCityEmit.emit(this.parentID);
  }

  addRegion($event) {
    this.addRegionEmit.emit(this.parentID);
  }

  addCountry($event) {
    this.addCountryEmit.emit($event);
  }

}
