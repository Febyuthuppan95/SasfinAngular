import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SAD500LineCreateRequest } from 'src/app/models/HttpRequests/SAD500Line';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-form-sad500-line',
  templateUrl: './form-sad500-line.component.html',
  styleUrls: ['./form-sad500-line.component.scss']
})
export class FormSAD500LineComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  currentTheme: string;

  @Output() submitSADLine = new EventEmitter<SAD500LineCreateRequest>();

  form = {
    cpc: '',
    tariffID: -1,
    tariff: '',
    customsValue: -1,
    lineNo: '',
    unitOfMeasureID: -1,
    unitOfMeasure: '',
    productCode: '',
    value: '',
  };

  ngOnInit() {
    this.themeService.observeTheme().subscribe(theme => this.currentTheme = theme);
  }

  submit() {
    this.submitSADLine.emit({
      userID: -1,
      sad500ID: -1,
      cpc: this.form.cpc,
      tariffID: -1,
      tariff: this.form.tariff,
      customsValue: -1,
      lineNo: this.form.lineNo,
      unitOfMeasureID: -1,
      unitOfMeasure: this.form.unitOfMeasure,
      productCode: this.form.productCode,
      value: this.form.value,
    });
  }

}
