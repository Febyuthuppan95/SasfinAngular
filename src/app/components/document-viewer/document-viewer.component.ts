import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {

  constructor(private docService: DocumentService) { }

  pdfSRC: string;

  ngOnInit() {
    this.docService.observeActiveDocument().subscribe((url) => {
      this.pdfSRC = url;
    });
  }

}
