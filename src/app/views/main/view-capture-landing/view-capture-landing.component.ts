import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CompanyService, SelectedCapture } from 'src/app/services/Company.Service';
import { DocumentService } from 'src/app/services/Document.Service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { CaptureAttachmentResponse, CaptureAttachment } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { AttachmentStatsResponse } from 'src/app/models/HttpResponses/AttachmentStatsResponse';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
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
              private transactionService: TransactionService,
              private companyService: CompanyService) { }

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

  showLoader = false;

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
        if (this.start) {
            this.loadNextAttachment();
        }
      }
    });

    // if (this.start) {
    //   this.loadNextAttachment();
    // }

    this.loadAttachmentStats();
  }

  async loadNextAttachment() {
    setTimeout(() => { this.showLoader = true; });
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

          if (res.captureattachment.filetype.toUpperCase() === 'LINKING') { // FILETYPE === 'LINKING'
            this.transactionService.setCurrentAttachment({
              transactionID: this.transactionID, // TRANSACTION ID
              attachmentID: -1,
              docType: '',
              transactionType: this.transactionType, // TRANSACTION TYPE
              transactionName: this.companyName, // TRANSACTION NAME
            });

            this.router.navigate(['transaction', 'linking']);

          } else {
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

            setTimeout(() => {
              this.router.navigate([
                'capture',
                'transaction',
                'attachment',
                btoa(this.docPath),
                btoa(this.fileType),
                btoa(this.attachmentID.toString()),
                btoa(this.transactionID.toString()),
                btoa(this.transactionType),
                btoa(res.captureattachment.issueID === 7 ? '1' : '-1'),
                btoa(res.captureattachment.reason)]);

              this.showLoader = false;
              this.loading = false;
            }, 500);
          }

          this.fileType = res.captureattachment.filetype;

        } else {
          this.notify.toastrwarning('Information', 'No attachments to capture');
          this.companyService.setCapture({ capturestate: false});
          this.showLoader = false;
          this.loading = false;
        }
      },
      () => {
        this.loading = false;
        setTimeout(() => { this.showLoader = false; });
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
      () => {
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
