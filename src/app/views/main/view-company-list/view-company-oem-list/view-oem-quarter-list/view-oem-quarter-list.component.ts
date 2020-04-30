import { Component, OnInit } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-view-oem-quarter-list',
  templateUrl: './view-oem-quarter-list.component.html',
  styleUrls: ['./view-oem-quarter-list.component.scss']
})
export class ViewOemQuarterListComponent implements OnInit {

  constructor() { }
quarters = [
  {value: 1 ,Name: 'Q1'},
  {value: 2 ,Name: 'Q2'},
  {value: 3 ,Name: 'Q3'},
  {value: 4 ,Name: 'Q4'}
];
years = [];
now = new Date().getFullYear();

focusPeriodYear: number;
focusPeriodQuarter: number;
  ngOnInit() {
    this.createYears();
  }
createYears() {
  for (var x =0; x < 10; x++) {
    this.years.push(this.now - x);
  }
}
periodYear(year: number) {
  this.focusPeriodYear = year;
}
periodQuarter(quarterID: number) {
  this.focusPeriodQuarter = quarterID;
}
}

export class CompanyOEMQuarter {
  rowNum: number;
  companyOEMQuarterID: number;
  quarterID: number;
  periodYear: number;
}
export class CompamyOEMQuartersList {
  list: CompanyOEMQuarter[];
  rowCount: number;
  outcome: Outcome;
}
