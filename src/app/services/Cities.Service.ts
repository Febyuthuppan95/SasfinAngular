import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CitiesList } from '../models/HttpRequests/Locations';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {

  }


  /**
   * list
   */
  public list(model: CitiesList) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/cities/list`;
      this.httpClient
        .post(apiURL, model)
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

  // public Update(model: UpdateCompany) {
  //   const requestModel = JSON.parse(JSON.stringify(model));
  //   const promise = new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/companies/update`;
  //     this.httpClient
  //     .post(apiURL, requestModel)
  //     .toPromise()
  //     .then(
  //       res => {
  //         resolve(res);
  //       },
  //       msg => {
  //         reject(msg);
  //       }
  //     );
  //   });
  //   return promise;
  // }

  // public Add(model: AddCompany) {
  //   const requestModel = JSON.parse(JSON.stringify(model));
  //   const promise = new Promise((resolve, reject) => {
  //     const apiURL = `${environment.ApiEndpoint}/companies/add`;
  //     this.httpClient
  //     .post(apiURL, requestModel)
  //     .toPromise()
  //     .then(
  //       res => {
  //         resolve(res);
  //       },
  //       msg => {
  //         reject(msg);
  //       }
  //     );
  //   });
  //   return promise;
  // }

}

export class SelectedCompany {
  companyID: number;
  companyName: string;
  selectedTransactionID?: number;
}
