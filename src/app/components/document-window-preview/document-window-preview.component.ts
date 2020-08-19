import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-window-preview',
  templateUrl: './document-window-preview.component.html',
  styleUrls: ['./document-window-preview.component.scss']
})
export class DocumentWindowPreviewComponent implements OnInit {

  constructor(private docService: DocumentService,
              private activatedRoute: ActivatedRoute) { }

  pdfSRC: string;
  displayPDF = false;
  failedToLoad = false;
  page = 1;
  rotation = 0;
  zoom = 0.8;
  ready: boolean;
  count = 0;
  src = '';

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.src) {
        this.src = atob(params.src);
        this.failedToLoad = false;
        this.docService.get(this.src).then(
          (res: string) => {
            if (res === null) {
              this.failedToLoad = true;
            } else {
              this.failedToLoad = false;
            }

            this.pdfSRC = res;
            this.displayPDF = true;
          },
          (msg) => {
            this.failedToLoad = true;
          }
        );
      }
    });
  }

  pageChange(page: number) {
    if (page <= 0) {
      page = 1;
    }

    this.page = page;
  }

  rotatePDF(deg: number) {
    this.rotation = deg;
  }

  zoomChange(variant: number) {
    this.zoom = this.zoom + variant;
  }

  zoom_in() {
    this.zoom = this.zoom + 0.2;
  }

  zoom_out() {
    if (this.zoom >= 0.4) {
       this.zoom = this.zoom - 0.2;
    }
  }

}
