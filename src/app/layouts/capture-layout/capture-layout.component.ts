import { ChatIssueCreateReponse } from './../../modules/chat/models/responses';
import { ChatConversationIssue } from './../../modules/chat/models/requests';
import { ChatService } from './../../modules/chat/services/chat.service';

import { ChannelService } from 'src/app/modules/chat/services/channel.service';
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
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CapturePreviewComponent } from './capture-preview/capture-preview.component';
import { EscalateDialogComponent } from './escalate-dialog/escalate-dialog.component';
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
import { CaptureAttachmentResponse, CaptureAttachment } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-capture-layout',
  templateUrl: './capture-layout.component.html',
  styleUrls: ['./capture-layout.component.scss']
})
export class CaptureLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService,
              private userService: UserService,
              private router: Router,
              private docService: DocumentService,
              private userIdle: UserIdleService,
              private transactionService: TransactionService,
              private companyService: CompanyService,
              private dialog: MatDialog,
              private snackbarService: HelpSnackbar,
              private eventService: EventService,
              private channelService: ChannelService,
              private chatService: ChatService,
              private snackBarMat: MatSnackBar) {}

  shortcuts: ShortcutInput[] = [];
  showChat = false;
  inspectingPreview = false;
  showDocks = true;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

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
  attachmentListShowing: TransactionFile[] = [];
  transactionID: number;
  attachmentID: number;
  showHelp = false;
  focusPDF = false;
  attachmentType: string;
  helpValue = false;


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

  ngOnInit() {
    // this.companyService.setCapture({ capturestate: true});
    this.companyShowToggle = false;
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
      console.log(obj);
      this.transactionID = obj.transactionID;
      this.attachmentID = obj.attachmentID;
      this.attachmentType = obj.docType;
      this.loadCaptureInfo();
    });

    // get the help value
    // this.helpValue  = this.themeService.observeHelpValue();

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

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + i',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.companyInfo()
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
          key: 'alt + down',
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
          key: 'alt + up',
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  goBack() {
    this.router.navigate(['transaction/attachments']);
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
        console.log(this.companyInfoList);
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

  // loadAttachments() {
  //   const model = {
  //     filter: '',
  //     userID: this.currentUser.userID,
  //     specificTransactionID: this.transactionID,
  //     specificAttachmentID: -1,
  //     rowStart: 1,
  //     rowEnd: 25,
  //     orderBy: '',
  //     orderByDirection: ''
  //   };

  //   this.transactionService
  //     .listAttatchments(model)
  //     .then(
  //       (res: TransactionFileListResponse) => {
  //         this.attachmentList = res.attachments;
  //         const current = this.attachmentList.find(x => x.attachmentID === this.attachmentID);
  //         this.attachmentList = this.attachmentList.filter(x => x.attachmentID !== this.attachmentID);

  //         this.attachmentListShowing.push(current);

  //         this.attachmentList.forEach((item, i) => {
  //           if (i < 4) {
  //             this.attachmentListShowing.push(item);
  //           }
  //         });

  //         this.attachmentListShowing.forEach((attach) => {
  //           if (attach !== undefined) {
  //             attach.statusID === 1 ? attach.tooltip = 'Pending Capture' : console.log() ;
  //             attach.statusID === 2 ? attach.tooltip = 'Awaiting Review' : console.log() ;
  //             attach.statusID === 3 ? attach.tooltip = 'Errors' : console.log() ;
  //             attach.statusID === 4 ? attach.tooltip = 'Captured Successful' : console.log() ;

  //             this.attachmentID === attach.attachmentID ? attach.tooltip = 'Current' : console.log() ;
  //           }
  //         });
  //       },
  //       (msg) => {}
  //     );
  // }
  toggelEscalate() {
    // Modal toggle
    const escalateDialog = this.dialog.open(EscalateDialogComponent);
    escalateDialog.afterClosed().subscribe(result => {
      this.escalate(result);
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
        console.log(res);
        if (res.issueID > 0) {
          this.companyService.setCapture({ capturestate: false});
          this.router.navigate(['transaction/capturerlanding']);
        } else {
          this.snackBarMat.open(res.outcome.outcomeMessage, '', {
            duration: 2000
           });
        }
      },
      (msg) => {
        this.snackBarMat.open(msg, '', {
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
  PDFScrollDown() {
  }
  PDFScrollUp() {
  }

  previewCapture(src: string, id: number) {
    if (id !== this.attachmentID && this.openPreview) {
      this.inspectingPreview = false;
      this.openPreview = false;

      const previewDialog = this.dialog.open(CapturePreviewComponent, {
        data: { src },
        width: '50%',
        height: '80%'
      });

      previewDialog.afterClosed().subscribe(() => {
        this.inspectingPreview = false;
        this.openPreview = true;
      });

    }
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
  }

  submitCapture() {

    if (!this.dialogOpen) {
      this.dialogOpen = true;

      this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
        this.dialogOpen = false;

        if (status) {
          this.eventService.triggerCaptureEvent();
         }
      });
    }
  }
  //   if (!this.dialogOpen) {
  //     this.dialogOpen = true;

  //     this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
  //       this.dialogOpen = false;

  //       if (status) {
  //         this.eventService.triggerCaptureEvent();
  //       }
  //     });
  //   }
  // }

  toggleChat() {
    this.showChat = !this.showChat;
  }
}
