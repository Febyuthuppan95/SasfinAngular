import {HttpClient} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { GetRightList } from '../models/HttpRequests/Rights.js';

@Injectable()
export class RightService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getRightList(model: GetRightList) {
    const requestModel = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/rights/list`;
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
