import {HttpClient} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { BackgroundListRequest } from '../models/HttpRequests/BackgroundList.js';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  constructor(private httpClient: HttpClient) {}

  public getBackgrounds(request: BackgroundListRequest) {
    const requestModel = {
      _userID: request.userID,
      _specificBackgroundID: request.specificBackgroundID,
      _rightName: request.rightName,
      _filter: request.filter,
      _orderBy: request.orderBy,
      _orderByDirection: request.orderByDirection,
      _rowStart: request.rowStart,
      _rowEnd: request.rowEnd,
    };

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/backgrounds/list`;
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
