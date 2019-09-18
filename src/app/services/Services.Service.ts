import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/HttpResponses/User';
import { Router } from '@angular/router';
import { Config } from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { ThemeService } from './theme.Service';
import { GetServiceLList } from '../models/HttpRequests/GetServiceLList';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  /**
   * service list
   */
  public getServiceList(model: GetServiceLList) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/services`;
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
