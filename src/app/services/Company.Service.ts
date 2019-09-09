import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AddCompany } from '../models/HttpRequests/AddCompany';
import { UpdateCompany } from '../models/HttpRequests/UpdateCompany';
import { CompanyList } from '../models/HttpRequests/CompanyList';

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

<<<<<<< HEAD
  setCompany(company: SelectedCompany) { this.selectedCompany.next(company); }
  
  observeCompany() {
    return this.selectedCompany.asObservable();
   }
=======
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
>>>>>>> e8d8d17a75ec5dee54765706c69ef96b3e0e0792

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
