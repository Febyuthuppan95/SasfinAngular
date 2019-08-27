import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * list
   */
  public list(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/list`;
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
