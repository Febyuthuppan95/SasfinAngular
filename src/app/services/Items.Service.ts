import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/HttpResponses/User';
import { Router } from '@angular/router';
import { Config } from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { ThemeService } from './theme.Service';
import { GetItemList } from '../models/HttpRequests/GetItemList';

@Injectable({
  providedIn: 'root'
})

export class ItemsService {
  constructor(
    private httpClient: HttpClient,
  ) {}

  /**
   * service list
   */
  public getItemList(model: GetItemList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/items`;
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
