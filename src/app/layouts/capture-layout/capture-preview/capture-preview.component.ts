import { Component, OnInit, ViewChild, Input, Inject, ElementRef } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserIdleService } from 'angular-user-idle';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.Service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-capture-preview',
  templateUrl: './capture-preview.component.html',
  styleUrls: ['./capture-preview.component.scss']
})
export class CapturePreviewComponent implements OnInit {

  constructor(private docService: DocumentService,
              private userIdle: UserIdleService,
              private snackbarService: HelpSnackbar,
              private userService: UserService,
              public dialogRef: MatDialogRef<CapturePreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { src: string }) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('opentimeoutModal', {static: true })
  opentimeoutModal: ElementRef;

  @ViewChild('closetimeoutModal', {static: true })
  closetimeoutModal: ElementRef;

  pdfSRC: string;
  displayPDF = false;
  failedToLoad = false;
  count = 0;
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.failedToLoad = false;

    this.docService.get(this.data.src).then(
      (res: string) => {
        if (res === null) {
          this.failedToLoad = true;
        } else {
          this.failedToLoad = false;
        }

        // this.pdfSRC = new File([res], 'file.pdf', {type: 'application/pdf'});
        this.pdfSRC = res;
        this.displayPDF = true;
      },
      (msg) => {
        this.failedToLoad = true;
      }
    );

    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(count => {
      this.TriggerSessionTimeout(count);
    });

    // Start watch when time is up.
    this.userIdle.onTimeout()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.closetimeoutModal.nativeElement.click();
      this.userIdle.resetTimer();
      this.userIdle.stopTimer();
      this.userIdle.stopWatching();
      this.closeHelpContext();
      this.userService.logout();
    });

    this.userIdle.ping$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {});

  }

  closeHelpContext() {
    const newContext: SnackbarModel = {
      display: false,
      slug: '',
    };
    this.snackbarService.setHelpContext(newContext);
  }

  ResetSessionTimer() {
    this.userIdle.stopTimer();
    this.userIdle.resetTimer();
  }

  TriggerSessionTimeout(count) {
   this.count = 11;
   this.count =  this.count - count;

   if (this.count === 10) {
    this.opentimeoutModal.nativeElement.click();

   }
  }

  close() {
    this.dialogRef.close();
  }
}
