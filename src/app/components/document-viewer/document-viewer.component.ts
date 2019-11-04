import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from '../notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit, OnDestroy {

  constructor(private docService: DocumentService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribeTransaction$ = new Subject<void>();

  pdfSRC: Blob;
  displayPDF = false;

  ngOnInit() {
    this.docService.observeActiveDocument()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe((fileName) => {
      if (fileName !== null || undefined) {
        this.docService.get(fileName).then(
          (res: string) => {
            this.pdfSRC = new File([res], 'file.pdf', {type: 'application/pdf'});
            this.displayPDF = true;
          },
          (msg) => {}
        );
      } else {
        this.notify.errorsmsg('Failure', 'No PDF was selected.');
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
