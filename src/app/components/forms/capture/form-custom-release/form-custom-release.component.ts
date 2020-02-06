import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { NotificationComponent } from '../../../notification/notification.component';
import { UserService } from 'src/app/services/user.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { CaptureService } from 'src/app/services/capture.service';
import { CRNGet } from 'src/app/models/HttpResponses/CRNGet';
import { KeyboardShortcutsComponent, ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { MatDialog } from '@angular/material';
import { CompanyService } from 'src/app/services/Company.Service';

@Component({
  selector: 'app-form-custom-release',
  templateUrl: './form-custom-release.component.html',
  styleUrls: ['./form-custom-release.component.scss']
})
export class FormCustomReleaseComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private themeService: ThemeService,
              private userService: UserService,
              private transactionService: TransactionService,
              private router: Router,
              private captureService: CaptureService,
              private eventService: EventService,
              private dialog: MatDialog,
              private companyService: CompanyService,
              private snackbarService: HelpSnackbar) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  shortcuts: ShortcutInput[] = [];


  currentUser = this.userService.getCurrentUser();
  attachmentID: number;

  currentTheme: string;
  form = {
    serialNo: {
      value: null,
      error: null,
    },
    LRN: {
      value: null,
      error: null,
    },
    importersCode: {
      value: null,
      error: null,
    },
    PCC: {
      value: null,
      error: null,
    },
    FOB: {
      value: null,
      error: null,
    },
    waybillNo: {
      value: null,
      error: null,
    },
    MRN: {
      value: null,
      error: null,
    },
  };

  attachmentSubscription: Subscription;
  dialogOpen = false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.submit());

    this.attachmentSubscription = this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;

        this.loadCapture();
      }
    });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + s',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              if (!this.dialogOpen) {
                this.dialogOpen = true;
                this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
                  this.dialogOpen = false;
                  if (status) {
                    this.submit();
                  }
                });
              }
            }
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  submit() {
          const requestModel = {
            userID: this.currentUser.userID,
            specificCustomsReleaseID: this.attachmentID,
            serialNo: this.form.serialNo.value,
            lrn: this.form.LRN.value,
            importersCode: this.form.importersCode.value,
            pcc: this.form.PCC.value,
            fob: this.form.FOB.value,
            waybillNo: this.form.waybillNo.value,
            mrn: this.form.MRN.value,
            isDeleted: 0,
            attachmentStatusID: 3,
          };

          this.transactionService.customsReleaseUpdate(requestModel).then(
            (res: Outcome) => {
              if (res.outcome === 'SUCCESS') {
                this.notify.successmsg(res.outcome, res.outcomeMessage);

                this.companyService.setCapture({ capturestate: true });
                this.router.navigateByUrl('transaction/capturerlanding');
              } else {
                this.notify.errorsmsg(res.outcome, res.outcomeMessage);
              }
            },
            (msg) => {
              this.notify.errorsmsg('Failure', 'Cannot reach server');
            }
          );
        }

  loadCapture() {
    this.captureService.customsReleaseGet({
      specificID: this.attachmentID,
      userID: 3
    }).then(
      (res: CRNGet) => {
        this.form.FOB.value = res.fob;
        this.form.FOB.error = res.fobError;
        this.form.MRN.value = res.mrn;
        this.form.MRN.error = res.mrnError;
        this.form.serialNo.value = res.serialNo;
        this.form.serialNo.error = res.serialNoError;
        this.form.importersCode.value = res.importersCode;
        this.form.importersCode.error = res.importersCodeError;
        this.form.waybillNo.value = res.waybillNo;
        this.form.waybillNo.error = res.waybillNoError;
        this.form.LRN.value = res.lrn;
        this.form.LRN.error = res.lrnError;
        this.form.PCC.value = res.pcc;
        this.form.PCC.error = res.pccError;
      },
      (msg) => {

      }
    );
  }
  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
