import { ResponsibleConsultant } from './../models/HttpResponses/ResponsibleConsultant';
import { ResponsibleCapturer } from './../models/HttpResponses/ResponsibleCapturer';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AddCompany } from '../models/HttpRequests/Company';
import { UpdateCompany } from '../models/HttpRequests/Company';
import { CompanyList } from '../models/HttpRequests/Company';
import { AddCompanyInfo } from '../models/HttpRequests/Company';
import { UpdateCompanyInfo } from '../models/HttpRequests/Company';
import { AddCompanyAddress } from '../models/HttpRequests/Company';
import { UpdateCompanyAddress } from '../models/HttpRequests/Company';
import { AddCompanyService } from '../models/HttpRequests/AddCompanyService';
import { UpdateCompanyService } from '../models/HttpRequests/UpdateCompanyService';
import { AddCompanyItem } from '../models/HttpRequests/AddCompanyItem';
import { UpdateCompanyItem } from '../models/HttpRequests/UpdateCompanyItem';
import { GetItemList } from '../models/HttpRequests/GetItemList';
import { GetIAlternateItemList } from '../models/HttpRequests/GetIAlternateItemList';
import { AddItemGroup } from '../models/HttpRequests/AddItemGroup';
import { GetItemValuesList } from '../models/HttpRequests/GetItemValuesList';
import { GetItemParentsList } from '../models/HttpRequests/GetItemParentsList';
import { GetCompanyBOMs } from '../models/HttpRequests/GetCompanyBOMs';
import { GetBOMLines } from '../models/HttpRequests/GetBOMLines';
import { GetCompanyPermits } from '../models/HttpRequests/GetCompanyPermits';
import { GetPermitImportTariffs } from '../models/HttpRequests/GetPermitImportTariffs';
import { GetCompanyServiceClaims } from '../models/HttpRequests/GetCompanyServiceClaims';
import { GetPermitsByDate } from '../models/HttpRequests/GetPermitsByDate';
import { GetSAD500LinesByPermits } from '../models/HttpRequests/GetSAD500LinesByPermits';
import { NumberValueAccessor } from '@angular/forms';
import { GetServiceClaimReports } from '../models/HttpRequests/GetServiceClaimReports';
import { AddContact } from '../models/HttpRequests/AddContact';
import { GetTariffList } from '../models/HttpRequests/GetTariffList';
import { Outcome } from '../models/HttpResponses/DoctypeResponse';
import { CompanyOEM, SelectedCompanyOEM } from '../views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {
    // company
    let sessionData: SelectedCompany = null;
    // item
    let sessionData2: SelectedItem = null;
    // BOM
    let sessionData3: SelectedBOM = null;
    // Permit
    let sessionData4: SelectedPermit = null;
    // CompanyServiceClaimReport
    let sessionData5: SelectedClaimReport = null;
    // Capture
    let sessionData6: SelectedCapture = null;

    // company
    if (sessionStorage.getItem(`${environment.Sessions.companyData}`) !== undefined || null) {
      sessionData = JSON.parse(sessionStorage.getItem(`${environment.Sessions.companyData}`));
    }
    // item
    if (sessionStorage.getItem(`${environment.Sessions.itemData}`) !== undefined || null) {
      sessionData2 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.itemData}`));
    }
    // BOM
    if (sessionStorage.getItem(`${environment.Sessions.BOMData}`) !== undefined || null) {
      sessionData3 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.BOMData}`));
    }
    // Permit
    if (sessionStorage.getItem(`${environment.Sessions.PermitData}`) !== undefined || null) {
      sessionData4 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.PermitData}`));
    }
    // CompanyServiceClaimReport
    if (sessionStorage.getItem(`${environment.Sessions.ClaimReportData}`) !== undefined || null) {
      sessionData5 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.ClaimReportData}`));
    }
    // Capture
    if (sessionStorage.getItem(`${environment.Sessions.CaptureData}`) !== undefined || null) {
      sessionData6 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.CaptureData}`));
    }

    // company
    this.selectedCompany = new BehaviorSubject<SelectedCompany>(sessionData);
    // item
    this.selectedItem = new BehaviorSubject<SelectedItem>(sessionData2);
    // BOM
    this.SelectedBOM = new BehaviorSubject<SelectedBOM>(sessionData3);
    // Permit
    this.SelectedPermit = new BehaviorSubject<SelectedPermit>(sessionData4);
    // CompanyServiceClaimReport
    this.SelectedClaimReport = new BehaviorSubject<SelectedClaimReport>(sessionData5);
    // Capture
    this.SelectedCapture = new BehaviorSubject<SelectedCapture>(sessionData6);

  }
  // company
  selectedCompany: BehaviorSubject<SelectedCompany>;
  selectedCompanyOEM: BehaviorSubject<SelectedCompanyOEM>;
  // item
  selectedItem: BehaviorSubject<SelectedItem>;
  // BOM
  SelectedBOM: BehaviorSubject<SelectedBOM>;
  // Permit
  SelectedPermit: BehaviorSubject<SelectedPermit>;
  // CompanyServiceClaimReport
  SelectedClaimReport: BehaviorSubject<SelectedClaimReport>;
  // Capture
  SelectedCapture: BehaviorSubject<SelectedCapture>;

  testObservation = new BehaviorSubject<SelectedCompany>(null).asObservable();

  // subService.listen(this.testObservation).subscribe((val: object) => {});
  // listen (obsv: Observerable<any>) {
//      obsv.pipe(...).subscribe(...)
//
  // }
  // subService.testObservaton.pipe(...).subscribe(...);
  // subService.close();

  // company
  setCompany(company: SelectedCompany) {
    this.selectedCompany.next(company);
    sessionStorage.setItem(`${environment.Sessions.companyData}`, JSON.stringify(company));
  }
  setCompanyOEM(companyOEM: SelectedCompanyOEM) {
    this.selectedCompanyOEM.next(companyOEM);

  }
  // item
  setItem(item: SelectedItem) {
    this.selectedItem.next(item);
    sessionStorage.setItem(`${environment.Sessions.itemData}`, JSON.stringify(item));
  }
  // BOM
  setBOM(BOM: SelectedBOM) {
    this.SelectedBOM.next(BOM);
    sessionStorage.setItem(`${environment.Sessions.BOMData}`, JSON.stringify(BOM));
  }
  // Permit
  setPermit(Permit: SelectedPermit) {
    this.SelectedPermit.next(Permit);
    sessionStorage.setItem(`${environment.Sessions.PermitData}`, JSON.stringify(Permit));
  }
  // CompanyServiceClaimReport
  setClaimReport(ClaimReport: SelectedClaimReport) {
    this.SelectedClaimReport.next(ClaimReport);
    sessionStorage.setItem(`${environment.Sessions.ClaimReportData}`, JSON.stringify(ClaimReport));
  }
   // Capture
   setCapture(Capture: SelectedCapture) {
    this.SelectedCapture.next(Capture);
    sessionStorage.setItem(`${environment.Sessions.CaptureData}`, JSON.stringify(Capture));
  }


  // company
  observeCompany() {
    return this.selectedCompany.asObservable();
  }
  observeCompanyOEM() {
    return this.selectedCompanyOEM.asObservable();
  }


  // item
  observeItem() {
    return this.selectedItem.asObservable();
  }
  // BOM
  observeBOM() {
    return this.SelectedBOM.asObservable();
  }
  // Permit
  observePermit() {
    return this.SelectedPermit.asObservable();
  }
   // CompanyServiceClaimReport
   observeClaimReport() {
    return this.SelectedClaimReport.asObservable();
  }
    // Capture
    observeCapture() {
      return this.SelectedCapture.asObservable();
    }

  // company
  flushCompanySession() {
    sessionStorage.removeItem(`${environment.Sessions.companyData}`);
  }
  // item
  flushItemSession() {
    sessionStorage.removeItem(`${environment.Sessions.itemData}`);
  }
  // BOM
  flushBOMSession() {
    sessionStorage.removeItem(`${environment.Sessions.BOMData}`);
  }
  // Permit
  flushPermitSession() {
    sessionStorage.removeItem(`${environment.Sessions.PermitData}`);
  }
  // CompanyServiceClaimReport
  flushClaimReportSession() {
    sessionStorage.removeItem(`${environment.Sessions.ClaimReportData}`);
  }
  // Capture
  flushCaptureSession() {
    sessionStorage.removeItem(`${environment.Sessions.CaptureData}`);
  }



  /**
   * list
   */
  public list(model: CompanyList) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/list`;
      this.httpClient
        .post(apiURL, model)
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

  public Update(model: UpdateCompany) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/update`;
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

  public Add(model: AddCompany) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/add`;
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

  /**
   * list
   */
  public info(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/info`;
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

  public AddInfo(model: AddCompanyInfo) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/infoadd`;
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

  public UpdateInfo(model: UpdateCompanyInfo) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/infoUpdate`;
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


  /**
   * contacts
   */
  public contacts(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/contacts`;
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

   /*Add*/
   public addContact(model: AddContact) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/contactAdd`;
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


   /*Add*/
   public UpdateContact(model: AddContact) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/contactUpdate`;
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



  /**
   * contacts
   */
  public address(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/address`;
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

  public AddAddress(model: AddCompanyAddress) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/addaddress`;
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

  public UpdateAddress(model: UpdateCompanyAddress) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updateaddress`;
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

  /**
   * service
   */
  public service(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/companyService`;
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

  public itemservice(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemServices`;
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

  public itemserviceadd(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemServicesAdd`;
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

  public itemserviceupdate(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemServicesUpdate`;
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

  public AddService(model: AddCompanyService) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/addCompanyService`;
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

  public UpdateService(model: UpdateCompanyService) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updateCompanyService`;
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

  public items(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/companyItems`;
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

  public additem(model: AddCompanyItem) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/addCompanyItem`;
      this.httpClient
        .post(apiURL, model)
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

  public itemupdate(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updateItem`;
      this.httpClient
        .post(apiURL, model)
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

  public RemoveItemList(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/removeItem`;
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

  public getCompanyBoms(model: GetCompanyBOMs) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/companyBoms`;
      this.httpClient
        .post(apiURL, model)
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

  public getCompanyServiceClaims(model: GetCompanyServiceClaims) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/serviceClaims`;
      this.httpClient
        .post(apiURL, model)
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

  public getServiceClaimReports(model: GetServiceClaimReports) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/ServiceClaimReports`;
      this.httpClient
        .post(apiURL, model)
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

  public prieviewReport(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/PreviewCompanyReport`;
      this.httpClient
        .post(apiURL, model)
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

  public regenerateReport(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/RegenerateCompanyReport`;
      this.httpClient
        .post(apiURL, model)
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

  public downloadReport(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/DownloadReport`;
      this.httpClient
        .post(apiURL, model)
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

  public getPermitsByDate(model: GetPermitsByDate) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/PermitsByDate`;
      this.httpClient
        .post(apiURL, model)
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

  public getSAD500LinesByPermits(model: GetSAD500LinesByPermits) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/SAD500LinesByPermits`;
      this.httpClient
        .post(apiURL, model)
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
  public addSAD500Linesclaim(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/AddSAD500Linesclaim`;
      this.httpClient
        .post(apiURL, model)
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

  public getCompanyPermits(model: GetCompanyPermits) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/Permits`;
      this.httpClient
        .post(apiURL, model)
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

   public getPermitImportTariffs(model: GetPermitImportTariffs) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/PermitImportTariffs`;
      this.httpClient
        .post(apiURL, model)
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

  public getBOMLines(model: GetBOMLines) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/BomLines`;
      this.httpClient
        .post(apiURL, model)
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

  public getItemList(model: GetItemList) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/items`;
      this.httpClient
        .post(apiURL, model)
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

  public getItemTypesList(model) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/itemtypes/list`;
      this.httpClient
        .post(apiURL, model)
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

  public getAlternateItemList(model: GetIAlternateItemList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/alternateItems`;
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
  public addCompanyServiceClaim(model: AddComanyServiceClaim) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/AddCompanyServiceClaim`;
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

  public alternatItemsUpdate(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updateAlternateItems`;
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

  public addtoGroup(model: AddItemGroup) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/addItemGroup`;
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

  public getItemValueList(model: GetItemValuesList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemValuesList`;
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

  public UpdateItemValue(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemValuesUpdate`;
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


  public RemoveItemValue(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemValuesRemove`;
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

  public getItemParentsList(model: GetItemParentsList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemParentsList`;
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

  public AddItemParent(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemParentAdd`;
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

  public UpdateItemParent(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemParentUpdate`;
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


  public RemoveItemParent(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemParentRemove`;
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

  public getTariffList(model: GetTariffList) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/tariffs/list`;
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

  /**
   * Upload
   */
  public Upload(src: File[]) {
    if (src !== undefined) {
      const formData = new FormData();

      src.forEach(file => {
        formData.append('files', file);
      });

      return new Promise((resolve, reject) => {
        const apiURL = `${environment.ApiEndpoint}/transactions/upload`;
        this.httpClient
        .post(apiURL, formData)
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

  public companyOEMList(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oems/read`;
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
  public companyOEMAdd(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oems/create`;
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
  public companyOEMUpdate(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oems/update`;
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
  public companyOEMQuarterList(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/read`;
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
  public companyOEMQuarterAdd(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/create`;
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
  public companyOEMQuarterUpdate(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/update`;
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
  public companyOEMQuarterSupplyList(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/supply/read`;
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
  public companyOEMQuarterSupplyAdd(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/supply/create`;
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
  public companyOEMQuarterSupplyUpdate(model) {
    const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/oem/quarter/supply/update`;
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

export class SelectedCompany {
  companyID: number;
  companyName: string;
  selectedTransactionID?: number;
}

export class SelectedItem {
  groupID: string;
  itemID: number;
  itemName: string;
}

export class SelectedBOM {
  bomid: number;
  status: string;
}

export class SelectedPermit {
  permitID: number;
  permitCode: string;
}

export class SelectedClaimReport {
  companyServiceID: number;
  companyID: number;
  companyName: string;
  claimNumber: number;
  serviceId: number;
  serviceName: string;
}

export class SelectedCapture {
  capturestate = false;
  token?: string;
}
export class AddComanyServiceClaim {
userID: number;
companyServiceID: number;
claimDate: Date | string;
}
export class AddComanyServiceClaimResponse {
  outcome: Outcome;
  companyServiceClaimID: number;
}
