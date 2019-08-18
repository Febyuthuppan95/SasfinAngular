import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, PlacesParameters } from '../models/HttpResponses/PlacesResponse';
import { ListCountriesResponse, Country } from '../models/HttpResponses/ListCountriesResponse';
import { ListCountriesRequest } from '../models/HttpRequests/ListCountriesRequest';
import { environment } from 'src/environments/environment';
import { ListRegionsResponse } from '../models/HttpResponses/ListRegionsResponse';
import { ListCitiesResponse } from '../models/HttpResponses/ListCitiesResponse';
import { Regions, LocationsList, Cities, LocationItems } from '../models/HttpResponses/LocationsList';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

  getAll(requestObject: ListCountriesRequest) {
    const requestModel = JSON.parse(JSON.stringify(requestObject));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/countries/list/locations`;
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

  getCountriesCall(request: ListCountriesRequest) {
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

  getRegionsCall(request: ListCountriesRequest) {
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

  getCitiesCall(request: ListCountriesRequest) {
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

  getCountries(data: LocationsList): LocationItems[] {
    const result: LocationItems[] = [];

    data.locations.forEach((country) => {
      if (result.find((element) => {
        return element.countryID === country.countryID;
      }) === undefined) {
         result.push({
           countryID: country.countryID,
           name: country.name,
           rowNum: country.rowNum,
           regions: this.getRegions(data, country.name),
         });
      }
    });

    return result;
  }

  getRegions(data: LocationsList, countryName: string) {
    const result: Regions[] = [];

    data.locations.forEach((country) => {
      if (country.name === countryName) {
        if (result.find((element) => {
          return element.id === country.regionID;
        }) === undefined) {
        result.push({
           id: country.regionID,
           name: country.region,
           cities: this.getCities(data, country.region)
        });
      }
     }
    });

    return result;
  }

  getCities(data: LocationsList, regionName: string) {
    const result: Cities[] = [];

    data.locations.forEach((country) => {
      if (country.region === regionName) {
        result.push({
           id: country.cityID,
           name: country.city,
        });
     }
    });

    return result;
  }
}
