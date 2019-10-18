import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableConfig, TableHeader } from 'src/app/models/Table';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';

@Component({
  selector: 'app-view-import-clearing-instructions',
  templateUrl: './view-import-clearing-instructions.component.html',
  styleUrls: ['./view-import-clearing-instructions.component.scss']
})
export class ViewImportClearingInstructionsComponent implements OnInit {
  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'Import Clearing Instruction',
      addButton: {
       enable: true,
      },
      backButton: {
        enable: true
      },
      filters: {
        search: true,
        selectRowCount: true,
      }
    },
    headings: [
      { title: '', propertyName: 'rowNum', order: { enable: false } },
      { title: 'Supplier Ref', propertyName: 'supplierRef', order: { enable: false } },
      { title: 'Importers Code', propertyName: 'importersCode', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'Status', propertyName: 'status', order: { enable: false } }
    ],
    rowStart: 1,
    rowEnd: 15,
    recordsPerPage: 15,
    orderBy: '',
    orderByDirection: '',
    dataset: null
  };

  constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
              private captureService: CaptureService) { }

  listRequest = {
    userID: this.currentUser.userID,
    specificICIID: -1,
    filter: '',
    rowStart: this.tableConfig.rowStart,
    rowEnd: this.tableConfig.rowEnd,
    orderBy: '',
    orderDirection: 'ASC',
    transactionID: -1,
  };

  addRequest = {
    file: null,
    waybillNo: null,
    supplierRef: null,
    importersCode: null,
    userID: this.currentUser.userID,
    transactionID: -1,
  };

  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment().subscribe(data => {
      if (data.transactionID !== undefined) {
        this.listRequest.transactionID = data.transactionID;
        this.addRequest.transactionID = data.transactionID;
        this.loadDataset();
      }
    });
  }

  loadDataset() {
    this.captureService.iciList(this.listRequest).then(
      (res: ICIListResponse) => {
        this.tableConfig.dataset = res.clearingInstructions;
        console.log(res);
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  addICI() {

  }

}
