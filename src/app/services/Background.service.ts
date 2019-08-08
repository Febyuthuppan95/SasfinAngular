import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { BackgroundListRequest } from '../models/HttpRequests/BackgroundList.js';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  constructor(private httpClient: HttpClient) {}

  public getBackgrounds(request: BackgroundListRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));

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
