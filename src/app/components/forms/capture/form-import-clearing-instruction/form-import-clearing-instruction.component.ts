import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@Component({
  selector: 'app-form-import-clearing-instruction',
  templateUrl: './form-import-clearing-instruction.component.html',
  styleUrls: ['./form-import-clearing-instruction.component.scss']
})
export class FormImportClearingInstructionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService,
              private eventService: EventService, private dialog: MatDialog,
              private snackbarService: HelpSnackbar) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  shortcuts: ShortcutInput[] = [];

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;

  currentTheme: string;
  form = {
  importersCode: {
  value: null,
  error: null,
  },
  waybillNo: {
  value: null,
  error: null
  },
  supplierRef: {
  value: null,
  error: null,
  },
  };

  dialogOpen = false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.submit());

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
        this.transactionID = curr.transactionID;
        this.loadICI();
      }
    });
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
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
  }

  submit() {
          const requestModel = {
            userID: this.currentUser.userID,
            specificICIID: this.attachmentID,
            waybillNo: this.form.waybillNo.value,
            importersCode: this.form.importersCode.value,
            supplierRef: this.form.supplierRef.value,
            isDeleted: 0,
            attachmentStatus: 2,
          };

          this.captureService.iciUpdate(requestModel).then(
            (res: Outcome) => {
              if (res.outcome === 'SUCCESS') {
              this.notify.successmsg(res.outcome, res.outcomeMessage);
              this.router.navigate(['transaction/attachment']);
              } else {
              this.notify.errorsmsg(res.outcome, res.outcomeMessage);
              }
            },
              (msg) => {
              this.notify.errorsmsg('Failure', 'Cannot reach server');
              }
            );

  }

  loadICI() {
    this.captureService.iciList(
      {
        userID: this.currentUser.userID,
        specificICIID: this.attachmentID,
        transactionID: this.transactionID,
        rowStart: 1,
        rowEnd: 15,
        orderBy: '',
        orderDirection: 'DESC',
        filter: ''

      }).then(
      (res: ICIListResponse) => {
        console.log(res);
        this.form.waybillNo.value = res.clearingInstructions[0].waybillNo;
        this.form.waybillNo.error = res.clearingInstructions[0].waybillNoError;
        this.form.supplierRef.value = res.clearingInstructions[0].supplierRef;
        this.form.supplierRef.error = res.clearingInstructions[0].supplierRefError;
        this.form.importersCode.value = res.clearingInstructions[0].importersCode;
        this.form.importersCode.error = res.clearingInstructions[0].importersCodeError;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
