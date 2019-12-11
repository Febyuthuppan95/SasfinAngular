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
   * @param file
   */
  public upload(fileUpload: File) {
    console.log(fileUpload);
    const formData = new FormData();
    formData.append('file', fileUpload);
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/boms/upload`;
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
