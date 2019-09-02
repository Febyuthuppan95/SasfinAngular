import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { GetDesignationRightsList } from '../models/HttpRequests/GetDesignationRightsList';
import { environment } from 'src/environments/environment.js';
import { AddDesignationRight } from '../models/HttpRequests/AddDesignationRight.js';
import { UpdateDesignationRight } from '../models/HttpRequests/UpdateDesignationRight.js';
import { DesignationListResponse } from '../models/HttpResponses/DesignationListResponse';
import { UpdateAddressTypesList } from '../models/HttpRequests/UpdateAddressTypesList';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AddressTypesService {
  constructor(
    private httpClient: HttpClient
  ) {
    this.desinationObserverable = new BehaviorSubject<number>(-1);
  }

  AddressTypeID: number;
  desinationObserverable: BehaviorSubject<number>;

  public updateAddressTypeID(newID: number) {
    this.desinationObserverable.next(newID);
  }

  public observeAddressTypeID() {
    return this.desinationObserverable.asObservable();
  }

  public getAddressTypesList(model: UpdateAddressTypesList) {
    const requestModel = JSON.parse(JSON.stringify(model));
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
  // public getDesignationRightsList(model: GetDesignationRightsList) {
  //   const request = JSON.parse(JSON.stringify(model));
  //   const promise = new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/designationRights/list`;
  //     this.httpClient.post(apiURL, request)
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

  // public updateDesignationRight(model: UpdateDesignationRight) {
  //   const json = JSON.parse(JSON.stringify(model));
  //   // console.log(json);
  //   const promise = new Promise((resolve, reject) => {
  //     this.httpClient.post(`${environment.ApiEndpoint}/designationRights/update`, json)
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
  // public addDesignationright(model: AddDesignationRight) {
  //   const json = JSON.parse(JSON.stringify(model));
  //   // console.log(json);
  //   const promise = new Promise((resolve, reject) => {
  //     this.httpClient.post(`${environment.ApiEndpoint}/designationRights/add`, json)
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
