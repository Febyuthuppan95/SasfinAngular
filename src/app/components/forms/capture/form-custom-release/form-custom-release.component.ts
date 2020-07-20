import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { MatDialog, MatSnackBar } from '@angular/material';
import { CompanyService } from 'src/app/services/Company.Service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { CPCItem } from '../form-sad500/form-sad500.component';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../form-invoice/form-invoice-lines/form-invoice-lines.component';

@AutoUnsubscribe()
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
              private snackbarService: HelpSnackbar,
              private snackbar: MatSnackBar,
              private formBuilder: FormBuilder,
              private objectHelpService: ObjectHelpService,
              private apiService: ApiService) { }
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

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  shortcuts: ShortcutInput[] = [];

  CRNForm = new FormGroup({
    control1: new FormControl(null, [Validators.required]),
    control1a: new FormControl(null),
    control2: new FormControl(null, [Validators.required]),
    control2a: new FormControl(null),
    control3: new FormControl(null, [Validators.nullValidator]),
    control3a: new FormControl(null),
    control4: new FormControl(null, [Validators.nullValidator]),
    control4a: new FormControl(null),
    control5: new FormControl(null, [Validators.required]),
    control5a: new FormControl(null),
    control6: new FormControl(null, [Validators.nullValidator]),
    control6a: new FormControl(null),
    // control7: new FormControl(null, [Validators.required]),
    // control7a: new FormControl(null),
    // control8: new FormControl(null, [Validators.required]),
    control9: new FormControl(null, [Validators.required]),
    control9a: new FormControl(null),
    control10: new FormControl(null, [Validators.nullValidator]),
    control10a: new FormControl(null),
    control11: new FormControl(null, [Validators.nullValidator]),
    control11a: new FormControl(null),
    control12: new FormControl(null, [Validators.required])
  });

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
    ediStatusID: {
      value: null,
      error: null,
      OBit: null,
      OUserID: null,
      ODate: null,
      OReason: null,
    }
  };
  help = true;
  attachmentSubscription: Subscription;
  dialogOpen = false;

  editStatusList: any[] = [];
  editStatusListTemp: any[] = [];
  ediStatusQuery: string = '';
  ediStatusControl = new FormControl();

  ngOnInit() {
    // this.themeService.observeTheme()
    // .subscribe(value => this.currentTheme = value);

    // this.eventService.observeCaptureEvent()
    // .subscribe((escalation?: boolean, saveProgress?: boolean) => this.submit(escalation));

    // this.attachmentSubscription = this.transactionService.observerCurrentAttachment()
    // .subscribe((curr: { transactionID: number, attachmentID: number }) => {
    //   if (curr !== null || curr !== undefined) {
    //     this.attachmentID = curr.attachmentID;
    //     this.transactionID = curr.transactionID;
    //     this.loadCapture();
    //   }
    // });

    // this.loadEDIStatuses();
    // this.loadCPC();
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

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }
  toggelHelpBar() {
    this.help = !this.help;
    this.objectHelpService.toggleHelp(this.help);
}
cpcList: CPCItem[] = [];
cpcListTemp :CPCItem [] = [];

