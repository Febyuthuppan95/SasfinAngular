import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/HttpResponses/User';
import { Router } from '@angular/router';
import { Config } from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { ThemeService } from './theme.Service';
import { GetServiceLList } from '../models/HttpRequests/GetServiceLList';
import { Permit } from '../models/HttpResponses/CompanyPermitsListResponse';
import { Pagination } from '../components/pagination/pagination.component';

@Injectable({
  providedIn: 'root'
})

export class ServicesService {
  constructor(
    private httpClient: HttpClient,
  ) {}

  /**
   * service list
   */
  public getServiceList(model: GetServiceLList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/services`;
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
  public async createClaim(model: ClaimCreateRequest) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/serviceclaims/create`;
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
  public async readServiceClaim(model: {requestParams: ServiceClaimReadRequest, requestProcedure: string }) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/serviceclaims/read`;
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

export class ClaimCreateRequest { // Create a claim
  serviceID: number;
}
export class ServiceClaimReadRequest { // Send Claim Data
  companyServiceClaimID: number;
  lookbackDays: number;
  exportStartDate: Date | string;
  exportEndDate: Date | string;
  extensionDays: number;
  claimDate: Date | string;
  permits: number[]; // permit id's
  filter: string;
  orderBy :string;
  orderByDirection:string;
  rowStart:number;
  rowEnd :number;
  rowCount:number;
}

