import { Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { CaptureService } from 'src/app/services/capture.service';
import { DutyListResponse, Duty } from 'src/app/models/HttpRequests/SAD500Line';
import { DutyAssignDialogComponent } from '../../form-sad500/form-sad500-line/duty-assign-dialog/duty-assign-dialog.component';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { finalize } from 'rxjs/operators';
import { BottomSheetAssignDutyComponent } from './bottom-sheet-assign-duty/bottom-sheet-assign-duty.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-duty',
  templateUrl: './autocomplete-duty.component.html',
  styleUrls: ['./autocomplete-duty.component.scss']
})
export class AutocompleteDutyComponent implements OnInit, OnChanges, OnDestroy {
constructor(private userService: UserService,
            private captureService: CaptureService,
            private dialog: MatDialog,
            private bottomSheet: MatBottomSheet,
            private snackbarService: HelpSnackbar) { }

  @Input() control: FormControl;
  @Input() sad500LineID: number;
  @Input() appearance = 'fill';
  @Input() helpSlug = 'default';

  @ViewChild('dutyInput', { static: false })
  dutyInput: ElementRef;

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any [] = [];
  private listMaster: any [] = [];

  public assignedList: any[] = [];
  public list: any [] = [];
  public query = new FormControl();
  private sad500LineIDTemp = -1;
  public selected = false;
  private currentDialog: MatBottomSheetRef<BottomSheetAssignDutyComponent>;

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.load();

    this.query.valueChanges.subscribe((value) => {
      if (value) {
        if (value.dutyTaxTypeID) {
          // Focus / Assign

          this.list = this.listTemp;
          const query: string = value.code;

          if (query && query !== null && query !== '') {
            this.list = this.list.filter(x => this.matchRuleShort(x.code.toUpperCase(), `*${query.toUpperCase()}*`));
          }

        } else {
          this.list = this.listTemp;
          const query: string = value;

          if (query && query !== null && query !== '') {
            this.list = this.list.filter(x => this.matchRuleShort(x.code.toUpperCase(), `*${query.toUpperCase()}*`));
          }
        }
      }
    });
  }

  ngOnChanges() {
    // console.log(this.sad500LineID);
    if (this.sad500LineID == null) {
      this.load();
      this.query.setValue('');
    } else if (this.sad500LineIDTemp !== this.sad500LineID) {
      this.load();
      this.query.setValue('');
      this.sad500LineIDTemp = this.sad500LineID;
    }
  }

  processAssigned() {
    if (this.control.value !== null && this.control.value) {
      this.control.value.forEach((item) => {
        // console.log(item);
        this.assignedList.push(item);
      });
    }

    this.assignedList.forEach((item) => {
      const current = this.listTemp.find(x => x.dutyTaxTypeID === item.dutyTaxTypeID);

      if (current) {
        // console.log(current);
        item.label = current.code;
        item.name = current.code;
        this.listTemp = this.listTemp.filter(x => x.dutyTaxTypeID !== item.dutyTaxTypeID);
        this.list = this.listTemp;
      }
    });

    this.assignedList = this.assignedList.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.dutyTaxTypeID === thing.dutyTaxTypeID
    )));

    this.assignedList.forEach((item) => {
      const current = this.listMaster.find(x => x.dutyTaxTypeID === item.dutyTaxTypeID);
      item.name = current.code;
    });

    this.control.setValue(this.assignedList);
  }

  async load() {
    await this.captureService
      .dutyList({
        dutyTaxTypeID: -1,
        filter: '',
        rowStart: 1,
        rowEnd: 100,
        orderBy: 'ASC',
        orderDirection: 'Name',
      })
      .then(
        async (res: DutyListResponse) => {
          this.list = res.duties;
          this.listTemp = this.list;
          this.listMaster = this.list;
          await this.loadAssignedDuty();
        }
      );
  }

  matchRuleShort(str: string, rule) {
    // tslint:disable-next-line: no-shadowed-variable
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp('^' + rule.split('*').map(escapeRegex).join('.*') + '$').test(str);
  }

  public displayFn(item: any): string {
    return item ? `${item.code}` : '';
  }

  async loadAssignedDuty() {
    const response: any = await this.captureService
        .sad500LineDutyList({
          userID: this.currentUser.userID,
          dutyID: -1,
          sad500LineID: this.sad500LineID === null ? -1 : this.sad500LineID,
          filter: '',
          rowStart: 1,
          rowEnd: 100,
          orderBy: 'ASC',
          orderDirection: 'Name',
        });

    response.duties.forEach((duty) => {
      duty.isLocal = false;
    });

    this.assignedList = response.duties;
    this.processAssigned();
  }

  async assignDuty(duty: number, label?: string) {
    const assign = {
      userID: this.currentUser.userID,
      dutyTaxTypeID: duty,
      dutyID: duty,
      sad500LineID: this.sad500LineID,
      isLocal: true,
      duty: null,
      value: null,
      label
    };
    if (this.currentDialog) {
      this.currentDialog.instance.close();
    }
    this.currentDialog = this.bottomSheet.open(BottomSheetAssignDutyComponent, {
      data: assign,
    });



    this.currentDialog.afterDismissed().pipe(
      finalize(() => this.currentDialog = undefined)
    ).subscribe((result: Duty) => {
      if (result !== undefined) {
        assign.value = result.duty;
        this.assignedList.push(assign);
        this.listTemp = this.listTemp.filter(x => x.dutyTaxTypeID !== duty);
        this.list = this.listTemp;
        this.control.setValue(this.assignedList);
        this.query.reset('');
        this.dutyInput.nativeElement.focus();
      }
    });
  }

  async revokeDuty(duty) {
    if (!duty.isLocal) {
      await this.captureService.sad500LineDutyRemove({
        dutyID: duty.dutyTaxTypeID,
        userID: this.currentUser.userID,
        sad500LineID: this.sad500LineID
      });
    }

    this.assignedList.splice(this.assignedList.indexOf(duty), 1);
    const removed = this.listTemp.find(x => x.dutyTaxTypeID === duty.dutyTaxTypeID);

    if (removed) {
      this.list.push(removed);
    }

    this.control.setValue(this.assignedList);
  }

  focusOut(trigger) {
    if (this.currentDialog) {
      this.currentDialog.instance.close();
    }

    if (this.list.length > 0 && !this.selected && (this.query.value !== null && this.query.value !== '')) {
      this.assignDuty(this.list[0].dutyTaxTypeID, this.list[0].code);

      trigger.closePanel();
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
    if (this.currentDialog) {
      this.currentDialog.dismiss();
      this.currentDialog = undefined;
    }
  }
}
