import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor() {
    this.activeDocument = new BehaviorSubject<string>(null);
  }

  activeDocument: BehaviorSubject<string>;

  /**
   * loadDocumentToViewer
   */
  public loadDocumentToViewer(documentURL: string): void {
    this.activeDocument.next(documentURL);
  }

  /**
   * observeActiveDocument
   */
  public observeActiveDocument(): Observable<string> {
    return this.activeDocument.asObservable();
  }
}
