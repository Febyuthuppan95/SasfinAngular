import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {

  constructor(private docService: DocumentService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  pdfSRC: Blob;
  displayPDF = false;

  ngOnInit() {
    this.docService.observeActiveDocument().subscribe((fileName) => {
      if (fileName !== null || undefined) {
        this.docService.get(fileName).then(
          (res: string) => {
            this.pdfSRC = new File([res], 'file.pdf', {type: 'application/pdf'});
            this.displayPDF = true;
          },
          (msg) => {
            console.log(msg);
          }
        );
      } else {
        this.notify.errorsmsg('Failure', 'No PDF was selected.');
      }
    });
  }
}
