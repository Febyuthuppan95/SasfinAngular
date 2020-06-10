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
import { MatDialog, MatSnackBar } from '@angular/material';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { WaybillListResponse } from 'src/app/models/HttpResponses/Waybill';
import { CompanyService } from 'src/app/services/Company.Service';
import { FormControl, Validators } from '@angular/forms';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';


@Component({
  selector: 'app-form-waybill',
  templateUrl: './form-waybill.component.html',
  styleUrls: ['./form-waybill.component.scss']
})
export class FormWaybillComponent implements OnInit, AfterViewInit, OnDestroy {
  disabledwaybillNo: boolean;
  waybillNoOReason: string;

  constructor(private themeService: ThemeService, private userService: UserService,
              private transactionService: TransactionService, private snackbar: MatSnackBar,
              private router: Router, private captureService: CaptureService,
              private eventService: EventService, private dialog: MatDialog,
              private companyService: CompanyService, private objectHelpService: ObjectHelpService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  shortcuts: ShortcutInput[] = [];

  waybillNo = new FormControl(null, [Validators.required]);

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;
  help = true;
  currentTheme: string;
    form = {
      waybillNo: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
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
        this.loadData();
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
        {
            key: 'ctrl + alt + h',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
               this.toggelHelpBar();
            }
        }
    );
  }
  toggelHelpBar() {
    this.help = !this.help;
    this.objectHelpService.toggleHelp(this.help);
  }

  submit(escalation?: boolean) {
    if (this.waybillNo.valid || escalation) {
          const requestModel: WaybillUpdate = {
            userID: this.currentUser.userID,
            waybillID: this.attachmentID,
            waybillNo: this.form.waybillNo.value,
            isDeleted: 0,
            attachmentStatusID: 3,
          };

          this.captureService.waybillUpdate(requestModel).then(
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
          });
      } else {
        this.snackbar.open(`Please fill in the Waybill number`, '', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
  }

  loadData() {
    this.captureService.waybillList(
      {
        userID: this.currentUser.userID,
        waybillID: this.attachmentID,
        transactionID: this.transactionID,
        rowStart: 1,
        rowEnd: 15,
        orderBy: '',
        orderDirection: 'DESC',
        filter: ''

      }).then(
      (res: WaybillListResponse) => {
        this.form.waybillNo.value = res.waybills[0].waybillNo;

        this.form.waybillNo.OBit = res.waybills[0].waybillNoOBit;
        this.form.waybillNo.OUserID = res.waybills[0].waybillNoOUserID;
        this.form.waybillNo.ODate = res.waybills[0].waybillNoODate;
        this.form.waybillNo.OReason = res.waybills[0].waybillNoOReason;

        if (res.attachmentErrors.attachmentErrors.length > 0) {
          res.attachmentErrors.attachmentErrors.forEach(error => {
            if (error.fieldName === 'WaybillNo') {
              this.form.waybillNo.error = error.errorDescription;
            }
          });
        }
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  OverridewaybillNoClick() {
    this.form.waybillNo.OUserID = this.currentUser.userID;
    this.form.waybillNo.OBit = true;
    this.form.waybillNo.ODate = new Date();
    this.disabledwaybillNo = false;
    this.waybillNoOReason = '';
  }

  OverridewaybillNoExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledwaybillNo = true;
    console.log(this.form.waybillNo);
  }

  UndoOverridewaybillNo() {
    this.form.waybillNo.OUserID = null;
    this.form.waybillNo.OBit = null;
    this.form.waybillNo.ODate = null;
    this.form.waybillNo.OReason = null;
    this.waybillNoOReason = '';
    this.disabledwaybillNo = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

export class WaybillUpdate {
  userID: number;
  waybillID: number;
  waybillNo: string;
  attachmentStatusID: number;
  isDeleted?: number;
  waybillNoOBit?: boolean;
  waybillNoOUserID?: number;
  waybillNoODate?: string;
  waybillNoOReason?: string;
}
