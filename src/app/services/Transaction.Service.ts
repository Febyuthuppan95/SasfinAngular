import { HttpClient, HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { CreateTransactionRequest } from '../models/HttpRequests/TransactionRequests';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private httpClient: HttpClient) {
    let sessionData = null;

    if (sessionStorage.getItem(`${environment.Sessions.transactionData}`) !== null) {
      sessionData = JSON.parse(sessionStorage.getItem(`${environment.Sessions.transactionData}`));
    }

    this.currentAttachment = new BehaviorSubject<{ transactionID: number, attachmentID: number }>(sessionData);
  }

  currentAttachment: BehaviorSubject<{ transactionID: number, attachmentID: number }>;
  public observerCurrentAttachment() { return this.currentAttachment.asObservable(); }

  public setCurrentAttachment(next: { transactionID: number, attachmentID: number }) {
    this.currentAttachment.next(next);
    sessionStorage.setItem(`${environment.Sessions.transactionData}`, JSON.stringify(next));
  }

  /**
   * list
   */
  public list(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/list`;

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
   * list
   */
  public typessList(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/list/types`;

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
   * list
   */
  public statusList(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/list/statuses`;

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
   * listAttatchments
   */
  public async listAttatchments(requestModel) {
    return await new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/list/files`;
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
  public Upload(src: File) {
    console.log(src);
    if (src !== undefined) {
      const formData = new FormData();
      formData.append('file', src);

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

  public async uploadAttachment(name: string, file: File, type: string, transactionID: number, userID: number, company: string) {
    const requestModel = {
      name,
      fileName: file.name,
      type,
      transactionID,
      userID,
      company
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestModel', JSON.stringify(requestModel));

    return new Promise(async (resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/attachment/upload`;
      await this.httpClient.post(apiURL, formData)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }

  /**
   * updateAttachment
   */
  public updateAttachment(requestModel: object) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/attachment/update`;
      this.httpClient.post(apiURL, requestModel)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }

  public createdTransaction(userID: number, companyID: number, typeID: number, statusID: number, name: string) {
    const requestModel: CreateTransactionRequest = {
      userID,
      specificCompanyID: companyID,
      specificTransactioTypeID: typeID,
      specificTransactioStatusID: statusID,
      name
    };

    return new Promise(async (resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/create`;
      this.httpClient.post(apiURL, requestModel)
        .toPromise()
        .then(res => resolve(res), msg => reject(msg));
    });
  }

  public captureInfo(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/captureinfo`;
      this.httpClient.post(apiURL, requestModel)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }

  public captureInfoUpdate(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/captureinfo/update`;
      this.httpClient.post(apiURL, requestModel)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }

  public customsReleaseUpdate(requestModel) {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transactions/update/customsrelease`;
      this.httpClient.post(apiURL, requestModel)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }
}
