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

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {
    let sessionData: SelectedCompany = null;

    if (sessionStorage.getItem(`${environment.Sessions.companyData}`) !== undefined || null) {
      sessionData = JSON.parse(sessionStorage.getItem(`${environment.Sessions.companyData}`));
    }

    this.selectedCompany = new BehaviorSubject<SelectedCompany>(sessionData);
  }

  selectedCompany: BehaviorSubject<SelectedCompany>;

  setCompany(company: SelectedCompany) {
    this.selectedCompany.next(company);
    sessionStorage.setItem(`${environment.Sessions.companyData}`, JSON.stringify(company));
  }

  observeCompany() {
    return this.selectedCompany.asObservable();
  }

  flushCompanySession() {
    sessionStorage.removeItem(`${environment.Sessions.companyData}`);
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
      const apiURL = `${environment.ApiEndpoint}/companies/companyservice`;
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
      const apiURL = `${environment.ApiEndpoint}/companies/addcompanyservice`;
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
      const apiURL = `${environment.ApiEndpoint}/companies/updatecompanyservice`;
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
      const apiURL = `${environment.ApiEndpoint}/companies/companyitems`;
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
      const apiURL = `${environment.ApiEndpoint}/companies/addcompanyitem`;
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

  public updateitem(model: UpdateCompanyItem) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/companies/updatecompanyitem`;
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
