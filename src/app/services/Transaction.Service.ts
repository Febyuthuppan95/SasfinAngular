import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * get
   */
  public list(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/list`;

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
