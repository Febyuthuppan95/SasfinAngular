import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {

  constructor(private docService: DocumentService) { }

  pdfSRC: Blob;
  displayPDF = false;

  ngOnInit() {
    this.docService.observeActiveDocument().subscribe((fileName) => {
      this.docService.get(fileName).then(
        (res: string) => {
          this.pdfSRC = new Blob([res], {type: 'application/pdf'});
          this.displayPDF = true;
        },
        (msg) => {
          console.log(msg);
        }
      );
    });
  }
}
