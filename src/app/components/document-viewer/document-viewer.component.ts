import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from '../notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private docService: DocumentService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribeTransaction$ = new Subject<void>();

  pdfSRC: ArrayBuffer;
  displayPDF = false;
  page = 1;
  zoom_to = 0.8;
  rotation = 0;
  shortcuts: ShortcutInput[] = [];
  src: string;
  originalSize: boolean = true;

  ngOnInit() {
    this.docService.observeActiveDocument()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe((fileName) => {
      if (fileName !== null || undefined) {
        // console.log(fileName);
        this.docService.get(fileName).then(
          (res: ArrayBuffer) => {
            this.pdfSRC = res;
            this.displayPDF = true;
          },
          (msg) => {}
        );
      } else {
        this.notify.errorsmsg('Failure', 'No PDF was selected.');
      }
    });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + right',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.pageChange(this.page + 1)
        },
        {
          key: 'alt + left',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.pageChange(this.page - 1)
        },
        {
          key: 'alt + up',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e =>  {
            this.zoom_in();
          }
        },
        {
          key: 'alt + down',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.zoom_out();
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
    if (page <= 0) {
      page = 1;
    }

    this.page = page;
  }

  rotatePDF(deg: number) {
    const page = this.page;
    this.rotation = deg;
    this.page = page;
  }

  zoomChange(variant: number) {
    const page = this.page;
    this.zoom_to = this.zoom_to + variant;
    this.page = page;
  }

  zoom_in() {
    const page = this.page;
    this.zoom_to = this.zoom_to + 0.2;
    this.page = page;
  }

  zoom_out() {
    if (this.zoom_to >= 0.4) {
      const page = this.page;
      this.zoom_to = this.zoom_to - 0.2;
      this.page = page;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
