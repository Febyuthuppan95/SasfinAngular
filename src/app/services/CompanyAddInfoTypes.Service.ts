import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { CompanyAddInfoTypesListRequest } from '../models/HttpRequests/CompanyAddInfoTypesList';
import { AddCompanyAddInfoTypesRequest } from '../models/HttpRequests/AddCompanyAddInfoTypesRequest';
import { UpdateCompanyAddInfoTypeRequest } from '../models/HttpRequests/UpdateCompanyAddInfoTypes';

@Injectable({
  providedIn: 'root'
})
export class CompanyAddInfoTypesService {
  constructor(private httpClient: HttpClient) {}

  public list(params: CompanyAddInfoTypesListRequest) {
    const requestModel = JSON.parse(JSON.stringify(params));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companyAddInfoTypes/list`;
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

  public update(request: UpdateCompanyAddInfoTypeRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companyAddInfoTypes/update`;
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

  public add(model: AddCompanyAddInfoTypesRequest) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companyAddInfoTypes/add`;
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
