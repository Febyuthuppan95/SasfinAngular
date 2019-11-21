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

  pdfSRC: string;
  displayPDF = false;
  page = 1;
  zoom = 1;
  shortcuts: ShortcutInput[] = [];

  ngOnInit() {
    this.docService.observeActiveDocument()
    .pipe(takeUntil(this.unsubscribeTransaction$))
    .subscribe((fileName) => {
      if (fileName !== null || undefined) {
        this.docService.get(fileName).then(
          (res: string) => {
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
            if (this.zoom !== 1) {
              this.zoom -= 0.2;
            }
          }
        },
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeTransaction$.next();
    this.unsubscribeTransaction$.complete();
  }
}
