import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private httpClient: HttpClient) {
    this.activeDocument = new BehaviorSubject<string>(null);
    const tempStorage = sessionStorage.getItem('captureFormDoc');

    if (tempStorage !== undefined) {
      this.activeDocument.next(tempStorage);
    }
  }

  activeDocument: BehaviorSubject<string>;

  /**
   * loadDocumentToViewer
   */
  public loadDocumentToViewer(documentURL: string): void {
    sessionStorage.setItem('captureFormDoc', documentURL);
    this.activeDocument.next(documentURL);
  }

  /**
   * observeActiveDocument
   */
  public observeActiveDocument(): Observable<string> {
    return this.activeDocument.asObservable();
  }

  /**
   * get
   */
  public get(docName: string) {
    console.log(docName);
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiDocuments}/${docName}`;
      this.httpClient
        .get(apiURL, {responseType: 'arraybuffer'})
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
   *
   * tslint:disable-next-line: no-redundant-jsdoc
   * @param fileUpload
   * @param requestModel
   * @param endpoint
   */
  public upload(fileUpload: File, requestModel: object, endpoint: string) {
    // console.log(fileUpload);
    // console.log(requestModel);
    const formData = new FormData();

    formData.append('requestModel', JSON.stringify(requestModel));
    formData.append('file', fileUpload);

    // console.log(formData.get('file'));
    // console.log(formData.get('requestModel'));

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/${endpoint}`;
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
