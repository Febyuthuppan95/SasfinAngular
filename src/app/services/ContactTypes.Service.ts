import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ContactTypesListRequest } from '../models/HttpRequests/ContactTypesList';
import { AddContactTypesRequest } from '../models/HttpRequests/AddContactTypesRequest';

@Injectable({
  providedIn: 'root'
})
export class ContactTypesService {
  constructor(private httpClient: HttpClient) {}

  /*List*/
  public list(params: ContactTypesListRequest) {
    const requestModel = JSON.parse(JSON.stringify(params));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/contactType/list`;
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

  /*Update*/
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


  /*Add*/
  public add(model: AddContactTypesRequest) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/contactType/add`;
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
    return promise;
  }
}
