import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { PDFSource } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PDFViewerComponent implements OnInit, OnChanges, AfterViewInit {
  constructor() { }

  @Input() pdf: ArrayBuffer;
  @Input() minZoom: number;

  page = 1;
  zoom = 1;
  ready: boolean;
  shortcuts: ShortcutInput[] = [];

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
          key: 'ctrl + right',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.page++
        },
        {
          key: 'ctrl + left',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.page--
        },
        {
          key: 'ctrl + up',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e =>  {
            if (this.zoom < 2) {
              this.zoom += 0.2;
            }
          }
        },
        {
          key: 'ctrl + down',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (this.zoom !== this.minZoom) {
              this.zoom -= 0.2;
            }
          }
        },
    );
  }
}
