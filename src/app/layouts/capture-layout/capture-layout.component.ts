import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss']
})
export class CaptureLayoutComponent implements OnInit, AfterViewInit {

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

  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

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
      this.loadAttachments();
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
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
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
}
