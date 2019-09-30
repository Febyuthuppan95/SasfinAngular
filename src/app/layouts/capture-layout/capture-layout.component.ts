import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { UserService } from 'src/app/services/user.Service';
import { Router } from '@angular/router';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureInfoResponse } from 'src/app/models/HttpResponses/ListCaptureInfo';
import { TransactionFileListResponse, TransactionFile } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { MatDialog } from '@angular/material';
import { CapturePreviewComponent } from './capture-preview/capture-preview.component';

@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss']
})
export class CaptureLayoutComponent implements OnInit {

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router,
              private transactionService: TransactionService,
              private companyService: CompanyService,
              private dialog: MatDialog) { }

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  currentBackground: string;
  currentTheme: string;
  currentUser: User;
  currentReaderPOS: { x: number, y: number } = {
    x: 0,
    y: 0,
  };
  companyShowToggle: boolean;
  currentShortcutLabel: string = null;
  currentShortcutSequence: string[] = [];
  companyInfoList: CaptureInfoResponse;
  company: {
    id: number;
    name: string;
  };
  attachmentList: TransactionFile[];
  transactionID: number;
  attachmentID: number;

  ngOnInit() {
    this.companyShowToggle = true;
    this.currentUser = this.userService.getCurrentUser();
    this.themeService.observeBackground().subscribe((result: string) => {
      if (result !== undefined) {
        this.currentBackground = `${environment.ApiBackgroundImages}/${result}`;
      }
    });
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.companyService.observeCompany().subscribe((data: SelectedCompany) => {
      this.company = {
        id: data.companyID,
        name: data.companyName
      };

      this.loadCaptureInfo();
    });

    this.transactionService.observerCurrentAttachment().subscribe (obj => {
      this.transactionID = obj.transactionID;
      this.attachmentID = obj.attachmentID;

      console.log(this.attachmentID);
      this.loadAttachments();
    });
  }

  goBack() {
    this.router.navigate(['transaction', 'attachments']);
  }

  showHelp() {
    this.openModal.nativeElement.click();
  }

  loadCaptureInfo() {
    const requestModel = {
      userID: this.userService.getCurrentUser().userID,
      companyID: this.company.id,
      doctypeID: 2,
      filter: '',
      orderBy: '',
      orderByDirection: 'ASC',
      rowStart: 1,
      rowEnd: 15,
      specificCaptureInfoID: -1
    };

    this.transactionService.captureInfo(requestModel).then(
      (res: CaptureInfoResponse) => {
        this.companyInfoList = res;
     },
      (msg) => {
      }
    );
  }

  loadAttachments() {
    const model = {
      filter: '',
      userID: this.currentUser.userID,
      specificTransactionID: this.transactionID,
      specificAttachmentID: -1,
      rowStart: 1,
      rowEnd: 25,
      orderBy: '',
      orderByDirection: ''
    };

    this.transactionService
      .listAttatchments(model)
      .then(
        (res: TransactionFileListResponse) => {
          console.log(res);
          this.attachmentList = res.attachments;
        },
        (msg) => {}
      );
  }


  /* Key Handler Directive Outputs */
  exitCaptureScreen() {
    this.router.navigate(['transaction', 'attachments']);
  }
  companyInfo() {
    this.companyShowToggle = !this.companyShowToggle;
  }
  PDFScrollDown() {
  }
  PDFScrollUp() {
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.keyCode === 190) {
      this.currentReaderPOS.y++;
      console.log(`New Reader pos: ${this.currentReaderPOS.y}`);
    }
  }

  currentShortcut($event: string) {
    if ($event === null || undefined) {
      this.flushCurrentShortcut();
    } else {
      if ($event === 'Control') {
          this.currentShortcutLabel = $event;
      } else if ($event === 'Alt') {
          this.currentShortcutLabel += ` + ${$event}`;
      } else if ($event === 'l') {
        this.currentShortcutLabel += ` + ${$event.toLocaleUpperCase()}`;
      }
    }
  }

  flushCurrentShortcut() {
    setTimeout(() => this.currentShortcutLabel = null, 2000);
  }

  previewCapture(src: string) {
    const dialogRef = this.dialog.open(CapturePreviewComponent, {
      data: { src },
      width: '380px',
      height: '512px;'
    });
  }
}
