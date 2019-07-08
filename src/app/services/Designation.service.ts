import { HttpClient } from '@angular/common/http';
import { Config } from '../../assets/config.json';

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
    orderDirection: string
  ) {
    const requestModel = {
      _userID: userID,
      _specificDesignationID: specificDesignationID,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd,
      _orderBy: orderBy,
      _orderDirection: orderDirection
    };

    const promise = new Promise((resolve, reject) => {
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

    return promise;
  }

}
