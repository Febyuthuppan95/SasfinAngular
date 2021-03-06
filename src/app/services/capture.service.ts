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
  sad500LineList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500lines/list`, requestModel);

  sad500LineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/update`, requestModel);
  // tslint:disable-next-line: max-line-length
  sad500LineAdd = async (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500lines/create`, requestModel);
  // tslint:disable-next-line: max-line-length
  sad500LineDutyAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/duty/add`, requestModel);
  // tslint:disable-next-line: max-line-length
  sad500LineDutyRemove = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/sad500Lines/duty/remove`, requestModel);
  // tslint:disable-next-line: max-line-length
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
  // tslint:disable-next-line: max-line-length
  invoiceLineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/invoice/lines/update`, requestModel);
  incoTermTypeList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/incoterms/list`, requestModel);

  dutyList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/duties`, requestModel);
  // tslint:disable-next-line: max-line-length
  splitPDF = (requestModel: FormData) => this.apiService.postFormData(`${environment.ApiEndpoint}/public/generate/split-document`, requestModel);

  // tslint:disable-next-line: max-line-length
  UploadPermit = (requestModel: FormData) => this.apiService.postFormData(`${environment.ApiEndpoint}/public/generate/permit-document`, requestModel);

  waybillUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/waybill/update`, requestModel);
  waybillList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/waybill/list`, requestModel);

  vocUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/voc/update`, requestModel);
  vocList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/voc/list`, requestModel);
  vocDutyAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/voc/duty/add`, requestModel);
  vocDutyRemove = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/voc/duty/remove`, requestModel);
  vocDutyList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/voc/duty/list`, requestModel);

  // tslint:disable-next-line: max-line-length
  customWorksheetList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/customsworksheet/list`, requestModel);
  // tslint:disable-next-line: max-line-length
  customWorksheetUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/customsworksheet/update`, requestModel);
  // tslint:disable-next-line: max-line-length
  customWorksheetLineAdd = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/customsworksheet/lines/create`, requestModel);
  // tslint:disable-next-line: max-line-length
  customWorksheetLineUpdate = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/customsworksheet/lines/update`, requestModel);
  // tslint:disable-next-line: max-line-length
  customWorksheetLineList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/customsworksheet/lines/list`, requestModel);

  ediStatusList = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/edi/status/list`, requestModel);
  updateAttachmentErrors = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/error/update`, requestModel);
  fileIsMissing = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/file/ismissing`, requestModel);
  post = (requestModel: object) => this.apiService.post(`${environment.ApiEndpoint}/capture/post`, requestModel);
}
