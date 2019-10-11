import { Component, OnInit, EventEmitter, Output, OnChanges, Input } from '@angular/core';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { ThemeService } from 'src/app/services/theme.Service';
import { UnitMeasureService } from 'src/app/services/Units.Service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { ListUnitsOfMeasure } from 'src/app/models/HttpResponses/ListUnitsOfMeasure';
import { SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit, OnChanges {


  constructor(private themeService: ThemeService, private unitService: UnitMeasureService, private userService: UserService) { }

  currentUser: User;

  currentTheme: string;
  tariffList: object[];
  unitOfMeasureList: object[];

  @Input() lineData: SAD500Line;
  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();

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

  ngOnInit() {
    this.themeService.observeTheme().subscribe(theme => this.currentTheme = theme);
    this.currentUser = this.userService.getCurrentUser();

    this.loadUnits();
    this.loadTariffs();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    throw new Error('Method not implemented.');
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
