import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { CompanyService } from 'src/app/services/Company.Service';
import { CompaniesContextMenuComponent } from 'src/app/components/menus/companies-context-menu/companies-context-menu.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompaniesListResponse, Company } from 'src/app/models/HttpResponses/CompaniesListResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CompanyList, AddCompany, UpdateCompany } from 'src/app/models/HttpRequests/Company';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureAttachmentResponse } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';

@Component({
  selector: 'app-view-capture-landing',
  templateUrl: './view-capture-landing.component.html',
  styleUrls: ['./view-capture-landing.component.scss']
})
export class ViewCaptureLandingComponent implements OnInit, OnDestroy {



  constructor(
    private router: Router,
    private docService: DocumentService,
    private transactionService: TransactionService,
    private userService: UserService,
    private themeService: ThemeService,
  ) {

  }
  @ViewChild(CompaniesContextMenuComponent, {static: true } )
  private contextmenu: CompaniesContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;


  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  displayFilter = false;
  docPath: string;
  transactionID: number;
  attachmentID: number;
  filetypeID: number;
  fileType: string;
  fileName: string;
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

  }

  CaptureStart() {

    const model = {
      captureID: this.currentUser.userID,
    };

    this.transactionService.GetAttatchments(model).then(
        (res: CaptureAttachmentResponse) => {

            this.transactionID = res.captureattachment.transactionID;
            this.attachmentID = res.captureattachment.attachmentID;
            this.filetypeID = res.captureattachment.filetypeID;
            this.fileType = res.captureattachment.filetype;
            this.fileName = res.captureattachment.filename;
            this.docPath = res.captureattachment.filepath;
        },
        msg => {
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
        }
    );

    this.docService.loadDocumentToViewer(this.docPath);
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.attachmentID, docType: this.fileType });
    this.router.navigate(['capture', 'transaction', 'attachment']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

