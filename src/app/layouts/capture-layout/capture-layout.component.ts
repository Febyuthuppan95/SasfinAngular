import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ComponentFactoryResolver, OnDestroy } from '@angular/core';
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
import { ShortcutInput, AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss']
})
export class CaptureLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router,
              private transactionService: TransactionService,
              private companyService: CompanyService,
              private dialog: MatDialog) {}

  shortcuts: ShortcutInput[] = [];

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;

  private unsubscribe$ = new Subject<void>();

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
  showHelp: boolean = false;
  focusPDF: boolean = false;
  attachmentType: string;
  ngOnInit() {
    this.companyShowToggle = true;
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
    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: SelectedCompany) => {
      this.company = {
        id: data.companyID,
        name: data.companyName
      };
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe (obj => {
      this.transactionID = obj.transactionID;
      this.attachmentID = obj.attachmentID;
      this.attachmentType = obj.docType;
      this.loadAttachments();
      this.loadCaptureInfo();
    });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + i',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.companyInfo()
        },
        {
          key: 'alt + o',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.exitCaptureScreen()
        },
        {
          key: 'alt + h',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.showHelp = !this.showHelp
        },
        {
          key: 'alt + p',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.focusPDF = !this.focusPDF
        },
        {
          key: 'alt + down',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y + 15,
        },
        {
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y - 15,
          key: 'alt + up',
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  goBack() {
    this.router.navigate(['transaction', 'attachments']);
  }

  loadCaptureInfo() {
    let docTypeID = 1;

    switch (this.attachmentType) {
      case 'SAD500': {
        docTypeID = 3;
        break;
      }
      case 'Customs Release Notification': {
        docTypeID = 2;
        break;
      }
      case 'Import Clearing Instruction': {
        docTypeID = 4;
        break;
      }
    }

    const requestModel = {
      userID: this.userService.getCurrentUser().userID,
      companyID: this.company.id,
      doctypeID: docTypeID,
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

          res.attachments.forEach((attach) => {
            attach.statusID === 1 ? attach.tooltip = 'Pending Capture' : console.log() ;
            attach.statusID === 2 ? attach.tooltip = 'Awaiting Review' : console.log() ;
            attach.statusID === 3 ? attach.tooltip = 'Errors' : console.log() ;
            attach.statusID === 4 ? attach.tooltip = 'Captured Successful' : console.log() ;

            this.attachmentID === attach.attachmentID ? attach.tooltip = 'Current' : console.log() ;
          });

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

  previewCapture(src: string, id: number) {
    if (id !== this.attachmentID) {
      this.dialog.open(CapturePreviewComponent, {
        data: { src },
        width: '380px',
        height: '512px;'
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
