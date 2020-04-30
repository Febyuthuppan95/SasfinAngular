import { Component, OnInit } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-view-quarter-supply-list',
  templateUrl: './view-quarter-supply-list.component.html',
  styleUrls: ['./view-quarter-supply-list.component.scss']
})
export class ViewQuarterSupplyListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export class OEMQuarterSupply {
  rowNum: number;
  companyOEMQuarterSupplyID: number;
  productCode: string;
  productDescription: string;
  quantity: string;
}

export class OEMQuarterSupplyList {
  list: OEMQuarterSupply[];
  rowCount: number;
  outcome: Outcome;
}
