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

    // company
    this.selectedCompany = new BehaviorSubject<SelectedCompany>(sessionData);
    // item
    this.selectedItem = new BehaviorSubject<SelectedItem>(sessionData2);
    // BOM
    this.SelectedBOM = new BehaviorSubject<SelectedBOM>(sessionData3);

  }
  // company
  selectedCompany: BehaviorSubject<SelectedCompany>;
  // item
  selectedItem: BehaviorSubject<SelectedItem>;
   // BOM
   SelectedBOM: BehaviorSubject<SelectedBOM>;

  // company
  setCompany(company: SelectedCompany) {
    this.selectedCompany.next(company);
    sessionStorage.setItem(`${environment.Sessions.companyData}`, JSON.stringify(company));
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

  // company
  observeCompany() {
    return this.selectedCompany.asObservable();
  }
  // item
  observeItem() {
    return this.selectedItem.asObservable();
  }
  // BOM
  observeBOM() {
    return this.SelectedBOM.asObservable();
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
      const apiURL = `${environment.ApiEndpoint}/companies/infoupdate`;
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
            console.log(res);
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

  public getTariffList() { // model: GetTariffList
    // const json = JSON.parse(JSON.stringify(model));
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/tariffs/list`;
      this.httpClient.get(apiURL) // ,json
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
