import {HttpClient} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class UserRightService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getUserRightList(
    filter: string,
    userID: number,
    specificRightID: number = -1,
    specificUserID: number = -1,
    rightName: string,
    rowStart: number,
    rowEnd: number,
    orderBy: string,
    orderByDirection: string
  ) {
    const requestModel = {
      _userID: userID,
      _specificRightID: specificRightID,
      _specificUserID: specificUserID,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd,
      _orderBy: orderBy,
      _orderByDirection: orderByDirection
    };

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/UserRights/list`;
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
