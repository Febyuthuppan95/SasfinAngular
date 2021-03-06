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
import { GetCompanyBOMs, UpdateCompanyBOMs } from '../models/HttpRequests/GetCompanyBOMs';
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
import { CompanyLocalReceipt } from '../views/main/view-company-list/view-company-supplier-list/view-company-supplier-list.component';
// tslint:disable-next-line: max-line-length
import { LocalReceipt } from '../views/main/view-company-list/view-company-supplier-list/view-quarter-receipt-transactions/view-quarter-receipt-transactions.component';
import { GetPermitTypes } from '../models/HttpRequests/GetPermitTypes';
import { GetCompanyPRCCs } from '../models/HttpRequests/GetCompanyPRCCs';
import { GetCompanyEPCs } from '../models/HttpRequests/GetCompanyEPCs';

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
    let sessionData11: SelectedROE = null;
    // PermitType
    let sessionData10: SelectedPermitType = null;
    // Permit
    let sessionData4: SelectedPermit = null;
    // CompanyServiceClaimReport
    let sessionData5: SelectedClaimReport = null;
    // Capture
    let sessionData6: SelectedCapture = null;

    let sessionData7: SelectedCompanyOEM = null;
    let sessionData8: CompanyLocalReceipt = null;
    let sessionData9: LocalReceipt = null;



    // company
    if (sessionStorage.getItem(`${environment.Sessions.companyData}`) !== undefined || null) {
      sessionData = JSON.parse(sessionStorage.getItem(`${environment.Sessions.companyData}`));
    }
    if (sessionStorage.getItem(`${environment.Sessions.companyOEMData}`) !== undefined || null) {
      sessionData7 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.companyOEMData}`));
    }
    // item
    if (sessionStorage.getItem(`${environment.Sessions.itemData}`) !== undefined || null) {
      sessionData2 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.itemData}`));
    }
    // BOM
    if (sessionStorage.getItem(`${environment.Sessions.BOMData}`) !== undefined || null) {
      sessionData3 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.BOMData}`));
    }
    // ROE
    if (sessionStorage.getItem(`${environment.Sessions.ROEData}`) !== undefined || null) {
      sessionData11 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.ROEData}`));
    }
    // PermitType
    if (sessionStorage.getItem(`${environment.Sessions.PermitTypeData}`) !== undefined || null) {
      sessionData10 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.PermitTypeData}`));
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

    if (sessionStorage.getItem(`${environment.Sessions.companyLocalReceiptData}`) !== undefined || null) {
      sessionData8 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.companyLocalReceiptData}`));
    }
    if (sessionStorage.getItem(`${environment.Sessions.localTransactionData}`) !== undefined || null) {
      sessionData9 = JSON.parse(sessionStorage.getItem(`${environment.Sessions.localTransactionData}`));
    }

    // company
    this.selectedCompany = new BehaviorSubject<SelectedCompany>(sessionData);
    // OEM
    this.selectedCompanyOEM = new BehaviorSubject<SelectedCompanyOEM>(sessionData7);
    // item
    this.selectedItem = new BehaviorSubject<SelectedItem>(sessionData2);
    // BOM
    this.SelectedBOM = new BehaviorSubject<SelectedBOM>(sessionData3);
    // ROE
    this.SelectedROE = new BehaviorSubject<SelectedROE>(sessionData11);
    // PermitType
    this.SelectedPermitType = new BehaviorSubject<SelectedPermitType>(sessionData10);
    // Permit
    this.SelectedPermit = new BehaviorSubject<SelectedPermit>(sessionData4);
    // CompanyServiceClaimReport
    this.SelectedClaimReport = new BehaviorSubject<SelectedClaimReport>(sessionData5);
    // Capture
    this.SelectedCapture = new BehaviorSubject<SelectedCapture>(sessionData6);
    // Local Receipts
    this.selectedLocalReceipt = new BehaviorSubject<CompanyLocalReceipt>(sessionData8);
    this.selectedLocalTransaction = new BehaviorSubject<LocalReceipt>(sessionData9);

  }
  // company
  selectedCompany: BehaviorSubject<SelectedCompany>;
  // OEM
  selectedCompanyOEM: BehaviorSubject<SelectedCompanyOEM>;
  // item
  selectedItem: BehaviorSubject<SelectedItem>;
  // BOM
  SelectedBOM: BehaviorSubject<SelectedBOM>;
  // ROE
  SelectedROE: BehaviorSubject<SelectedROE>;
  // PermitType
  SelectedPermitType: BehaviorSubject<SelectedPermitType>;
  // Permit
  SelectedPermit: BehaviorSubject<SelectedPermit>;
  // CompanyServiceClaimReport
  SelectedClaimReport: BehaviorSubject<SelectedClaimReport>;
  // Capture
  SelectedCapture: BehaviorSubject<SelectedCapture>;

  testObservation = new BehaviorSubject<SelectedCompany>(null).asObservable();
  selectedLocalReceipt: BehaviorSubject<CompanyLocalReceipt>;
  selectedLocalTransaction: BehaviorSubject<LocalReceipt>;

  // subService.listen(this.testObservation).subscribe((val: object) => {});
  // listen (obsv: Observerable<any>) {
