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
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { CompanyService } from 'src/app/services/Company.Service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';

@Component({
  selector: 'app-form-import-clearing-instruction',
  templateUrl: './form-import-clearing-instruction.component.html',
  styleUrls: ['./form-import-clearing-instruction.component.scss']
})
export class FormImportClearingInstructionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService,
              private eventService: EventService, private dialog: MatDialog, private snackbar: MatSnackBar,
              private snackbarService: HelpSnackbar, private companyService: CompanyService,
              private objectHelpService: ObjectHelpService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  shortcuts: ShortcutInput[] = [];

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;
  iciOReason: string;
  waybillNoOReason: string;
  supplyRefOReason: string;
  disabledIC: boolean;
  disabledWay: boolean;
  disabledSupp: boolean;

  ICIForm = new FormGroup({
    control1: new FormControl(null, [Validators.required]),
    control1a: new FormControl(null),
    control2: new FormControl(null, [Validators.required]),
    control2a: new FormControl(null),
    control3: new FormControl(null, [Validators.required]),
    control3a: new FormControl(null),
    });

  currentTheme: string;
    form = {
      importersCode: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
      },
      waybillNo: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
      },
      supplierRef: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
  };
  help = true;
  dialogOpen = false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((escalation?: boolean) => this.submit(escalation));

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

  submit(escalation?:boolean) {
    if (this.ICIForm.valid || escalation) {
      const requestModel = {
        userID: this.currentUser.userID,
        specificICIID: this.attachmentID,
        waybillNo: this.form.waybillNo.value,
        importersCode: this.form.importersCode.value,
        supplierRef: this.form.supplierRef.value,
        isDeleted: 0,
        attachmentStatusID: escalation ? 7: 3,

        supplierRefOBit: this.form.supplierRef.OBit,
        supplierRefOUserID: this.form.supplierRef.OUserID,
        supplierRefODate: this.form.supplierRef.ODate,
        supplierRefOReason: this.form.supplierRef.OReason,

        importersCodeOBit: this.form.importersCode.OBit,
        importersCodeOUserID: this.form.importersCode.OUserID,
        importersCodeODate: this.form.importersCode.ODate,
        importersCodeOReason: this.form.importersCode.OReason,

        waybillNoOBit: this.form.waybillNo.OBit,
        waybillNoOUserID: this.form.waybillNo.OUserID,
        waybillNoODate: this.form.waybillNo.ODate,
        waybillNoOReason: this.form.waybillNo.OReason,
      };

      this.captureService.iciUpdate(requestModel).then(
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
          console.log(JSON.stringify(msg));
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
    } else {
      this.snackbar.open(`Please fill in the all the fields`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    }

  }

  loadICI() {
    const requestModel = {
      userID: this.currentUser.userID,
      specificICIID: this.attachmentID,
      transactionID: this.transactionID,
      rowStart: 1,
      rowEnd: 15,
      orderBy: '',
      orderDirection: 'DESC',
      filter: ''
    };
    this.captureService.iciList(requestModel).then(
      (res: ICIListResponse) => {
        if (res.clearingInstructions.length > 0) {
          this.form.waybillNo.value = res.clearingInstructions[0].waybillNo;
          this.form.supplierRef.value = res.clearingInstructions[0].supplierRef;
          this.form.importersCode.value = res.clearingInstructions[0].importersCode;

          this.form.supplierRef.OBit = res.clearingInstructions[0].supplierRefOBit;
          this.form.supplierRef.OUserID = res.clearingInstructions[0].supplierRefOUserID;
          this.form.supplierRef.ODate = res.clearingInstructions[0].supplierRefODate;
          this.form.supplierRef.OReason = res.clearingInstructions[0].supplierRefOReason;

          this.form.importersCode.OBit = res.clearingInstructions[0].importersCodeOBit;
          this.form.importersCode.OUserID = res.clearingInstructions[0].importersCodeOUserID;
          this.form.importersCode.ODate = res.clearingInstructions[0].importersCodeODate;
          this.form.importersCode.OReason = res.clearingInstructions[0].importersCodeOReason;

          this.form.waybillNo.OBit = res.clearingInstructions[0].waybillNoOBit;
          this.form.waybillNo.OUserID = res.clearingInstructions[0].waybillNoOUserID;
          this.form.waybillNo.ODate = res.clearingInstructions[0].waybillNoODate;
          this.form.waybillNo.OReason = res.clearingInstructions[0].waybillNoOReason;

          if (res.attachmentErrors.attachmentErrors.length > 0) {
            res.attachmentErrors.attachmentErrors.forEach(error => {
              if (error.fieldName === 'ImporterCode') {
                this.form.importersCode.error = error.errorDescription;
              } else if (error.fieldName === 'WaybillNo') {
                this.form.waybillNo.error = error.errorDescription;
              } else if (error.fieldName === 'SupplierRef') {
                this.form.supplierRef.error = error.errorDescription;
              }
            });
        }
      }
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  OverrideImportersCodeClick() {
    this.form.importersCode.OUserID = this.currentUser.userID;
    this.form.importersCode.OBit = true;
    this.form.importersCode.ODate = new Date();
    this.disabledIC = false;
    this.iciOReason = '';
  }

  OverrideImportersExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledIC = true;
    console.log(this.form.importersCode);
  }

  UndoOverrideImporters() {
    this.form.importersCode.OUserID = null;
    this.form.importersCode.OBit = null;
    this.form.importersCode.ODate = null;
    this.form.importersCode.OReason = null;
    this.iciOReason = '';
    this.disabledIC = false;
  }

  OverrideWaybillClick() {
    this.form.waybillNo.OUserID = this.currentUser.userID;
    this.form.waybillNo.OBit = true;
    this.form.waybillNo.ODate = new Date();
    this.disabledWay = false;
    this.waybillNoOReason = '';
  }

  OverrideWaybillExcept() {
    this.disabledWay = true;
  }

  UndoOverrideWaybill() {
    this.form.waybillNo.OUserID = null;
    this.form.waybillNo.OBit = null;
    this.form.waybillNo.ODate = null;
    this.form.waybillNo.OReason = null;
    this.waybillNoOReason = '';
    this.disabledWay = false;
  }

  OverrideSupplyRefClick() {
    this.form.supplierRef.OUserID = this.currentUser.userID;
    this.form.supplierRef.OBit = true;
    this.form.supplierRef.ODate = new Date();
    this.disabledSupp = false;
    this.supplyRefOReason = '';
  }

  OverrideSupplyRefExcept() {
    this.disabledSupp = true;
  }

  UndoOverrideSupplyRef() {
    this.form.supplierRef.OUserID = null;
    this.form.supplierRef.OBit = null;
    this.form.supplierRef.ODate = null;
    this.form.supplierRef.OReason = null;
    this.supplyRefOReason = '';
    this.disabledSupp = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

export class ICIUpdate {
  userID: number;
  iciID: number;
  waybillNo: string;
  supplierRef: string;
  importersCode: string;
  attachmentStatusID: number;
  isDeleted?: number;
  supplierRefOBit?: boolean;
  supplierRefOUserID?: number;
  supplierRefODate?: string;
  supplierRefOReason?: string;
  importersCodeOBit?: boolean;
  importersCodeOUserID?: number;
  importersCodeODate?: string;
  importersCodeOReason?: string;
  waybillNoOBit?: boolean;
  waybillNoOUserID?: number;
  waybillNoODate?: string;
  waybillNoOReason?: string;
}
