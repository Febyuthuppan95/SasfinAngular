import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ListUnitsOfMeasureRequest } from '../models/HttpRequests/ListUnitsOfMeasure';
import { Injectable } from '@angular/core';
import { UpdateUnitOfMeasureRequest } from '../models/HttpRequests/UpdateUnitsOfMeasure';
import { AddressTypesListRequest } from '../models/HttpRequests/AddressTypesList';
import { UpdateAddressTypeRequest } from '../models/HttpRequests/UpdateAddressTypes';
import { AddAddressTypesRequest } from '../models/HttpRequests/AddAddressTypesRequest';
import { CurrenciesListRequest } from '../models/HttpRequests/CurrenciesList';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  constructor(private httpClient: HttpClient) {}

  public list(params: CurrenciesListRequest) {
    const requestModel = JSON.parse(JSON.stringify(params));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/currencies/list`;
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

  // public update(request: UpdateAddressTypeRequest) {
  //   const requestModel = JSON.parse(JSON.stringify(request));
  //   return new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/addressTypes/update`;
  //     this.httpClient
  //       .post(apiURL, requestModel)
  //       .toPromise()
  //       .then(
  //         res => {
  //           resolve(res);
  //         },
  //         msg => {
  //           reject(msg);
  //         }
  //       );
  //   });
  // }

  // public add(model: AddAddressTypesRequest) {
  //   const requestModel = JSON.parse(JSON.stringify(model));
  //   const promise = new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/addressTypes/add`;
  //     this.httpClient
  //     .post(apiURL, requestModel)
  //     .toPromise()
  //     .then(
  //       res => {
  //         resolve(res);
  //       },
  //       msg => {
  //         reject(msg);
  //       }
  //     );
  //   });
  //   return promise;
  // }
}
