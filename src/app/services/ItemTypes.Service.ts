import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/HttpResponses/User';
import { Router } from '@angular/router';
import { Config } from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { ThemeService } from './theme.Service';
import { GetServiceLList } from '../models/HttpRequests/GetServiceLList';
import { GetItemTypeList } from '../models/HttpRequests/GetItemTypeList';

@Injectable({
  providedIn: 'root'
})

export class ItemTypesService {
  constructor(
    private httpClient: HttpClient,
  ) {}

  /**
   * service list
   */
  public getItemTypeList(model: GetItemTypeList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/itemtypes/list`;
      this.httpClient.post(apiURL, json)
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
