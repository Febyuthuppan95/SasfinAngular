import { HttpClient } from '@angular/common/http';
import { ListHelpGlossary } from '../models/HttpRequests/ListHelpGlossary';
import { environment } from 'src/environments/environment';
import { UpdateHelpGlossary } from '../models/HttpRequests/UpdateHelpGlossary';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpGlossaryService {

  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * list
   */
  public list(request: ListHelpGlossary): any {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/helpglossary/list`;
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

  /**
   * update
   */
  public update(request: UpdateHelpGlossary): any {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/helpglossary/update`;
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
