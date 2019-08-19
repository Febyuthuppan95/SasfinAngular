import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlaceService } from 'src/app/services/Place.Service';
import { ListCountriesRequest } from 'src/app/models/HttpRequests/ListCountriesRequest';
import { LocationsList, LocationItems, Regions, Cities } from 'src/app/models/HttpResponses/LocationsList';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-view-places',
  templateUrl: './view-places.component.html',
  styleUrls: ['./view-places.component.scss']
})
export class ViewPlacesComponent implements OnInit {

  constructor(private placeService: PlaceService, private themeService: ThemeService) {}

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  displayResults: string;
  dataset: LocationsList;
  dataResult: LocationItems[] = [];
  regions: Regions[] = [];
  cities: Cities[] = [];
  request: ListCountriesRequest = {
    specificCountryID: -1,
    filter: '',
    orderBy: 'Name',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15,
    rightName: 'Places',
    userID: 4,
  };

  locationID: number;
  locationName: string;
  locationType: string;

  showLoader = false;
  noData = false;
  selectedRow: string;
  currentTheme = 'light';

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadData();
  }

  loadData() {
    this.placeService.getAll(this.request).then(
      (res: LocationsList) => {
        this.dataset = res;
        this.dataResult = this.placeService.getCountries(this.dataset);
      },
      (msg) => {
        console.log('Something went wrong');
      }
    );
  }

  setSelectedRow(hash: string) {
    this.selectedRow = hash;
  }

  editLocation() {
    // TODO
  }

  popClick(event, id, name, type) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.locationID = id;
    this.locationName = name;
    this.locationType = type;

    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = '';
  }

  locationModal($event) {
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.openModal.nativeElement.click();
  }
}



