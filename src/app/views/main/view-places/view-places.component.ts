import { Component, OnInit } from '@angular/core';
import { PlacesParameters, PlacesResponse } from 'src/app/models/HttpResponses/PlacesResponse';
import { PlaceService } from 'src/app/services/Place.Service';
import { ListCitiesResponse, City } from 'src/app/models/HttpResponses/ListCitiesResponse';
import { ListCountriesResponse } from 'src/app/models/HttpResponses/ListCountriesResponse';
import { ListRegionsResponse, Region } from 'src/app/models/HttpResponses/ListRegionsResponse';

@Component({
  selector: 'app-view-places',
  templateUrl: './view-places.component.html',
  styleUrls: ['./view-places.component.scss']
})
export class ViewPlacesComponent implements OnInit {

  constructor(private placeService: PlaceService) {}

  displayResults: string;
  dataset = new PlacesResponse();
  request: PlacesParameters = {
    specificCountryID: -1,
    specificRegionID: -1,
    specificCityID: -1,
    filter: '',
    orderBy: 'Name',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 100000,
    rightName: 'Places',
    userID: 4,
  };

  showLoader = false;
  noData = false;
  currentTheme = 'light';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getAll(this.request);
  }

  getAll(requestObject: PlacesParameters): PlacesResponse {
    const result = new PlacesResponse();
    let countryResponse = new ListCountriesResponse();
    let regionResponse = new ListRegionsResponse();
    let cityResponse = new ListCitiesResponse();

    const countryModel = {
      userID: requestObject.userID,
      specificCountryID: -1,
      filter: requestObject.filter,
      orderBy: requestObject.orderBy,
      orderByDirection: requestObject.orderByDirection,
      rowStart: requestObject.rowStart,
      rowEnd: requestObject.rowEnd,
      rightName: requestObject.rightName,
    };
    this.placeService.getCountries(countryModel).then(
      (res: ListCountriesResponse) => {
        countryResponse = res;
        if (countryResponse.countriesList.length !== 0) {
          const regionModel = {
            userID: requestObject.userID,
            specificCountryID: -1,
            specificRegionID: -1,
            filter: requestObject.filter,
            orderBy: requestObject.orderBy,
            orderByDirection: requestObject.orderByDirection,
            rowStart: requestObject.rowStart,
            rowEnd: requestObject.rowEnd,
            rightName: requestObject.rightName,
          };
          this.placeService.getRegions(regionModel).then(
            (res2: ListRegionsResponse) => {
              regionResponse = res2;

              if (regionResponse.regionsList.length !== 0) {
                const cityModel = {
                  userID: requestObject.userID,
                  specificCountryID: -1,
                  specificRegionID: -1,
                  specificCityID: -1,
                  filter: requestObject.filter,
                  orderBy: requestObject.orderBy,
                  orderByDirection: requestObject.orderByDirection,
                  rowStart: requestObject.rowStart,
                  rowEnd: requestObject.rowEnd,
                  rightName: requestObject.rightName,
                };
                this.placeService.getCities(cityModel).then(
                  (res3: ListCitiesResponse) => {
                    cityResponse = res3;

                    if (cityResponse.citiesLists.length !== 0) {
                    countryResponse.countriesList.forEach((country) => {
                      const regionsList: Region[] = [];
                      regionResponse.regionsList.forEach((region) => {
                        const cityList: City[] = [];
                        if (country.countryID === region.countryID) {
                          regionsList.push(region);
                          cityResponse.citiesLists.forEach((city) => {
                            if (region.regionID === city.cityID) {
                              cityList.push(city);
                            }
                          });
                        }
                        region.cities = cityList;
                      });

                      country.regions = regionsList;
                    });

                    this.dataset.countries = countryResponse.countriesList;
                    this.displayResults = JSON.stringify(this.dataset.countries);

                    } else {
                      alert('No cities found');
                    }
                  },
                  (msg) => {
                    alert(JSON.stringify(msg));
                  }
                );
              } else {
                alert('No regions found');
              }
            },
            (msg) => {
              alert(JSON.stringify(msg));
            }
          );
        } else {
          alert('No countries found');
        }
      },
      (msg) => {
        alert(JSON.stringify(msg));
      }
    );

    return result;
  }

}



