import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { SAD500LineListRequest } from '../models/HttpRequests/SAD500Line';

@Injectable({
  providedIn: 'root'
})
export class CaptureService {

  constructor(private apiService: ApiService) { }

  // tslint:disable-next-line: max-line-length
  customsReleaseUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/customsrelease`, requestModel);
  customsReleaseGet = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/crn/get`, requestModel);

  sad500Update = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/sad500`, requestModel);
  sad500Get = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500/get`, requestModel);

  // tslint:disable-next-line: max-line-length
  sad500LineList = (requestModel: SAD500LineListRequest) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/list`, requestModel);
  sad500LineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Line/update`, requestModel);
  sad500LineAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Line/add`, requestModel);

  importClearingUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/ici`, requestModel);
  // tslint:disable-next-line: max-line-length
  shippingDocumentUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/shipping`, requestModel);
}
