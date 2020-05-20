import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { Export, Import } from '../view-company-service-claims.component';
import { TableHeading } from 'src/app/models/Table';

@Component({
  selector: 'app-view-company-service-claim-data',
  templateUrl: './view-company-service-claim-data.component.html',
  styleUrls: ['./view-company-service-claim-data.component.scss']
})
export class ViewCompanyServiceClaimDataComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private themeService: ThemeService,
    private userService: UserService

  ) { }

  columnsToDisplay = ["rowNum", "itemName", "itemID"];
  data: Import[] = [];
  dataLines: Export[] = []
  headings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'Item Name',
      propertyName: 'itemName',
      order: {
        enable: true,
        tag: 'ItemName'
      }
    },
    {
      title: 'Item ID',
      propertyName: 'itemID',
      order: {
        enable: true,
        tag: 'ItemID'
      }
    }
  ];
  ngOnInit() {
    this.dataLines.push(
      {
        rowNum: 1,
        itemID: 2,
        prodName: "Prod 1",
        expQuantity: 200,
        totQuantity: 300,
        quantityPer: 2,
        cjid: 3,
        availExportQuantity: 100,
        exportDate: new Date(),
        mrn: "mrn - 2-00200020-pp"
      },
      {
        rowNum: 1,
        itemID: 2,
        prodName: "Prod 1",
        expQuantity: 200,
        totQuantity: 300,
        quantityPer: 2,
        cjid: 3,
        availExportQuantity: 100,
        exportDate: new Date(),
        mrn: "mrn - 2-00200020-pp"
      },
      {
        rowNum: 1,
        itemID: 2,
        prodName: "Prod 1",
        expQuantity: 200,
        totQuantity: 300,
        quantityPer: 2,
        cjid: 3,
        availExportQuantity: 100,
        exportDate: new Date(),
        mrn: "mrn - 2-00200020-pp"
      },{
        rowNum: 1,
        itemID: 2,
        prodName: "Prod 1",
        expQuantity: 200,
        totQuantity: 300,
        quantityPer: 2,
        cjid: 3,
        availExportQuantity: 100,
        exportDate: new Date(),
        mrn: "mrn - 2-00200020-pp"
      }
    );
    this.data.push(
      {
        rowNum: 1,
        itemID: 2,
        itemName: 2,
        cjid: 3,
        totDuty: 2,
        exportQuantity: 200,
        totalShortfallQuantity: 50,
        totHSQuantity: 150,
        availDuty: 20,
        importDate: new Date()
      },
      {
        rowNum: 1,
        itemID: 2,
        itemName: 2,
        cjid: 3,
        totDuty: 2,
        exportQuantity: 200,
        totalShortfallQuantity: 50,
        totHSQuantity: 150,
        availDuty: 20,
        importDate: new Date()
      },
      {
        rowNum: 1,
        itemID: 2,
        itemName: 2,
        cjid: 3,
        totDuty: 2,
        exportQuantity: 200,
        totalShortfallQuantity: 50,
        totHSQuantity: 150,
        availDuty: 20,
        importDate: new Date()
      },
      {
        rowNum: 1,
        itemID: 2,
        itemName: 2,
        cjid: 3,
        totDuty: 2,
        exportQuantity: 200,
        totalShortfallQuantity: 50,
        totHSQuantity: 150,
        availDuty: 20,
        importDate: new Date()
      }
    );
    
  }

}
