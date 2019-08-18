import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlaceService } from 'src/app/services/Place.Service';
import { ListCountriesRequest } from 'src/app/models/HttpRequests/ListCountriesRequest';
import { LocationsList, LocationItems, Regions, Cities } from 'src/app/models/HttpResponses/LocationsList';

@Component({
  selector: 'app-view-places',
  templateUrl: './view-places.component.html',
  styleUrls: ['./view-places.component.scss']
})
export class ViewPlacesComponent implements OnInit {

  constructor(private placeService: PlaceService) {}

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
  selectedRow = -1;
  currentTheme = 'light';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.placeService.getAll(this.request).then(
      (res: LocationsList) => {
        this.dataset = res;
        this.dataResult = this.placeService.getCountries(this.dataset);
      },
      (msg) => {
        alert(JSON.stringify(msg));
      }
    );
  }

  setSelectedRow(i: number) {
    this.selectedRow = i;
  }

  editModal(id: number, name: string, type: string) {
    this.locationID = id;
    this.locationName = name;
    this.locationType = type;

    this.openModal.nativeElement.click();
  }

  editLocation() {

  }
}



