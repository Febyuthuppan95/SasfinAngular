import { Component, OnInit, EventEmitter, Output, OnChanges, Input, AfterViewInit, ViewChild } from '@angular/core';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { ShortcutInput, KeyboardShortcutsComponent, AllowIn } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit, OnChanges, AfterViewInit {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService) { }

  currentUser: User;

  currentTheme: string;
  tariffList: object[];
  unitOfMeasureList: object[];
  focusLineForm: boolean;

  @Input() lineData: SAD500Line;
  @Input() updateSAD500Line: SAD500Line;
  @Input() focusSADLine: boolean;
  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();
  @Output() updateSADLine = new EventEmitter<SAD500Line>();

  shortcuts: ShortcutInput[] = [];
  @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;

  form = {
    cpc: '',
    tariffID: -1,
    tariff: '',
    customsValue: 0,
    lineNo: '',
    unitOfMeasureID: -1,
    unitOfMeasure: '',
    productCode: '',
    value: '',
  };

  isUpdate: boolean;

  ngOnInit() {
    this.themeService.observeTheme().subscribe(theme => this.currentTheme = theme);
    this.currentUser = this.userService.getCurrentUser();

    this.loadUnits();
    this.loadTariffs();
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + n',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.focusLineForm = !this.focusLineForm
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.updateSAD500Line !== null && this.updateSAD500Line !== undefined) {
      this.isUpdate = true;

      this.form.cpc = this.updateSAD500Line.cpc;
      this.form.customsValue = this.updateSAD500Line.customsValue;
      this.form.lineNo = this.updateSAD500Line.lineNo;
      this.form.productCode = this.updateSAD500Line.productCode;
      this.form.tariff = this.updateSAD500Line.tariff;
      this.form.unitOfMeasure = this.updateSAD500Line.unitOfMeasure;
      this.form.value = this.updateSAD500Line.value;

    } else {
      this.isUpdate = false;
      this.form = {
        cpc: '',
        tariffID: -1,
        tariff: '',
        customsValue: 0,
        lineNo: '',
        unitOfMeasureID: -1,
        unitOfMeasure: '',
        productCode: '',
        value: '',
      };
    }
  }

  loadUnits(): void {
    // tslint:disable-next-line: max-line-length
    this.unitService.list({ userID: this.currentUser.userID, specificUnitOfMeasureID: -1, rowStart: 1, rowEnd: 1000, filter: '', orderBy: '', orderByDirection: '' }).then(
      (res: ListUnitsOfMeasure) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.unitOfMeasureList = res.unitOfMeasureList;
        }
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  loadTariffs(): void {
  }

  submit() {
    if (this.isUpdate) {
      this.updateSADLine.emit({
        rowNum: -1,
        sad500LineID: this.updateSAD500Line.sad500LineID,
        sad500ID: -1,
        cpc: this.form.cpc,
        tariffID: 1,
        tariff: this.form.tariff,
        customsValue: this.form.customsValue,
        lineNo: this.form.lineNo,
        unitOfMeasureID: 1,
        unitOfMeasure: this.form.unitOfMeasure,
        productCode: this.form.productCode,
        value: this.form.value,
      });
    }
    this.submitSADLine.emit({
      userID: -1,
      sad500ID: -1,
      cpc: this.form.cpc,
      tariffID: 1,
      tariff: this.form.tariff,
      customsValue: this.form.customsValue,
      lineNo: this.form.lineNo,
      unitOfMeasureID: 1,
      unitOfMeasure: this.form.unitOfMeasure,
      productCode: this.form.productCode,
      value: this.form.value,
    });
  }

}
