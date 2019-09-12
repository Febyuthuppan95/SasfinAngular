import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ListUnitsOfMeasureRequest } from '../models/HttpRequests/ListUnitsOfMeasure';
import { Injectable } from '@angular/core';
import { UpdateUnitOfMeasureRequest } from '../models/HttpRequests/UpdateUnitsOfMeasure';
import { AddressTypesList } from '../models/HttpRequests/AddressTypesList';

@Injectable({
  providedIn: 'root'
})
export class AddressTypesService {
  constructor(private httpClient: HttpClient) {}

  public list(params: AddressTypesList) {
    const requestModel = JSON.parse(JSON.stringify(params));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/addressTypes/list`;
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

  // public update(request: UpdateUnitOfMeasureRequest) {
  //   const requestModel = JSON.parse(JSON.stringify(request));
  //   return new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/unitofmeasure/update`;
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
}
