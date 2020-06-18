import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PlaceService } from 'src/app/services/Place.Service';
import { LocationsList, LocationItems, Regions, Cities } from 'src/app/models/HttpResponses/LocationsList';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UpdateRegionRequest, UpdateCountryRequest, UpdateCityRequest } from 'src/app/models/HttpRequests/UpdateLocationRequest';
import { ListCountriesRequest } from 'src/app/models/HttpRequests/Locations';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-places',
  templateUrl: './view-places.component.html',
  styleUrls: ['./view-places.component.scss']
})
export class ViewPlacesComponent implements OnInit, OnDestroy {

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

  @ViewChild('deleteLocationModal', { static: true })
  deleteLocationModal: ElementRef;

  @ViewChild('deleteModalClose', { static: true })
  deleteModalClose: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentUser = this.userService.getCurrentUser();
  private unsubscribe$ = new Subject<void>();


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
    rowEnd: 300,
    userID: 3,
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
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.placeService.getAll(this.request).then(
      (res: LocationsList) => {
        this.showLoader = false;
        this.dataset = res;
        this.dataResult = this.placeService.getCountries(this.dataset);
      },
      (msg) => {
        this.showLoader = false;
        console.log(JSON.stringify(msg));
      }
    );
  }

  setSelectedRow(hash: string) {
    this.selectedRow = hash;
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

  /* Add Handlers from context menu */

  addCountryModal($event) {
    this.locationType = 'country';
    this.addModalOpen.nativeElement.click();
    this.newLocationName = '';

  }
  addRegionModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'region';
    this.addModalOpen.nativeElement.click();
    this.newLocationName = '';
  }
  addCityModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'city';
    this.addModalOpen.nativeElement.click();
    this.newLocationName = '';
  }

  /* END Add Handlers from context menu */

  /* Delete Handlers from context menu */

  deleteCountryModal($event) {
    this.locationType = 'country';
    this.deleteLocationModal.nativeElement.click();
  }
  deleteRegionModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'region';
    this.deleteLocationModal.nativeElement.click();
  }
  deleteCityModal($event) {
    this.locationParentID = this.locationID;
    this.locationType = 'city';
    this.deleteLocationModal.nativeElement.click();
  }

  /* END Delete Handlers from context menu */

  addLocation() {
    event.preventDefault();
    let errors = 0;

    if (this.newLocationName === '' || this.newLocationName === undefined) {
      errors++;
      this.notify.toastrwarning('Warning', 'Please enter the name field');
    }

    const lettersOnly = new RegExp('^[a-zA-Z]+$');

    if (!lettersOnly.test(this.newLocationName)) {
      errors++;
      this.notify.toastrwarning('Warning', 'Only letters are allowed');
    }

    if (errors === 0) {
      if (this.locationType === 'country') {
        const requestModel = {
          userID: this.currentUser.userID,
          name: this.newLocationName,
        };

        this.placeService.addCountry(requestModel).then(
          (res: Outcome) => {
            if (res.outcome === 'SUCCESS') {
              this.newLocationName = '';
              this.addModalClose.nativeElement.click();
              this.loadData();
            } else {
              this.notify.toastrwarning(res.outcome, res.outcomeMessage);
            }
          },
          (msg) => {
            this.notify.errorsmsg('FAILURE', 'Could not add Location');
          }
        );
      } else if (this.locationType === 'region') {
        const requestModel = {
          userID: this.currentUser.userID,
          countryID: this.locationParentID,
          name: this.newLocationName,
        };

        this.placeService.addRegion(requestModel).then(
          (res: Outcome) => {
            if (res.outcome === 'SUCCESS') {
              this.newLocationName = '';
              this.addModalClose.nativeElement.click();
              this.loadData();
            } else {
              this.notify.errorsmsg('FAILURE', 'Could not add Location');
            }
          },
          (msg) => {
            this.notify.errorsmsg('FAILURE', 'Could not add Location');
          }
        );
      } else {
        const requestModel = {
          userID: this.currentUser.userID,
          regionID: this.locationParentID,
          name: this.newLocationName,
        };

        this.placeService.addCity(requestModel).then(
          (res: Outcome) => {
            if (res.outcome === 'SUCCESS') {
              this.newLocationName = '';
              this.addModalClose.nativeElement.click();
              this.loadData();
            } else {
              this.notify.errorsmsg('FAILURE', 'Could not add Location');
            }
          },
          (msg) => {
            this.notify.errorsmsg('FAILURE', 'Could not add Location');
          }
        );
      }
    }
  }

  deleteLocation() {
    if (this.locationType === 'country') {
      const requestModel: UpdateCountryRequest = {
        userID: this.currentUser.userID,
        name: this.locationName,
        countryID: this.locationID,
        isDeleted: true,
      };

      this.placeService.updateCountry(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.deleteModalClose.nativeElement.click();
            this.loadData();
          } else {
            alert('Error Updating');
          }
        },
        (msg) => {
          alert('Error');
        }
      );
     } else if (this.locationType === 'region') {
      const requestModel: UpdateRegionRequest = {
        userID: this.currentUser.userID,
        name: this.locationName,
        regionID: this.locationID,
        isDeleted: true,
      };

      this.placeService.updateRegion(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.deleteModalClose.nativeElement.click();
            this.loadData();
          } else {
            alert(JSON.stringify(res));
          }
        },
        (msg) => {
          alert(JSON.stringify(msg));
        }
      );
     } else {
      const requestModel: UpdateCityRequest = {
        userID: this.currentUser.userID,
        cityID: this.locationID,
        name: this.locationName,
        isDeleted: true,
      };

      this.placeService.updateCity(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.deleteModalClose.nativeElement.click();
            this.loadData();
          } else {
            alert('Error Updating');
          }
        },
        (msg) => {
          alert('Error');
        }
      );
     }
  }

  editLocation() {
    if (this.locationName !== '' && this.locationName !== null && this.locationName) {
    if (this.locationType === 'country') {
      const requestModel: UpdateCountryRequest = {
        userID: this.currentUser.userID,
        name: this.locationName,
        countryID: this.locationID,
      };

      this.placeService.updateCountry(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.closeModal.nativeElement.click();
            this.loadData();
          } else {
            alert('Error Updating');
          }
        },
        (msg) => {
          alert('Error');
        }
      );
     } else if (this.locationType === 'region') {
      const requestModel: UpdateRegionRequest = {
        userID: this.currentUser.userID,
        name: this.locationName,
        regionID: this.locationID,
      };

      this.placeService.updateRegion(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.closeModal.nativeElement.click();
            this.loadData();
          } else {
            alert(JSON.stringify(res));
          }
        },
        (msg) => {
          alert(JSON.stringify(msg));
        }
      );
     } else {
      const requestModel: UpdateCityRequest = {
        userID: this.currentUser.userID,
        cityID: this.locationID,
        name: this.locationName,
      };

      this.placeService.updateCity(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.newLocationName = '';
            this.closeModal.nativeElement.click();
            this.loadData();
          } else {
            alert('Error Updating');
          }
        },
        (msg) => {
          alert('Error');
        }
      );
     }
    } else {
      this.notify.toastrwarning('Warning', 'Field cannot be blank');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}



