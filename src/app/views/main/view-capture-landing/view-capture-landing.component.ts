import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { CompanyService, SelectedCompany, SelectedCapture } from 'src/app/services/Company.Service';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { DocumentService } from 'src/app/services/Document.Service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { CaptureAttachmentResponse, CaptureAttachment } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { AttachmentStatsResponse } from 'src/app/models/HttpResponses/AttachmentStatsResponse';

@Component({
  selector: 'app-view-capture-landing',
  templateUrl: './view-capture-landing.component.html',
  styleUrls: ['./view-capture-landing.component.scss']
})
export class ViewCaptureLandingComponent implements OnInit, OnDestroy {


  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router,
              private docService: DocumentService,
              private userIdle: UserIdleService,
              private transactionService: TransactionService,
              private companyService: CompanyService,
              private dialog: MatDialog,
              private snackbarService: HelpSnackbar,
              private eventService: EventService) { }

@ViewChild(NotificationComponent, { static: false })
private notify: NotificationComponent;



  private unsubscribe$ = new Subject<void>();

  currentBackground: string;
  currentTheme: string;
  currentUser: User;

  CaptureInfo: CaptureAttachment;
  docPath: string;
  fileType: string;
  fileTypeID: number;
  companyID: number;
  companyName: string;
  transactionID: number;
  attachmentID: number;
  transactionType: string;
  ACT: number;
  TACT: number;
  ATBC: number;
  Inc: number;
  ERR: number;

  start = false;
  loading = false;
  tmpCompanyToken: string; // No Duplicate events

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.themeService.observeBackground()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: string) => {
      if (result !== undefined) {
        this.currentBackground = `${environment.ApiBackgroundImages}/${result}`;
      }
    });
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCapture()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCapture) => {
      if (obj !== null) {
        this.start = obj.capturestate;
        // console.log(this.start + ', ' + obj.capturestate);
        if (this.start) {
          // if (obj.token !== this.tmpCompanyToken) {
            this.loadNextAttachment();
          //   this.tmpCompanyToken = obj.token;
          // }
        }
      }
    });

    if (this.start) {
      this.loadNextAttachment();
    }

    this.loadAttachmentStats();
  }

  loadNextAttachment() {
    const model = {
      captureID: this.currentUser.userID,
    };
    this.transactionService
    .GetAttatchments(model)
    .then(
      (res: CaptureAttachmentResponse) => {
        if (res.captureattachment.attachmentID !== 0 || res.captureattachment.transactionID !== 0) {
          this.CaptureInfo = res.captureattachment;
          this.docPath = res.captureattachment.filepath;
          this.transactionID = res.captureattachment.transactionID;
          this.attachmentID = res.captureattachment.attachmentID;
          this.fileType = res.captureattachment.filetype;
          this.fileTypeID = res.captureattachment.fileTypeID;
          this.companyID = res.captureattachment.companyID;
          this.companyName = res.captureattachment.companyName;
          this.transactionType = res.captureattachment.transactionType;
          this.docService.loadDocumentToViewer(this.docPath);

          this.transactionService.setCurrentAttachment({
            transactionID: this.transactionID,
            attachmentID: this.attachmentID,
            docType: this.fileType,
            transactionType: this.transactionType,
            issueID: res.captureattachment.issueID,
            reason: res.captureattachment.reason
          });

          this.companyService.setCompany({ companyID: this.companyID, companyName: this.companyName });
          this.router.navigate(['capture', 'transaction', 'attachment', btoa(this.docPath)]);
          this.loading = false;
        } else {
          this.notify.toastrwarning('Information', 'No attachments to capture');
          this.companyService.setCapture({ capturestate: false});
        }

      },
      msg => {
        this.loading = false;
      }
    );
  }

  loadAttachmentStats() {
    const model = {
      captureID: this.currentUser.userID,
    };
    this.transactionService
    .GetAttatchmentStats(model)
    .then(
      (res: AttachmentStatsResponse) => {

        this.ACT = res.act;
        this.TACT = res.tact;
        this.ATBC = res.atbc;
        this.Inc = res.inc;
        this.ERR = res.err;
      },
      msg => {
        this.loading = false;
      }
    );
  }

  loadCaptureScreen() {
    this.companyService.setCapture({ capturestate: true});
    this.loadNextAttachment();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
