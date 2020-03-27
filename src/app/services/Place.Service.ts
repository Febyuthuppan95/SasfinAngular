import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Regions, LocationsList, Cities, LocationItems } from '../models/HttpResponses/LocationsList';
import { UpdateCountryRequest, UpdateRegionRequest, UpdateCityRequest } from '../models/HttpRequests/UpdateLocationRequest';
import { UUID } from 'angular2-uuid';
import { ListCountriesRequest } from '../models/HttpRequests/Locations';

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

  getCountriesCall(request: object) {
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
           hash: UUID.UUID(),
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
          if (country.regionID !== undefined && country.region !== undefined && country.regionID !== 0 && country.region !== '') {
            result.push({
              id: country.regionID,
              name: country.region,
              hash: UUID.UUID(),
              cities: this.getCities(data, country.region)
           });
          }
      }
     }
    });

    return result;
  }

  getCities(data: LocationsList, regionName: string) {
    const result: Cities[] = [];

    data.locations.forEach((country) => {
      if (country.region === regionName) {
        if (country.cityID !== undefined && country.city !== undefined && country.cityID !== 0 && country.city !== '') {
        result.push({
           id: country.cityID,
           name: country.city,
           hash: UUID.UUID(),
        });
      }
     }
    });

    return result;
  }

  updateCountry(requestData: UpdateCountryRequest) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/countries/update`;
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

  updateRegion(requestData: UpdateRegionRequest) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/regions/update`;
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

  updateCity(requestData: UpdateCityRequest) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/cities/update`;
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

  addCity(requestData: any) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/cities/add`;
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

  addRegion(requestData: any) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/regions/add`;
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

  addCountry(requestData: any) {
    const requestModel = JSON.parse(JSON.stringify(requestData));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/countries/add`;
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
