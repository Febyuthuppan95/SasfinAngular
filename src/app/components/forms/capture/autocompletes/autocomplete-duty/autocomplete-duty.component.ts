import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormControl } from '@angular/forms';
import { CaptureService } from 'src/app/services/capture.service';
import { DutyListResponse, Duty } from 'src/app/models/HttpRequests/SAD500Line';
import { MatDialog } from '@angular/material';
import { DutyAssignDialogComponent } from '../../form-sad500/form-sad500-line/duty-assign-dialog/duty-assign-dialog.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ls-autocomplete-duty',
  templateUrl: './autocomplete-duty.component.html',
  styleUrls: ['./autocomplete-duty.component.scss']
})
export class AutocompleteDutyComponent implements OnInit, OnChanges, OnDestroy {
constructor(private userService: UserService,
            private captureService: CaptureService,
            private dialog: MatDialog) { }

  @Input() control: FormControl;
  @Input() sad500LineID: number;
  @Input() appearance = 'fill';

  private currentUser = this.userService.getCurrentUser();
  private listTemp: any [] = [];

  public assignedList: any[] = [];
  public list: any [] = [];
  public query = new FormControl();
  private sad500LineIDTemp = -1;

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl();
    }

    this.load();

    this.query.valueChanges.subscribe((value) => {
      this.list = this.listTemp;
      const query: string = value;

      if (query && query !== null && query !== '') {
        this.list = this.list.filter(x => this.matchRuleShort(x.code.toUpperCase(), `*${query.toUpperCase()}*`));
      }
    });
  }

  ngOnChanges() {
    if (this.sad500LineIDTemp !== this.sad500LineID) {
      this.load();
      this.query.setValue('');
      this.sad500LineIDTemp = this.sad500LineID;
    }
  }

  processAssigned() {
    this.assignedList.forEach((item) => {
      const current = this.listTemp.find(x => x.dutyTaxTypeID === item.dutyTaxTypeID);
      item.label = current ? current.code : '';
      this.listTemp = this.listTemp.filter(x => x.dutyTaxTypeID !== item.dutyTaxTypeID);
      this.list = this.listTemp;
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
          sad500LineID: this.sad500LineID,
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

    this.dialog.open(DutyAssignDialogComponent, {
      data: assign,
      width: '256px'
    }).afterClosed().subscribe((result: Duty) => {
      if (result !== undefined) {
        assign.value = result.duty;
        this.assignedList.push(assign);
        this.listTemp = this.listTemp.filter(x => x.dutyTaxTypeID !== duty);
        this.list = this.listTemp;
        this.control.setValue(this.assignedList);
        this.query.reset('');
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
    this.control.setValue(this.assignedList);
  }

  ngOnDestroy(): void {}
}
