import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, PlacesParameters } from '../models/HttpResponses/PlacesResponse';
import { ListCountriesResponse, Country } from '../models/HttpResponses/ListCountriesResponse';
import { ListCountriesRequest } from '../models/HttpRequests/ListCountriesRequest';
import { environment } from 'src/environments/environment';
import { ListRegionsResponse } from '../models/HttpResponses/ListRegionsResponse';
import { ListCitiesResponse } from '../models/HttpResponses/ListCitiesResponse';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

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
    this.getCountries(countryModel).then(
      (res: ListCountriesResponse) => {
        console.log(JSON.stringify(res));
        countryResponse = res;
      },
      (msg) => {
        console.error(JSON.stringify(msg));
      }
    );

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
    this.getRegions(regionModel).then(
      (res: ListRegionsResponse) => {
        console.log(JSON.stringify(res));
        regionResponse = res;
      },
      (msg) => {
        console.error(JSON.stringify(msg));
      }
    );

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
    this.getCities(cityModel).then(
      (res: ListCitiesResponse) => {
        console.log(JSON.stringify(res));
        cityResponse = res;
      },
      (msg) => {
        console.error(JSON.stringify(msg));
      }
    );

    countryResponse.countriesList.forEach((country) => {
      regionResponse.regionsList.forEach((region) => {
        if (country.countryID === region.countryID) {
          country.regions.push(region);

          cityResponse.citiesLists.forEach((city) => {
            if (region.regionID === city.cityID) {
              region.cities.push(city);
            }
          });
        }
      });
    });

    return result;
  }

  getCountries(request: ListCountriesRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/countries/list`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }

  getRegions(request: ListCountriesRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/regions/list`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }

  getCities(request: ListCountriesRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/cities/list`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }
}