loadCPC() {
  const model = {
    requestParams: {
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 300
    },
    requestProcedure: 'CPCList'
  };
  this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
    (res: ListReadResponse) => {
      if (res.rowCount > 0 )  {
        this.cpcList = res.data;
        this.cpcListTemp = res.data;

      }
      // console.log(res);
    }
  );
}
selectFilteredCPC() {
  this.cpcList = this.cpcListTemp;
  this.cpcList = this.cpcList.filter(x => this.matchRuleShort(x.CPC.toUpperCase(), `*${this.form.PCC.value.toUpperCase()}*`));
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
      ediStatusID: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
      }
    });
  }

  submit(escalation?: boolean) {
    // console.log(this.CRNForm.controls);
    if (this.CRNForm.valid || escalation) {
        const requestModel = {
          userID: this.currentUser.userID,
          customsReleaseID: this.attachmentID,
          fileRef: this.form.fileRef.value,
          totalCustomsValue: this.form.totalCustomsValue.value,
          totalDuty: this.form.totalDuty.value,
          serialNo: this.form.serialNo.value,
          lrn: this.form.LRN.value,
          importersCode: this.form.importersCode.value,
          pcc: this.form.PCC.value,
          waybillNo: this.form.waybillNo.value,
          mrn: this.form.MRN.value,
          ediStatusID: this.form.ediStatusID.value,
          supplierRef: this.form.supplierRef.value,
          attachmentStatusID: escalation ? 7 : 3,
          isDeleted: 0,

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
            // console.log(JSON.stringify(msg));
            this.notify.errorsmsg('Failure', 'Cannot reach server');
          }
        );
    } else {
      this.snackbar.open(`Please fill in the all header data`, '', {
        duration: 3000,
        panelClass: ['capture-snackbar-error'],
        horizontalPosition: 'center',
      });
    }
  }

  loadCapture() {
    const requst = {
      userID: this.currentUser.userID,
      crnID: this.attachmentID,
      transactionID: this.transactionID,
      filter: '',
      rowStart: 1,
      rowEnd: 15,
      orderBy: '',
      orderByDirection: '',
    };

    this.captureService.customsReleaseGet(requst).then(
      (res: CRNList) => {
        // console.log(res.customs);
        this.form.MRN.value = res.customs[0].mrn;
        this.form.serialNo.value = res.customs[0].serialNo;
        this.form.importersCode.value = res.customs[0].importersCode;
        this.form.waybillNo.value = res.customs[0].waybillNo;
        this.form.LRN.value = res.customs[0].lrn;
        this.form.PCC.value = res.customs[0].pcc;
        // this.form.supplierRef.value = res.customs[0].supplierRef;
        this.form.totalDuty.value = res.customs[0].totalDuty;
        this.form.totalCustomsValue.value = res.customs[0].totalCustomsValue;
        this.form.fileRef.value = res.customs[0].fileRef;
        this.form.ediStatusID.value = res.customs[0].ediStatusID;

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
              if (error.fieldName === 'SerialNo') {
                  this.form.serialNo.error = error.errorDescription;
              } else if (error.fieldName === 'LRN') {
                  this.form.LRN.error = error.errorDescription;
              } else if (error.fieldName === 'ImporterCode') {
                  this.form.importersCode.error = error.errorDescription;
              } else if (error.fieldName === 'PCC') {
                  this.form.PCC.error = error.errorDescription;
              } else if (error.fieldName === 'WaybillNo') {
                  this.form.waybillNo.error = error.errorDescription;
              } else if (error.fieldName === 'FileRef') {
                  this.form.fileRef.error = error.errorDescription;
              } else if (error.fieldName === 'TotalCustomsValue') {
                  this.form.totalCustomsValue.error = error.errorDescription;
              } else if (error.fieldName === 'TotalDuty') {
                  this.form.totalDuty.error = error.errorDescription;
              } else if (error.fieldName === 'MRN') {
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
    // console.log(this.form.serialNo);
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
    // console.log(this.form.LRN);
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
    // console.log(this.form.importersCode);
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
  // console.log(this.form.PCC);
  }

  UndoOverridePCC() {
    this.form.PCC.OUserID = null;
    this.form.PCC.OBit = null;
    this.form.PCC.ODate = null;
    this.form.PCC.OReason = null;
    this. pccOReason = '';
    this.disabledpcc = false;
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
    // console.log(this.form.waybillNo);
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
    // console.log(this.form.fileRef);
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
    // console.log(this.form.totalCustomsValue);
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
    // console.log(this.form.totalDuty);
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
    // console.log(this.form.MRN);
  }

  UndoOverrideMRN() {
    this.form.MRN.OUserID = null;
    this.form.MRN.OBit = null;
    this.form.MRN.ODate = null;
    this.form.MRN.OReason = null;
    this. MRNOReason = '';
    this.disabledMRN = false;
  }

  loadEDIStatuses() {
    this.captureService.ediStatusList({ pageIndex: 0, pageSize: 100 }).then(
      // tslint:disable-next-line: max-line-length
      (res: any) => {
        // console.log(res);
        this.editStatusList = res.data;
        this.editStatusListTemp = this.editStatusList;

        if (this.form.ediStatusID.value !== 0 || this.form.ediStatusID.value !== null) {
          this.inifilterEDI();
        }
      },
      (msg) => { }
    );
  }

  selectedEDIStatus(id: number) {
    this.form.ediStatusID.value = id;
  }

  filterEDI() {
    this.editStatusList = this.editStatusListTemp;
    // tslint:disable-next-line: max-line-length
    this.editStatusList = this.editStatusList.filter(x => this.matchRuleShort(x.Name.toUpperCase(), `*${this.ediStatusQuery.toUpperCase()}*`));
  }

  inifilterEDI() {
    this.editStatusList = this.editStatusListTemp;
    this.editStatusList = this.editStatusList.filter(x => x.EDIStatusID === this.form.ediStatusID.value);
    this.ediStatusQuery = this.editStatusList[0].Name;
  }

  matchRuleShort(str, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  ngOnDestroy(): void {}
}
