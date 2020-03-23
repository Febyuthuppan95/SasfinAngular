import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { CRNGet, CRNList } from 'src/app/models/HttpResponses/CRNGet';
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
  disabledserialNo: boolean;
  serialNoOReason: string;
  disabledLRN: boolean;
  LRNOReason: string;
  disabledimportersCode: boolean;
  importersCodeOReason: string;
  pccOReason: string;
  disabledpcc: boolean;
  disabledFOB: boolean;
  FOBOReason: string;
  disabledwaybillNo: boolean;
  waybillNoOReason: string;
  disabledfileRef: boolean;
  fileRefOReason: string;
  disabledtotalCustomsValue: boolean;
  totalCustomsValueOReason: string;
  disabledtotalDuty: boolean;
  totalDutyOReason: string;
  disabledMRN: boolean;
  MRNOReason: string;
  constructor(private themeService: ThemeService,
              private userService: UserService,
              private transactionService: TransactionService,
              private router: Router,
              private captureService: CaptureService,
              private eventService: EventService,
              private dialog: MatDialog,
              private companyService: CompanyService,
              private snackbarService: HelpSnackbar,
              private formBuilder: FormBuilder) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();

  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  shortcuts: ShortcutInput[] = [];


  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;
  currentTheme: string;
  formValid: FormGroup;

  form = {
    serialNo: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    LRN: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    importersCode: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    PCC: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    FOB: {
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
    MRN: {
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
    totalCustomsValue: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    totalDuty: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    fileRef: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    },
    boe: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    }
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
        this.transactionID = curr.transactionID;
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
  buildForm() {
    this.formValid = this.formBuilder.group({
      serialNo: [this.form.serialNo, { validators: [Validators.required], updateOn: 'blur'}],
      LRN: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      importersCode: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      PCC: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      FOB: {
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
      MRN: {
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
      totalCustomsValue: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      totalDuty: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      fileRef: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      },
      boe: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      }
    });
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
            boe: this.form.boe.value,
            fileRef: this.form.fileRef.value,
            totalCustomsValue: this.form.totalCustomsValue.value,
            totalDuty: this.form.totalDuty.value,
            supplierRef: this.form.supplierRef.value,
            ediStatusID: 1,
            isDeleted: 0,
            attachmentStatusID: 3,

            serialNoOBit: this.form.serialNo.OBit,
            serialNoOUserID: this.form.serialNo.OUserID,
            serialNoODate: this.form.serialNo.ODate,
            serialNoOReason: this.form.serialNo.OReason,

            lrnOBit: this.form.LRN.OBit,
            lrnOUserID: this.form.LRN.OUserID,
            lrnODate: this.form.LRN.ODate,
            lrnOReason: this.form.LRN.OReason,

            importersCodeOBit: this.form.importersCode.OBit,
            importersCodeOUserID: this.form.importersCode.OUserID,
            importersCodeODate: this.form.importersCode.ODate,
            importersCodeOReason: this.form.importersCode.OReason,

            pccOBit: this.form.PCC.OBit,
            pccOUserID: this.form.PCC.OUserID,
            pccCODate: this.form.PCC.ODate,
            pccOReason: this.form.PCC.OReason,

            fobOBit: this.form.FOB.OBit,
            fobOUserID: this.form.FOB.OUserID,
            fobODate: this.form.FOB.ODate,
            fobOReason: this.form.FOB.OReason,

            waybillNoOBit: this.form.waybillNo.OBit,
            waybillNoOUserID: this.form.waybillNo.OUserID,
            waybillNoODate: this.form.waybillNo.ODate,
            waybillNoOReason: this.form.waybillNo.OReason,

            fileRefOBit: this.form.fileRef.OBit,
            fileRefOUserID: this.form.fileRef.OUserID,
            fileRefODate: this.form.fileRef.ODate,
            fileRefOReason: this.form.fileRef.OReason,

            totalCustomsValueOBit: this.form.totalCustomsValue.OBit,
            totalCustomsValueOUserID: this.form.totalCustomsValue.OUserID,
            totalCustomsValueODate: this.form.totalCustomsValue.ODate,
            totalCustomsValueOReason: this.form.totalCustomsValue.OReason,

            totalDutyOBit: this.form.totalDuty.OBit,
            totalDutyOUserID: this.form.totalDuty.OUserID,
            totalDutyODate: this.form.totalDuty.ODate,
            totalDutyOReason: this.form.totalDuty.OReason,

            mrnOBit: this.form.MRN.OBit,
            mrnOUserID: this.form.MRN.OUserID,
            mrnODate: this.form.MRN.ODate,
            mrnOReason: this.form.MRN.OReason
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
    const requst = {
      crnID: this.attachmentID,
      userID: this.currentUser.userID,
      transactionID: this.transactionID,
      rowStart: 1,
      rowEnd: 15,
      filter: '',
      orderBy: '',
      orderByDirection: '',
    };

    this.captureService.customsReleaseGet(requst).then(
      (res: CRNList) => {
        this.form.FOB.value = res.customs[0].fob;
        this.form.MRN.value = res.customs[0].mrn;
        this.form.serialNo.value = res.customs[0].serialNo;
        this.form.importersCode.value = res.customs[0].importersCode;
        this.form.waybillNo.value = res.customs[0].waybillNo;
        this.form.LRN.value = res.customs[0].lrn;
        this.form.PCC.value = res.customs[0].pcc;
        this.form.supplierRef.value = res.customs[0].supplierRef;
        this.form.totalDuty.value = res.customs[0].totalDuty;
        this.form.totalCustomsValue.value = res.customs[0].totalCustomsValue;
        this.form.fileRef.value = res.customs[0].fileRef;

        this.form.serialNo.OBit  = res.customs[0].serialNoOBit;
        this.form.serialNo.OUserID  = res.customs[0].serialNoOUserID;
        this.form.serialNo.ODate  = res.customs[0].serialNoODate;
        this.form.serialNo.OReason  = res.customs[0].serialNoOReason;

        this.form.LRN.OBit  = res.customs[0].lrnOBit;
        this.form.LRN.OUserID  = res.customs[0].lrnOUserID;
        this.form.LRN.ODate  = res.customs[0].lrnODate;
        this.form.LRN.OReason  = res.customs[0].lrnOReason;

        this.form.importersCode.OBit  = res.customs[0].importersCodeOBit;
        this.form.importersCode.OUserID  = res.customs[0].importersCodeOUserID;
        this.form.importersCode.ODate  = res.customs[0].importersCodeODate;
        this.form.importersCode.OReason  = res.customs[0].importersCodeOReason;

        this.form.PCC.OBit  = res.customs[0].pccOBit;
        this.form.PCC.OUserID  = res.customs[0].pccOUserID;
        this.form.PCC.ODate  = res.customs[0].pccODate;
        this.form.PCC.OReason  = res.customs[0].pccOReason;

        this.form.FOB.OBit  = res.customs[0].fobOBit;
        this.form.FOB.OUserID  = res.customs[0].fobOUserID;
        this.form.FOB.ODate  = res.customs[0].fobODate;
        this.form.FOB.OReason  = res.customs[0].fobOReason;

        this.form.waybillNo.OBit  = res.customs[0].waybillNoOBit;
        this.form.waybillNo.OUserID  = res.customs[0].waybillNoOUserID;
        this.form.waybillNo.ODate  = res.customs[0].waybillNoODate;
        this.form.waybillNo.OReason  = res.customs[0].waybillNoOReason;

        this.form.fileRef.OBit  = res.customs[0].fileRefOBit;
        this.form.fileRef.OUserID  = res.customs[0].fileRefOUserID;
        this.form.fileRef.ODate  = res.customs[0].fileRefODate;
        this.form.fileRef.OReason  = res.customs[0].fileRefOReason;

        this.form.totalCustomsValue.OBit  = res.customs[0].totalCustomsValueOBit;
        this.form.totalCustomsValue.OUserID  = res.customs[0].totalCustomsValueOUserID;
        this.form.totalCustomsValue.ODate  = res.customs[0].totalCustomsValueODate;
        this.form.totalCustomsValue.OReason  = res.customs[0].totalCustomsValueOReason;

        this.form.totalDuty.OBit  = res.customs[0].totalDutyOBit;
        this.form.totalDuty.OUserID  = res.customs[0].totalDutyOUserID;
        this.form.totalDuty.ODate  = res.customs[0].totalDutyODate;
        this.form.totalDuty.OReason  = res.customs[0].totalDutyOReason;

        this.form.MRN.OBit  = res.customs[0].mrnOBit;
        this.form.MRN.OUserID  = res.customs[0].mrnOUserID;
        this.form.MRN.ODate  = res.customs[0].mrnODate;
        this.form.MRN.OReason  = res.customs[0].mrnOReason;

        if (res.attachmentErrors.attachmentErrors.length > 0) {
          res.attachmentErrors.attachmentErrors.forEach(error => {
              if (error.fieldName === 'Country Of Orgin') {
                  this.form.serialNo.error = error.errorDescription;
              } else if (error.fieldName === 'Tariff') {
                  this.form.LRN.error = error.errorDescription;
              } else if (error.fieldName === 'Quantity') {
                  this.form.importersCode.error = error.errorDescription;
              } else if (error.fieldName === 'Foreign Inv') {
                  this.form.PCC.error = error.errorDescription;
              } else if (error.fieldName === 'Customs Value') {
                  this.form.FOB.error = error.errorDescription;
              } else if (error.fieldName === 'Duty') {
                  this.form.waybillNo.error = error.errorDescription;
              } else if (error.fieldName === 'Common Factor') {
                  this.form.fileRef.error = error.errorDescription;
              } else if (error.fieldName === 'InvoiceNo') {
                  this.form.totalCustomsValue.error = error.errorDescription;
              } else if (error.fieldName === 'Product Code') {
                  this.form.totalDuty.error = error.errorDescription;
              } else if (error.fieldName === 'VAT') {
                  this.form.MRN.error = error.errorDescription;
              }
          });
      }
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

  OverrideSerialNoClick() {
    this.form.serialNo.OUserID = this.currentUser.userID;
    this.form.serialNo.OBit = true;
    this.form.serialNo.ODate = new Date();
    this.disabledserialNo = false;
    this.serialNoOReason = '';
  }

  OverrideSerialNoExcept() {
    // this.form.importersCode.OReason = reason;
    this.disabledserialNo = true;
    console.log(this.form.serialNo);
  }

  UndoOverrideSerialNo() {
    this.form.serialNo.OUserID = null;
    this.form.serialNo.OBit = null;
    this.form.serialNo.ODate = null;
    this.form.serialNo.OReason = null;
    this.serialNoOReason = '';
    this.disabledserialNo = false;
  }

  OverrideLRNClick() {
    this.form.LRN .OUserID = this.currentUser.userID;
    this.form.LRN.OBit = true;
    this.form.LRN .ODate = new Date();
    this.disabledLRN = false;
    this.LRNOReason = '';
  }

  OverrideLRNExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledLRN  = true;
    console.log(this.form.LRN);
  }

  UndoOverrideLRN() {
    this.form.LRN.OUserID = null;
    this.form.LRN.OBit = null;
    this.form.LRN.ODate = null;
    this.form.LRN.OReason = null;
    this.LRNOReason = '';
    this.disabledLRN = false;
  }

  OverrideImportersCodeClick() {
    this.form.importersCode.OUserID = this.currentUser.userID;
    this.form.importersCode.OBit = true;
    this.form.importersCode.ODate = new Date();
    this.disabledimportersCode = false;
    this.importersCodeOReason = '';
  }

  OverrideImportersCodeExcept() {
    this.disabledimportersCode  = true;
    console.log(this.form.importersCode);
  }

  UndoOverrideImportersCode() {
    this.form.importersCode.OUserID = null;
    this.form.importersCode.OBit = null;
    this.form.importersCode.ODate = null;
    this.form.importersCode.OReason = null;
    this. importersCodeOReason = '';
    this.disabledimportersCode = false;
  }

  OverridePCCClick() {
    this.form.PCC.OUserID = this.currentUser.userID;
    this.form.PCC.OBit = true;
    this.form.PCC.ODate = new Date();
    this.disabledpcc = false;
    this.pccOReason = '';
  }

  OverridePCCExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledpcc  = true;
    console.log(this.form.PCC);
  }

  UndoOverridePCC() {
    this.form.PCC.OUserID = null;
    this.form.PCC.OBit = null;
    this.form.PCC.ODate = null;
    this.form.PCC.OReason = null;
    this. pccOReason = '';
    this.disabledpcc = false;
  }

  OverrideFOBClick() {
    this.form.FOB.OUserID = this.currentUser.userID;
    this.form.FOB.OBit = true;
    this.form.FOB.ODate = new Date();
    this.disabledFOB = false;
    this.FOBOReason = '';
  }

  OverrideFOBExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledFOB  = true;
    console.log(this.form.FOB);
  }

  UndoOverrideFOB() {
    this.form.FOB.OUserID = null;
    this.form.FOB.OBit = null;
    this.form.FOB.ODate = null;
    this.form.FOB.OReason = null;
    this. FOBOReason = '';
    this.disabledFOB = false;
  }

  OverrideWaybillNoClick() {
    this.form.waybillNo.OUserID = this.currentUser.userID;
    this.form.waybillNo.OBit = true;
    this.form.waybillNo.ODate = new Date();
    this.disabledwaybillNo = false;
    this.waybillNoOReason = '';
  }

  OverrideWaybillNoExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledwaybillNo  = true;
    console.log(this.form.waybillNo);
  }

  UndoOverrideWaybillNo() {
    this.form.waybillNo.OUserID = null;
    this.form.waybillNo.OBit = null;
    this.form.waybillNo.ODate = null;
    this.form.waybillNo.OReason = null;
    this. waybillNoOReason = '';
    this.disabledwaybillNo = false;
  }

  OverridefileRefClick() {
    this.form.fileRef.OUserID = this.currentUser.userID;
    this.form.fileRef.OBit = true;
    this.form.fileRef.ODate = new Date();
    this.disabledfileRef = false;
    this.fileRefOReason = '';
  }

  OverridefileRefExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledfileRef  = true;
    console.log(this.form.fileRef);
  }

  UndoOverridefileRef() {
    this.form.fileRef.OUserID = null;
    this.form.fileRef.OBit = null;
    this.form.fileRef.ODate = null;
    this.form.fileRef.OReason = null;
    this. fileRefOReason = '';
    this.disabledfileRef = false;
  }

  OverridetotalCustomsValueClick() {
    this.form.totalCustomsValue.OUserID = this.currentUser.userID;
    this.form.totalCustomsValue.OBit = true;
    this.form.totalCustomsValue.ODate = new Date();
    this.disabledtotalCustomsValue = false;
    this.totalCustomsValueOReason = '';
  }

  OverridetotalCustomsValueExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledtotalCustomsValue  = true;
    console.log(this.form.totalCustomsValue);
  }

  UndoOverridetotalCustomsValue() {
    this.form.totalCustomsValue.OUserID = null;
    this.form.totalCustomsValue.OBit = null;
    this.form.totalCustomsValue.ODate = null;
    this.form.totalCustomsValue.OReason = null;
    this. totalCustomsValueOReason = '';
    this.disabledtotalCustomsValue = false;
  }

  OverridetotalDutyClick() {
    this.form.totalDuty.OUserID = this.currentUser.userID;
    this.form.totalDuty.OBit = true;
    this.form.totalDuty.ODate = new Date();
    this.disabledtotalDuty = false;
    this.totalDutyOReason = '';
  }

  OverridetotalDutyExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledtotalDuty  = true;
    console.log(this.form.totalDuty);
  }

  UndoOverridetotalDuty() {
    this.form.totalDuty.OUserID = null;
    this.form.totalDuty.OBit = null;
    this.form.totalDuty.ODate = null;
    this.form.totalDuty.OReason = null;
    this.totalDutyOReason = '';
    this.disabledtotalDuty = false;
  }

  OverrideMRNClick() {
    this.form.MRN.OUserID = this.currentUser.userID;
    this.form.MRN.OBit = true;
    this.form.MRN.ODate = new Date();
    this.disabledMRN = false;
    this.MRNOReason = '';
  }

  OverrideMRNExcept() {
    // this.form.LRN .OReason = reason;
    this.disabledMRN  = true;
    console.log(this.form.MRN);
  }

  UndoOverrideMRN() {
    this.form.MRN.OUserID = null;
    this.form.MRN.OBit = null;
    this.form.MRN.ODate = null;
    this.form.MRN.OReason = null;
    this. MRNOReason = '';
    this.disabledMRN = false;
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
