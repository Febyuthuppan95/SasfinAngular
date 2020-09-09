import { EscalateBottomSheetComponent } from './escalate-bottom-sheet/escalate-bottom-sheet.component';
import { Outcome } from './../../models/HttpResponses/DoctypeResponse';
import { ChatIssueCreateReponse } from './../../modules/chat/models/responses';
import { ChatConversationIssue } from './../../modules/chat/models/requests';
import { ChatService } from './../../modules/chat/services/chat.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { UserService } from 'src/app/services/user.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureInfoResponse } from 'src/app/models/HttpResponses/ListCaptureInfo';
import { TransactionFileListResponse, TransactionFile } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { CapturePreviewComponent } from './capture-preview/capture-preview.component';
import { ShortcutInput, AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserIdleService } from 'angular-user-idle';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { AttachmentDialogComponent } from './attachment-dialog/attachment-dialog.component';
import { EventService } from 'src/app/services/event.service';
import { QuitDialogComponent } from './quit-dialog/quit-dialog.component';
import { SubmitDialogComponent } from './submit-dialog/submit-dialog.component';
import { CaptureAttachment } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';
import { DocumentService } from 'src/app/services/Document.Service';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';
import { ApiService } from 'src/app/services/api.service';
import { ListReadResponse } from 'src/app/components/forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EscalateDialogComponent } from './escalate-dialog/escalate-dialog.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss'],
})
export class CaptureLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private apiService: ApiService,
              private router: Router,
              private userIdle: UserIdleService,
              private transactionService: TransactionService,
              private companyService: CompanyService,
              private dialog: MatDialog,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private snackBarMat: MatSnackBar,
              private escalationReason: MatBottomSheet,
              private objectHelpService: ObjectHelpService,
              private event: EventService) {}

  shortcuts: ShortcutInput[] = [];
  showChat = false;
  inspectingPreview = false;
  showDocks = true;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  @ViewChild(SnackBarComponent, { static: true })
  private snackBar: SnackBarComponent;
  @ViewChild('closetimeoutModal', {static: true })
  closetimeoutModal: ElementRef;

  @ViewChild('opentimeoutModal', {static: true })
  opentimeoutModal: ElementRef;

  @ViewChild(KeyboardShortcutsComponent, { static: true })
  private keyboard: KeyboardShortcutsComponent;



  private unsubscribe$ = new Subject<void>();

  count = 0;
  currentBackground: string;
  currentTheme: string;
  currentUser: User;
  currentReaderPOS: { x: number, y: number } = {
    x: 0,
    y: 64,
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
  attachmentListShowing: TransactionFile[] = [];
  transactionID: number;
  attachmentID: number;
  transactionType: string;
  showHelp = false;
  focusPDF = false;
  attachmentType: string;
  helpValue = false;
  escalated = false;
  specialMouse = true;
  transactionTypes: AttachmentType[] = [];

  CaptureInfo: CaptureAttachment;
  docPath: string;
  fileType: string;
  fileTypeID: number;
  companyID: number;
  companyName: string;

  dialogAttachments: MatDialogRef<AttachmentDialogComponent>;

  openMore = true;
  openPreview = true;
  dialogOpen = false;
  noCaptureInformation = true;
  reason = '';

  bottomSheet;

  PDFSource: any;

  captureData: any;
  currentDoctype: string;
  cursor = -1;

  ngOnInit() {
    this.objectHelpService.toggleHelp(true);
    this.companyShowToggle = true;
    this.currentUser = this.userService.getCurrentUser();
    this.event.mouseChange.next(this.cursor);

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
      if (data !== null) {
        this.company = {
          id: data.companyID,
          name: data.companyName
        };
      }
    });

    this.themeService.setToggleValue(true);
    // this.transactionService.observerCurrentAttachment()
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe (obj => {
    //   this.transactionID = obj.transactionID;
    //   this.attachmentID = obj.attachmentID;
    //   this.attachmentType = obj.docType;
    //   this.transactionType = obj.transactionType;
    //   this.reason = `${obj.reason}`;
    //   this.escalated = obj.issueID > 0 ? true : false;
    //   this.initTypes();
    //   this.loadAttachments();
    // });

    this.route.params.subscribe((param) => {
      if (param) {
        console.log(param);
        if (param.source) {
          this.PDFSource = param.source;
        }

        if (param.attachmentID) {
          this.transactionID = +atob(param.transactionID);
          this.attachmentID = +atob(param.attachmentID);
          this.attachmentType = atob(param.attachmentType);
          this.transactionType = atob(param.transactionType);
          this.reason = `${atob(param.reason)}`;
          this.escalated = +atob(param.escalated) > 0 ? true : false;
          this.initTypes();
          this.loadAttachments();

          this.captureData = {
            attachmentID: +atob(param.attachmentID),
            transactionType: atob(param.transactionType),
            docType: atob(param.attachmentType),
            transactionID: +atob(param.transactionID),
          };

          this.currentDoctype = atob(param.attachmentType);
        }
      }
    });
  }

  toggleReason(): void {
    const reason: string = this.reason;

    this.bottomSheet = this.escalationReason.open(EscalateBottomSheetComponent, {
      data: reason
    });
  }

  closeHelpContext() {
    const newContext: SnackbarModel = {
      display: false,
      slug: '',
    };
    this.snackbarService.setHelpContext(newContext);
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
          key: 'alt + b',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (this.cursor === -1) {
              this.cursor = 2;
            } else {
              this.cursor = -1;
            }

            this.event.mouseChange.next(this.cursor);
          }
      },
        {
          key: 'alt + d',
          preventDefault: true,
          allowIn: [AllowIn.Input, AllowIn.Textarea],
          command: e => this.submitCapture(
            false,
            true,
            false,
            'Save Progress',
            'The entered data will be stored, but not submitted for assessment')
        },
        {
          key: 'alt + w',
          preventDefault: true,
          allowIn: [AllowIn.Input, AllowIn.Textarea],
          command: e => this.toggelEscalate()
        },
        {
          key: 'alt + q',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.exitCaptureScreen()
        },
        {
          key: 'alt + o',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.showDocks = !this.showDocks
        },
        {
          key: 'alt + h',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.showHelp = !this.showHelp
        },
        {
          key: 'alt + 2',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y + 15,
        },
        {
          key: 'alt + [',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y + 15,
        },
        {
          key: 'alt + p',
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => {
            if (this.openMore) {
              this.moreAttachments();
            } else {
              this.dialogAttachments.close();
              this.dialogAttachments = null;
            }
          }
        },
        {
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y - 15,
          key: 'alt + 8',
        },
        {
          preventDefault: true,
          allowIn: [AllowIn.Textarea, AllowIn.Input],
          command: e => this.currentReaderPOS.y = this.currentReaderPOS.y - 15,
          key: 'alt + ]',
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  goBack() {
    this.router.navigate(['transaction/attachments']);
  }
  initTypes() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        transactionID: this.transactionID
      },
      requestProcedure: 'DoctypesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        res.data.forEach(x => {
          this.transactionTypes.push({
            name: x.Name,
            description: x.Description,
            value: x.FileTypeID
          })
        });

        this.loadCaptureInfo();
      }
    );
  }

  loadCaptureInfo() {
    const docs = this.transactionTypes.find(x => x.name === this.attachmentType);
    let docTypeID = -1;
    if (docs) {
       docTypeID = docs.value;
    }
    const requestModel = {
      userID: this.userService.getCurrentUser().userID,
      companyID: this.company ? this.company.id : -1,
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
        if (this.companyInfoList.captureInfo.length > 0) {
          this.noCaptureInformation = false;
        }
     },
      (msg) => {
      }
    );
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

  fileIsMissing() {
    const model: ChatConversationIssue = {
      transactionID: this.transactionID,
      userID: this.currentUser.userID,
      reason: 'File is missing on attachment',
      fileType: this.attachmentType,
      documentID: this.attachmentID
    };

    this.chatService.createIssue(model).then(
      (res: ChatIssueCreateReponse) => {
        if (res.outcome.outcome === 'SUCCESS' || res.outcome.outcome === 'Success') {
          this.submitCapture(true, false, false, 'File Missing', 'This attachment will flagged');
        } else {
          this.snackBarMat.open(res.outcome.outcomeMessage, '', {
            duration: 2000
           });
        }
      },
      (msg: Outcome) => {
        this.snackBarMat.open('An Error occurred while flagging attachment', '', {
          duration: 2000
         });
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
          this.attachmentList = res.attachments;
          this.attachmentListShowing = [];
          const current = this.attachmentList.find(x => x.attachmentID === this.attachmentID);
          this.attachmentList = this.attachmentList.filter(x => x.attachmentID !== this.attachmentID);

          this.attachmentListShowing.push(current);
          const length = this.attachmentList.length > 4 ? 4 : this.attachmentList.length;

          console.log(this.attachmentList);

          for (let i = 0; i < length; i++) {
            this.attachmentListShowing.push(this.attachmentList[i]);
          }

          this.attachmentListShowing.forEach((attach) => {
            if (attach !== undefined) {
              attach.statusID === 1 ? attach.tooltip = 'Pending Capture' : console.log() ;
              attach.statusID === 2 ? attach.tooltip = 'In Capture' : console.log() ;
              attach.statusID === 3 ? attach.tooltip = 'Capture not Evaluated' : console.log() ;
              attach.statusID === 4 ? attach.tooltip = 'In Evaluation' : console.log() ;
              attach.statusID === 5 ? attach.tooltip = 'Assess Succeeded' : console.log() ;
              attach.statusID === 6 ? attach.tooltip = 'Assess Failed' : console.log() ;
              attach.statusID === 7 ? attach.tooltip = 'Escalated' : console.log() ;
              attach.statusID === 8 ? attach.tooltip = 'Escalation Resolved' : console.log() ;
              attach.statusID === 9 ? attach.tooltip = 'Override Capture' : console.log() ;

              this.attachmentID === attach.attachmentID ? attach.tooltip += ' - Current' : console.log() ;
            }
          });
        });
  }

  toggelEscalate() {
    // Modal toggle
    const escalateDialog = this.dialog.open(EscalateDialogComponent, { width: '512px' });
    escalateDialog.afterClosed().subscribe(result => {
      if (result) {
        this.escalate(result);
      }
    });
  }

  escalate(userReason: string) {
    const model: ChatConversationIssue = {
      transactionID: this.transactionID,
      userID: this.currentUser.userID,
      reason: userReason,
      fileType: this.attachmentType,
      documentID: this.attachmentID
    };

    this.chatService.createIssue(model).then(
      (res: ChatIssueCreateReponse) => {
        if (res.outcome.outcome === 'SUCCESS' || res.outcome.outcome === 'Success') {
          // this.companyService.setCapture({ capturestate: false});
          this.submitCapture(true, false, false, 'Escalation', 'This attachment will be escalated');
        } else {
          this.snackBarMat.open(res.outcome.outcomeMessage, '', {
            duration: 2000
           });
        }
      },
      (msg: Outcome) => {
        this.snackBarMat.open('An Error occurred while escalating', '', {
          duration: 2000
         });
      }
    );
    // service
  }
  /* Key Handler Directive Outputs */
  exitCaptureScreen() {
    this.dialog.open(QuitDialogComponent).afterClosed().subscribe((status: boolean) => {
      if (status) {
        this.companyService.setCapture({ capturestate: false});
        this.router.navigate(['transaction/capturerlanding']);
      }
    });
  }
  companyInfo() {
    this.companyShowToggle = !this.companyShowToggle;
  }

  previewCapture(src: string, id: number) {
    const myWindow = window.open(
      `${environment.appRoute}/documentpreview/${btoa(src)}`,
      '_blank',
      'width=600, height=800, noreferrer'
    );

    myWindow.opener = null;
  }

  moreAttachments() {
      if (this.openMore && this.openPreview) {
        this.openMore = false;

        this.dialogAttachments = this.dialog.open(AttachmentDialogComponent, {
          data: this.attachmentList,
        });

        this.dialogAttachments.afterClosed().subscribe((obj: TransactionFile) => {
          this.openMore = true;
          this.dialogAttachments = null;

          if (obj !== undefined) {
            this.previewCapture(obj.file, obj.attachmentID);
          }
        });
      }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.themeService.toggleHelp();

    if (this.bottomSheet) {
      try {
        this.bottomSheet.dismiss();
      } catch {
        // Nothing required
      }
    }

    setTimeout(() => this.specialMouse = false);
  }

  submitCapture(isEscalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean, title?: string, desc?: string) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogConf = new MatDialogConfig();
      dialogConf.autoFocus = true;
      this.dialog.open(SubmitDialogComponent, {
        data: {
          title, desc
        }
      }).afterClosed().subscribe((status: boolean) => {
        this.dialogOpen = false;

        if (status) {
          this.eventService.triggerCaptureEvent(isEscalation, saveProgress, escalationResolved);
        }
      });
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }
}


export class HttpError {
  status: string;
  ok: boolean;
  error: object;
}
export class AttachmentType {
  name: string;
  description: string;
  value: number;

}
