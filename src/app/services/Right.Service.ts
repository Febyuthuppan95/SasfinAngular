import {HttpClient} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';

@Injectable()
export class RightService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getRightList(
    filter: string,
    userID: number,
    specificRightID: number = -1,
    rightName: string,
    rowStart: number,
    rowEnd: number,
    orderBy: string,
    orderDirection: string
  ) {
    const requestModel = {
      _userID: userID,
      _specificRightID: specificRightID,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd,
      _orderBy: orderBy,
      _orderDirection: orderDirection
    };

    return new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.test}/rights/list`;
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
