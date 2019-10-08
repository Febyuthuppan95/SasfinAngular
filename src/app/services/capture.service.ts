import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

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

  importClearingUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/ici`, requestModel);
  // tslint:disable-next-line: max-line-length
  shippingDocumentUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/shipping`, requestModel);
}
