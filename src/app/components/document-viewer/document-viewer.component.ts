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
        this.docService.get(fileName).then(
          (res: ArrayBuffer) => {
            console.log(res);
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
            this.zoom_in();
          }
        },
        {
          key: 'ctrl + down',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            this.zoom_out();
          }
        },
        {
          key: 'ctrl + r',
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
    this.rotation = deg;
  }

  zoomChange(variant: number) {
    this.zoom_to = this.zoom_to + variant;
  }

  zoom_in() {
    this.zoom_to = this.zoom_to + 0.2;
  }

  zoom_out() {
    if (this.zoom_to >= 0.4) {
       this.zoom_to = this.zoom_to - 0.2;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
