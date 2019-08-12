import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '../../assets/config.json';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { BackgroundListRequest } from '../models/HttpRequests/BackgroundList.js';
import { stringify } from 'querystring';

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

  public addBackgrounds(fileName: string, src: File, userID: number, rightName: string) {
    const requestModel = {
      name: fileName,
      image: src.name,
      userId: userID,
      rightName
    };

    const formData: FormData = new FormData();
    formData.append('file', src);
    formData.append('requestModel', JSON.stringify(requestModel));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/backgrounds/upload`;

      this.httpClient.post(apiURL, formData)
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
