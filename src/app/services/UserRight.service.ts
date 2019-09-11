import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {GetUserRightsList} from '../models/HttpRequests/GetUserRightsList';

@Injectable()
export class UserRightService {
  constructor(
    private httpClient: HttpClient
  ) {}

  // public getUserRightList(
  //   filter: string,
  //   userID: number,
  //   specificRightID: number = -1,
  //   specificUserID: number = -1,
  //   rowStart: number,
  //   rowEnd: number,
  //   orderBy: string,
  //   orderByDirection: string
  // ) {
  //   const requestModel = {
  //     _userID: userID,
  //     _specificRightID: specificRightID,
  //     _specificUserID: specificUserID,
  //     _filter: filter,
  //     _rowStart: rowStart,
  //     _rowEnd: rowEnd,
  //     _orderBy: orderBy,
  //     _orderByDirection: orderByDirection
  //   };
  //
  //   return new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/userRights/list`;
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

  public getUserRightsList(model: GetUserRightsList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/userRights/list`;
      this.httpClient.post(apiURL, json)
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

  // public updateUserRight(model: UpdateUserRight) {
  //   const json = JSON.parse(JSON.stringify(model));
  //   console.log(json);
  //   return new Promise((resolve, reject) => {
  //     this.httpClient.post(`${environment.ApiEndpoint}/userRights/update`, json)
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
