import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { Component, OnInit, OnChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UserService } from 'src/app/services/user.Service';
import { ValidateService } from 'src/app/services/Validation.Service';
import { TariffService } from 'src/app/services/Tariff.service';
import { CaptureService } from 'src/app/services/capture.service';
import { User } from 'src/app/models/HttpResponses/User';
import { UnitsOfMeasure } from 'src/app/models/HttpResponses/UnitsOfMeasure';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { DutyListResponse, Duty, SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';
import { takeUntil } from 'rxjs/operators';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { VOCListResponse, VOC } from 'src/app/models/HttpResponses/VOC';

@Component({
  selector: 'app-form-voc',
  templateUrl: './form-voc.component.html',
  styleUrls: ['./form-voc.component.scss']
})
export class FormVOCComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService,
                private tariffService: TariffService, private captureService: CaptureService, private dialog: MatDialog,
                private transactionService: TransactionService, private router: Router, private eventService: EventService,
                private snackbarService: HelpSnackbar) { }

    currentUser: User;

    currentTheme: string;
    unitOfMeasureList: UnitsOfMeasure[];
    unitOfMeasureListTemp: UnitsOfMeasure[];
    focusLineForm: boolean;

    showTariffHint = false;
    showUnitOfMeasureHint = true;
    tariffs:{id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[];
    tariffsTemp: {id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[];
    myControl = new FormControl();
    unitOfMeasure = new FormControl();
    selectedTariffVal: string;
    selectedUnitVal: string;
    private unsubscribe$ = new Subject<void>();

    dutyList: DutyListResponse;
    assignedDuties: Duty[] = [];
    dutiesToBeSaved: Duty[] = [];
    dutyListTemp: Duty[] = [];
    assignedDutiesTemp: Duty[] = [];
    dutiesToBeSavedTemp: Duty[] = [];
    dutiesQuery = '';
    dutieAssignedQuery = '';
    focusDutiesQuery = false;
    focusAssignedQuery = false;
    currentVOC: VOC;
    dutyIndex = 0;
    duties: Duty[] = [];

    @ViewChild(NotificationComponent, { static: true })
    private notify: NotificationComponent;

    @ViewChild('dutiesAssignedEl', { static: false })
    dutiesAssignedEl: ElementRef;

    @Input() lineData: SAD500Line;
    @Input() updateSAD500Line: SAD500Line;
    @Input() focusSADLine: boolean;
    @Input() showLines: boolean;
    @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();
    @Output() updateSADLine = new EventEmitter<SAD500Line>();

    shortcuts: ShortcutInput[] = [];
    @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

    form = {
      tariffID: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      tariff: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      customsValue: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      lineNo: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      unitOfMeasureID: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      unitOfMeasure: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      tariffError: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      customsValueError: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      lineNoError: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      unitOfMeasureError: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      quantity: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
      quantityError: {
        value: null,
        error: null,
        OBit: null,
        OUserID: null,
        ODate: null,
        OReason: null,
    },
    };

    isUpdate: boolean;
    dialogOpen = false;
    currentAttachmentID: number;
    currentTransactionID: number;
    unitOfMeasureID: number;

    ngOnInit() {
      // this.themeService.observeTheme()
      // .pipe(takeUntil(this.unsubscribe$))
      // .subscribe(theme => this.currentTheme = theme);

      // this.transactionService.observerCurrentAttachment()
      // .pipe(takeUntil(this.unsubscribe$))
      // .subscribe(data => {
      //   this.currentAttachmentID = data.attachmentID;
      //   this.currentTransactionID = data.transactionID;
      // });

      // this.currentUser = this.userService.getCurrentUser();

      // this.eventService.observeCaptureEvent().pipe(takeUntil(this.unsubscribe$))
      // .subscribe(data => this.submit());

      // this.loadUnits();
      // this.loadTarrifs();
      // this.loadDuties();
    }

    ngAfterViewInit(): void {
      this.shortcuts.push(
          {
            key: 'alt + s',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => {
              {
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
            }
          },
          {
            key: 'alt + k',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.focusDutiesQuery = !this.focusDutiesQuery
          },
      );
    }

    loadUnits(): void {
      // tslint:disable-next-line: max-line-length
      this.unitService.list({ userID: this.currentUser.userID, specificUnitOfMeasureID: -1, rowStart: 1, rowEnd: 1000, filter: '', orderBy: '', orderByDirection: '' }).then(
        (res: ListUnitsOfMeasure) => {
          if (res.outcome.outcome === 'SUCCESS') {
            this.unitOfMeasureList = res.unitOfMeasureList;
            this.unitOfMeasureListTemp = res.unitOfMeasureList;
          }
        },
        (msg) => {

        }
      );
    }

    loadVoc() {
      this.captureService.vocList({
        userID: this.currentUser.userID,
        vocID: this.currentAttachmentID,
        filter: '',
        transactionID: this.currentTransactionID,
        orderBy: '',
        orderByDirection: '',
        rowStart: 1,
        rowEnd: 10
      }).then(
        (res: VOCListResponse) => {
          if (res.outcome.outcome === 'SUCCESS') {
            if (res.vocs.length !== 0) {
            //   this.currentVOC = res.vocs[0];
            //   this.form.quantity.value = this.currentVOC.quantity;
            //   this.form.customsValue.value = this.currentVOC.customsValue;
            //   this.form.lineNo.value = this.currentVOC.lineNo;
            //   this.form.tariff.value = this.currentVOC.tariff;
            //   this.form.unitOfMeasure.value = this.currentVOC.unitOfMeasure;
            //   this.form.unitOfMeasureID.value = this.currentVOC.unitOfMeasureID;
            //   this.form.tariffID.value = this.currentVOC.tariffID;
             }
          } else {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
        },
        (msg) => {

        }
      );
    }

    submit() {
              this.captureService.vocUpdate({
                userID: this.currentUser.userID,
                vocID: this.currentAttachmentID,
                tariff: this.form.tariff.value,
                unitOfMeasure: this.form.unitOfMeasure.value,
                quantity: this.form.quantity.value,
                customsValue: this.form.customsValue.value,
                lineNo: this.form.lineNo.value,
                tariffID: this.form.tariffID.value,
                unitOfMeasureID: this.unitOfMeasureID,
                sad500LineID: -1
              }).then(
                (res: Outcome) => {
                  if (res.outcome === 'SUCCESS') {
                    this.notify.successmsg(res.outcome, res.outcomeMessage);
                    this.router.navigate(['transaction/capturerlanding']);
                  } else {
                    this.notify.errorsmsg(res.outcome, res.outcomeMessage);
                  }
                },
                (msg) => {
                  this.notify.errorsmsg('Failure', 'Something went wrong');
                }
              );
    }

    loadTarrifs() {
      this.tariffService.list({ userID: this.currentUser.userID, specificTariffID: -1, filter: '', rowStart: 1, rowEnd: 100 }).then(
        // tslint:disable-next-line: max-line-length
        (res: { tariffList: {id: number, itemNumber: string; heading: string; tariffCode: number; subHeading: string; checkDigit: string; name: string; duty: string; hsUnit: string; }[], outcome: Outcome, rowCount: number }) => {
          this.tariffs = res.tariffList;
          this.tariffsTemp = res.tariffList;
        },
        (msg) => {
        }
      );
    }

    selectedTariff(description) {
      this.form.tariff.value = description;
    }

    saveLineDuty(line: Duty) {
      this.captureService.vocDutyAdd({
        userID: this.currentUser.userID,
        dutyID: line.dutyTaxTypeID,
        vocID: line.vocID,
      }).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.nextDutyAsync();
            console.log('Line Duty Saved');
          } else {
            console.log('Line Duty Not Saved');
          }
        },
        (msg) => {
          console.log('Line Duty Client Error');
        }
      );
    }

    nextDutyAsync() {
      this.dutyIndex++;
      if (this.dutyIndex < this.duties.length) {
        const pendingDuty = this.duties[this.dutyIndex];
        pendingDuty.vocID = this.currentAttachmentID;

        this.saveLineDuty(pendingDuty);
      } else {
        this.submit();
      }
    }

    assignDuty(duty: Duty) {
      duty.vocID = this.currentAttachmentID;
      this.duties.push(duty);
      this.dutiesToBeSaved.push(duty);
      this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
    }

    revokeDuty(duty: Duty) {
      this.dutyList.duties.push(duty);
      this.dutiesToBeSaved = this.dutiesToBeSaved.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
      this.duties = this.duties.filter(x => x.dutyTaxTypeID !== duty.dutyTaxTypeID);
    }

    selectedUnit(name: string, id: number) {
      this.form.unitOfMeasure.value = name;
      this.unitOfMeasureID = id;

    }

    filterTariff() {
      this.tariffs = this.tariffsTemp;
      this.tariffs = this.tariffs.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.form.tariff.value.toUpperCase()}*`));
    }

    filterUnit() {
      this.unitOfMeasureList = this.unitOfMeasureListTemp;
      this.unitOfMeasureList = this.unitOfMeasureList.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.form.unitOfMeasure.value.toUpperCase()}*`));
    }

    filterDuties() {
      this.dutyList.duties = this.dutyListTemp;
      this.dutyList.duties = this.dutyList.duties.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.dutiesQuery.toUpperCase()}*`));
    }

    filterAssignedDuties() {
      this.assignedDuties = this.assignedDutiesTemp;
      this.assignedDuties = this.assignedDuties.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.dutieAssignedQuery.toUpperCase()}*`));

      this.dutiesToBeSaved = this.dutyListTemp;
      this.dutiesToBeSaved = this.dutiesToBeSaved.filter(x => this.matchRuleShort(x.name.toUpperCase(), `*${this.dutieAssignedQuery.toUpperCase()}*`));
    }

    matchRuleShort(str, rule) {
      // tslint:disable-next-line: no-shadowed-variable
      const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
    }

    loadDuties() {
      this.captureService.dutyList({
        dutyTaxTypeID: -1,
        filter: '',
        rowStart: 1,
        rowEnd: 100,
        orderBy: 'ASC',
        orderDirection: 'Name'
      }).then(
        (res: DutyListResponse) => {
          this.dutyList = res;
          this.dutyListTemp = res.duties;

          if (this.isUpdate) {
            this.loadAssignedDuties();
          }
        },
        (msg) => {}
      );
    }

    loadAssignedDuties() {
      if (this.updateSAD500Line !== null) {
        this.captureService.sad500LineDutyList({
          userID: 3,
          dutyID: -1,
          sad500LineID: this.updateSAD500Line.sad500LineID,
          filter: '',
          rowStart: 1,
          rowEnd: 100,
          orderBy: 'ASC',
          orderDirection: 'Name',
        }).then(
          (res: DutyListResponse) => {
            console.log(res);

            this.assignedDuties = res.duties;
            this.assignedDutiesTemp = res.duties;
            this.assignedDuties.forEach(item => {
              this.dutyList.duties = this.dutyList.duties.filter(x => x.dutyTaxTypeID !== item.dutyTaxTypeID);
            });
          },
          (msg) => {}
        );
      }
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
