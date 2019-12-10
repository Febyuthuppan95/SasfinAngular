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
  customsReleaseList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/crn/list`, requestModel);

  sad500List = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500/list`, requestModel);
  sad500Update = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500/update`, requestModel);
  sad500Get = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500/get`, requestModel);

  // tslint:disable-next-line: max-line-length
  sad500LineList = (requestModel: SAD500LineListRequest) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/list`, requestModel);
  sad500LineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/update`, requestModel);
  sad500LineAdd = async (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/create`, requestModel);
  // tslint:disable-next-line: max-line-length
  sad500LineDutyAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/duty/add`, requestModel);
  // tslint:disable-next-line: max-line-length
  sad500LineDutyRemove = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/duty/remove`, requestModel);
  sad500LineDutyList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/duty/list`, requestModel);

  importClearingUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/transactions/update/ici`, requestModel);

  // Import Clearing Instructions
  iciList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/ici/list`, requestModel);
  iciUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/ici/update`, requestModel);
  iciAdd = (requestModel: FormData) => this.apiService.postFormData(`${environment.ApiEndpoint}/capture/ici/create`, requestModel);

  // Invoices
  invoiceList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/list`, requestModel);
  invoiceUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/update`, requestModel);
  invoiceAdd = (requestModel: FormData) => this.apiService.postFormData(`${environment.ApiEndpoint}/capture/invoice/create`, requestModel);
  invoiceLineList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines`, requestModel);
  invoiceLineAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines/add`, requestModel);
  invoiceLineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines/update`, requestModel);

  dutyList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/duties`, requestModel);

  waybillUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/waybill/update`, requestModel);
  waybillList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/waybill/list`, requestModel);
}
