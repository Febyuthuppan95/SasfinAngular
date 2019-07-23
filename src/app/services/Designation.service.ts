import {HttpClient} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';
import { GetDesignationRightsList } from '../models/HttpRequests/GetDesignationRightsList';
import { environment } from 'src/environments/environment.js';

@Injectable()
export class DesignationService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getDesignationList(
    filter: string,
    userID: number,
    specificDesignationID: number = -1,
    rightName: string,
    rowStart: number,
    rowEnd: number,
    orderBy: string,
    orderByDirection: string
  ) {
    const requestModel = {
      _userID: userID,
      _specificDesignationID: specificDesignationID,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd,
      _orderBy: orderBy,
      _orderByDirection: orderByDirection
    };

    return new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.local}/designations/list`;
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
  /**
   *
   */
  public getDesignationRightsList(model: GetDesignationRightsList) {
    const json = {
      _userID: model.userID,
      _specificUserID: model.specificUserID,
      _specificDesignationID: model.specifcDesignationID,
      _rightName: model.rightName,
      _filter: model.filter,
      _orderBy: model.orderBy,
      _orderByDirection: model.orderDirection,
      _rowStart: model.rowStart,
      _rowEnd: model.rowEnd
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/designationrights/list`;
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
    return promise;

  }

}
