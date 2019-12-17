import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { CheckListRequest } from '../models/HttpRequests/CheckListRequest';


export class CheckListService {
    constructor(private httpClient: HttpClient) {}

public list(params: CheckListRequest ) {
    const requestModel = JSON.parse(JSON.stringify(params));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/checkingscreenlist`;
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