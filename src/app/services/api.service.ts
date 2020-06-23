import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {}

  public post(url: string, requestModel: object) {
    return new Promise((resolve, reject) => {
      this.httpClient
          .post(url, requestModel)
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

  public postFormData(url: string, formData: FormData) {
    return new Promise((resolve, reject) => {
      this.httpClient
          .post(url, formData)
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

  public get(url: string) {
    return new Promise((resolve, reject) => {
      this.httpClient
          .get(url)
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

  public getFile(url: string) {
    return new Promise((resolve, reject) => {
      this.httpClient
          .get(url, { responseType: 'blob'})
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
