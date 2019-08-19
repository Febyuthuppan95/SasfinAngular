import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlaceService } from 'src/app/services/Place.Service';
import { ListCountriesRequest } from 'src/app/models/HttpRequests/ListCountriesRequest';
import { LocationsList, LocationItems, Regions, Cities } from 'src/app/models/HttpResponses/LocationsList';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';

@Component({
  selector: 'app-view-places',
  templateUrl: './view-places.component.html',
  styleUrls: ['./view-places.component.scss']
})
export class ViewPlacesComponent implements OnInit {

  constructor(private placeService: PlaceService, private themeService: ThemeService,
              private userService: UserService) {}

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  @ViewChild('addModalOpen', { static: true })
  addModalOpen: ElementRef;

  @ViewChild('addModalClose', { static: true })
  addModalClose: ElementRef;

  currentUser = this.userService.getCurrentUser();

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
  locationParentID: number;

  newLocationName: string;

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

  addCountryModal($event) {
    this.locationType = 'country';
    this.addModalOpen.nativeElement.click();
  }
  addRegionModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'region';
    this.addModalOpen.nativeElement.click();
  }
  addCityModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'city';
    this.addModalOpen.nativeElement.click();
  }

  addLocation() {
   if (this.locationType === 'country') {
    const requestModel = {
      userID: this.currentUser.userID,
      name: this.newLocationName,
      rightName: 'Places',
    };

    this.placeService.addCountry(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.newLocationName = '';
          this.addModalClose.nativeElement.click();
          this.loadData();
        } else {
          alert('Error Adding');
        }
      },
      (msg) => {
        alert('Error');
      }
    );
   } else if (this.locationType === 'region') {
    const requestModel = {
      userID: this.currentUser.userID,
      countryID: this.locationParentID,
      name: this.newLocationName,
      rightName: 'Places',
    };

    this.placeService.addRegion(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.newLocationName = '';
          this.addModalClose.nativeElement.click();
          this.loadData();
        } else {
          alert('Error Adding');
        }
      },
      (msg) => {
        alert('Error');
      }
    );
   } else {
    const requestModel = {
      userID: this.currentUser.userID,
      regionID: this.locationParentID,
      name: this.newLocationName,
      rightName: 'Places',
    };

    this.placeService.addCity(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.newLocationName = '';
          this.addModalClose.nativeElement.click();
          this.loadData();
        } else {
          alert('Error Adding');
        }
      },
      (msg) => {
        alert('Error');
      }
    );
   }
  }
}



