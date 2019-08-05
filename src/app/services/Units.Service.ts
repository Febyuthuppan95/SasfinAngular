import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.test';
import { ListUnitsOfMeasureRequest } from '../models/HttpRequests/ListUnitsOfMeasure';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitMeasureService {

  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

  public list(params: ListUnitsOfMeasureRequest) {
    const requestModel = {
      _userId: params.userId,
      _specificUnitOfMeasureId: params.specificUnitOfMeasureId,
      _rightName: params.rightName,
      _filter: params.filter,
      _orderBy: params.orderBy,
      _orderByDirection: params.orderByDirection,
      _rowStart: params.rowStart,
      _rowEnd: params.rowEnd,
      _rowCount: params.rowCount,
    };


    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/unitsofmeasure/list`;
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
