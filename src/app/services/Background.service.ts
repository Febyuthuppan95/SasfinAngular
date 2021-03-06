import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { BackgroundListRequest } from '../models/HttpRequests/Backgrounds';

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

  public addBackgrounds(fileName: string, src: File, userID: number) {
    const requestModel = {
      name: fileName,
      image: src.name,
      userId: userID,
    };

    const formData = new FormData();
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

  public removeBackgrounds(backgroundID, userID) {
    const requestModel = {
      userID,
      backgroundID
    };

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/backgrounds/remove`;

      this.httpClient.post(apiURL, requestModel)
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
