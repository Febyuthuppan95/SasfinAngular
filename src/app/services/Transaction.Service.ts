import { HttpClient, HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {}

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
   * listAttatchments
   */
  public listAttatchments(requestModel) {
    return new Promise((resolve, reject) => {
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

  public uploadAttachment(name: string, file: File, type: string, transactionID: number, userID: number, companyName: string) {
    const requestModel = {
      name,
      fileName: file.name,
      type,
      transactionID,
      userID,
      companyName
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestModel', JSON.stringify(requestModel));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/transaction/attachment/upload`;
      this.httpClient.post(apiURL, formData)
      .toPromise()
      .then(res => resolve(res), msg => reject(msg));
    });
  }
}
