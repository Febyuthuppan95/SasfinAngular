import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PDFViewerComponent implements OnInit, OnChanges, AfterViewInit {
  constructor() { }

  @Input() pdf: string | ArrayBuffer;
  @Input() minZoom: number;

  page = 1;
  zoom = 1;
  ready: boolean;
  shortcuts: ShortcutInput[] = [];

  pdfSRC: ArrayBuffer;
  displayPDF = false;

  zoom_to = 0.8;
  rotation = 0;
  src: string;
  originalSize: boolean = true;

  ngOnInit(): void {
    if (this.pdf !== undefined) {
      console.log('yes  ' + this.pdf);
      this.ready = true;
    }
  }

  ngOnChanges(): void {
    if (this.pdf !== undefined) {
      this.ready = true;
    } else {
      this.ready = false;
    }

    if (this.minZoom !== undefined) {
      this.zoom = this.minZoom;
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'alt + right',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.page++
      },
      {
        key: 'alt + left',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.page--
      },
      {
        key: 'alt + up',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e =>  {
          if (this.zoom_to <= 1.6) {
          this.zoom_in();
          }
        }
      },
      {
        key: 'alt + down',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          if (this.zoom_to > 0.8) {
          this.zoom_out();
          }
        }
      },
      {
        key: 'alt + r',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => {
          this.rotatePDF(this.rotation + 90);
        }
      },
    );
  }

  pageChange(page: number) {
    console.log(page);
    if (page <= 0) {
      page = 1;
    }

    this.page = page;
  }
  rotatePDF(deg: number) {
    this.rotation = deg;
  }

  zoomChange(variant: number) {
    this.zoom_to = this.zoom_to + variant;
  }

  zoom_in() {
    console.log('ZOOM IN');
    console.log('currentZoom');
    console.log(this.zoom_to);
    if (this.zoom_to <= 1.6) {
    this.zoom_to = this.zoom_to + 0.2;
    }
    console.log('zoom_to');
    console.log(this.zoom_to);
  }

  zoom_out() {
    console.log('ZOOM OUT');
    console.log('currentZoom');
    console.log(this.zoom_to);
    if (this.zoom_to > 0.8) {
       this.zoom_to = this.zoom_to - 0.2;
    }
    console.log('zoom_to');
    console.log(this.zoom_to);
  }
}

