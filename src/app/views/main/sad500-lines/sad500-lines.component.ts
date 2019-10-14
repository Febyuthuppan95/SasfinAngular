import { Component, OnInit } from '@angular/core';
import { TableHeader, TableHeading, SelectedRecord } from 'src/app/models/Table';
import { ThemeService } from 'src/app/services/theme.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { environment } from 'src/environments/environment';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sad500-lines',
  templateUrl: './sad500-lines.component.html',
  styleUrls: ['./sad500-lines.component.scss']
})
export class Sad500LinesComponent implements OnInit {

  constructor(private themeService: ThemeService, private captureService: CaptureService,
              private transactionService: TransactionService, private router: Router) { }

  currentTheme: string;

  dataset: object[];
  rowStart = 1;
  rowEnd = 15;
  rowCount: number;
  orderBy: string;
  orderByDirection: string;
  displayRecords = 15;
  showLoader: boolean;
  attachmentID: number;
  contextMenuEnable = false;
  recordIndex: number = -1;

  contextMenuX: number;
  contextMenuY: number;
  currentRecord: SAD500Line = null;

  tableHeader: TableHeader = {
    title: 'SAD500 - Lines',
    addButton: {
     enable: false,
    },
    backButton: {
      enable: true
    },
    filters: {
      search: true,
      selectRowCount: true,
    }
  };

  tableHeadings: TableHeading[] = [
    { title: '', propertyName: 'rowNum', order: { enable: false, } },
    { title: 'Tariff', propertyName: 'tariff', order: { enable: true, tag: 'Tariff' } },
    { title: 'CPC', propertyName: 'cpc', order: { enable: true, tag: 'Tariff' } },
    { title: 'Customs Value', propertyName: 'customsValue', order: { enable: true, tag: 'Tariff' } },
    { title: 'Line No', propertyName: 'lineNo', order: { enable: true, tag: 'Tariff' } },
    { title: 'Unit Of Measure', propertyName: 'unitOfMeasure', order: { enable: true, tag: 'Tariff' } },
    { title: 'ProductCode', propertyName: 'productCode', order: { enable: true, tag: 'Tariff' } },
    { title: 'Value', propertyName: 'value', order: { enable: true, tag: 'Tariff' } },
  ];

  ngOnInit() {
    this.themeService.observeTheme().subscribe(theme => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment().subscribe (obj => {
      this.attachmentID = obj.attachmentID;

      this.loadDataset();
    });
  }

  loadDataset() {
    this.captureService.sad500LineList({ userID: 3, sad500ID: this.attachmentID, specificSAD500LineID: -1 }).then(
      (res: SPSAD500LineList) => {
        this.dataset = res.lines;
      },
      (msg) => {
        if (!environment.production) {
          console.log(msg);
        }
      }
    );
  }

  back() {
    this.router.navigate(['transaction', 'attachments']);
  }

  selectedRecord($event: SelectedRecord) {
    this.contextMenuX = $event.event.clientX + 3;
    this.contextMenuY = $event.event.clientY + 5;
    this.contextMenuEnable = true;
    this.currentRecord = $event.record;
  }
}
