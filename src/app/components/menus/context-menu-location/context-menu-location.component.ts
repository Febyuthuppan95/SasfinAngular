import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-context-menu-location',
  templateUrl: './context-menu-location.component.html',
  styleUrls: ['./context-menu-location.component.scss']
})
export class ContextMenuLocationComponent implements OnInit, AfterViewInit {

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
  @Output() deleteRegionEmit = new EventEmitter<string>();
  @Output() deleteCountryEmit = new EventEmitter<string>();
  @Output() deleteCityEmit = new EventEmitter<string>();
  @ViewChild('popCont', {static: false}) elementView: ElementRef;
  contentHeight: number;
  contentWidth: number;

  ngOnInit() {
    if (this.locationType === 'country') {
      this.isCountry = true;
    } else if (this.locationType === 'region') {
      this.isRegion = true;
    } else if (this.locationType === 'city') {
      this.isCity = true;
    }
  }

  ngAfterViewInit(){
    this.contentHeight = this.elementView.nativeElement.offsetHeight;
    this.contentWidth = this.elementView.nativeElement.offsetWidth;
    if (window.innerHeight < this.contentHeight + this.y)
    {
      this.y = window.innerHeight - this.contentHeight;
    }
    if (window.innerWidth < 118 + this.x){
      this.x = window.innerWidth - 118;
    }
  }

  edit() {
    this.editItem.emit(JSON.stringify({
      locationID: this.locationID,
      locationName: this.locationName,
      locationType: this.locationType
    }));
  }

  delete() {
    const emit = {
      locationID: this.locationID,
    };

    const stringEmit = JSON.stringify(emit);

    if (this.locationType === 'country') {
      this.deleteCountryEmit.emit(stringEmit);
    } else if (this.locationType === 'region') {
      this.deleteRegionEmit.emit(stringEmit);
    } else {
      this.deleteCityEmit.emit(stringEmit);
    }
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