//      obsv.pipe(...).subscribe(...)
//
  // }
  // subService.testObservaton.pipe(...).subscribe(...);
  // subService.close();

  // Set Local Receipt

  setLocalReceipt(record: CompanyLocalReceipt) {
    this.selectedLocalReceipt.next(record);
    sessionStorage.setItem(`${environment.Sessions.companyLocalReceiptData}`, JSON.stringify(record));
  }
  setLocalTransaction(record: LocalReceipt) {
    this.selectedLocalTransaction.next(record);
    sessionStorage.setItem(`${environment.Sessions.localTransactionData}`, JSON.stringify(record));
  }
  // Company
  setCompany(company: SelectedCompany) {
    this.selectedCompany.next(company);
    sessionStorage.setItem(`${environment.Sessions.companyData}`, JSON.stringify(company));
  }
  // OEM
  setCompanyOEM(companyOEM: SelectedCompanyOEM) {
    this.selectedCompanyOEM.next(companyOEM);
    sessionStorage.setItem(`${environment.Sessions.companyOEMData}`, JSON.stringify(companyOEM));
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
  // ROE
  setROE(ROE: SelectedROE) {
    this.SelectedROE.next(ROE);
    sessionStorage.setItem(`${environment.Sessions.ROEData}`, JSON.stringify(ROE));
  }
  // PermitType
  setPermitType(PermitType: SelectedPermitType) {
    this.SelectedPermitType.next(PermitType);
    console.log(this.SelectedPermitType);
    sessionStorage.setItem(`${environment.Sessions.PermitTypeData}`, JSON.stringify(PermitType));
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

  // LocalTransaction
  observerLocalTransaction() {
    return this.selectedLocalTransaction.asObservable();
  }
  // Local Receipt
  observeLocalReceipt() {
    return this.selectedLocalReceipt.asObservable();
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
  // BOM
  observeROE() {
    return this.SelectedROE.asObservable();
  }
   // PermitType
   observePermitType() {

    return this.SelectedPermitType.asObservable();
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

    // Flush Local Receipt Data
    flushCompanyLocalReceipt() {
      sessionStorage.removeItem(`${environment.Sessions.companyLocalReceiptData}`);
    }
  // company
  flushCompanySession() {
    sessionStorage.removeItem(`${environment.Sessions.companyData}`);
  }
   // companyOEM
   flushCompanyOEMSession() {
    sessionStorage.removeItem(`${environment.Sessions.companyOEMData}`);
  }
  // item
  flushItemSession() {
    sessionStorage.removeItem(`${environment.Sessions.itemData}`);
  }
  // BOM
  flushBOMSession() {
    sessionStorage.removeItem(`${environment.Sessions.BOMData}`);
  }
   // ROE
   flushROESession() {
    sessionStorage.removeItem(`${environment.Sessions.ROEData}`);
  }
  // PermitType
  flushPermitTypeSession() {
    sessionStorage.removeItem(`${environment.Sessions.PermitTypeData}`);
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

  public additem(model: any) {
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

  public updateCompanyBoms(updateBOM: UpdateCompanyBOMs) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updateBom`;
      this.httpClient
        .post(apiURL, updateBOM)
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

  public getPermitTypes(model: GetPermitTypes) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/PermitTypes`;
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

  public getCompanyPRCCs(model: GetCompanyPRCCs) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/PRCC`;
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

  public getCompanyEPCs(model: GetCompanyEPCs) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/EPC`;
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

  public getItemjoinList(model: GetItemList) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/itemsJoin`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/read`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/create`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/update`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/supply/read`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/supply/create`;
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
      const apiURL = `${environment.ApiEndpoint}/oems/quarters/supply/update`;
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

export class SelectedROE {
  ROEDateID: number;
}

export class SelectedPermitType {
  permitTypeID: number;
  permitTypeName: string;
}

export class SelectedPermit {
  permitID: number;
  permitCode: string;
}

export class SelectedClaimReport {
  companyServiceID?: number;
  companyID: number;
  companyName: string;
  claimNumber: number;
  serviceId?: number;
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
