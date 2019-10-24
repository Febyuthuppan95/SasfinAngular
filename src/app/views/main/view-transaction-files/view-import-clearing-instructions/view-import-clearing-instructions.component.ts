import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TableConfig, TableHeader, Order, SelectedRecord } from 'src/app/models/Table';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { ICIListResponse, ICI } from 'src/app/models/HttpResponses/ICI';
import { CompanyService } from 'src/app/services/Company.Service';
import { ValidateService } from 'src/app/services/Validation.Service';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

@Component({
  selector: 'app-view-import-clearing-instructions',
  templateUrl: './view-import-clearing-instructions.component.html',
  styleUrls: ['./view-import-clearing-instructions.component.scss']
})
export class ViewImportClearingInstructionsComponent implements OnInit {
  constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
              private captureService: CaptureService, private companyService: CompanyService, private validateService: ValidateService) { }

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
    fileName: null,
    waybillNo: null,
    supplierRef: null,
    importersCode: null,
    userID: this.currentUser.userID,
    transactionID: -1,
    company: null
  };

  updateRequest = {
    fileName: null,
    waybillNo: null,
    supplierRef: null,
    importersCode: null,
    userID: this.currentUser.userID,
    transactionID: -1,
    company: null,
    specificICIID: -1
  };


  preview: string = null;
  fileToUpload: File = null;
  selectedIndex: number;
  currentRecord: ICI;

  contextMenuX: number;
  contextMenuY: number;
  contextMenu: boolean;

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  @ViewChild('openAddModal', { static: false})
  private openAddModal: ElementRef;
  @ViewChild('closeAddModal', { static: false})
  private closeAddModal: ElementRef;

  @ViewChild('openEditModal', { static: false})
  private openEditModal: ElementRef;
  @ViewChild('closeEditModal', { static: false})
  private closeEditModal: ElementRef;

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

    this.companyService.observeCompany().subscribe(data => {
      this.addRequest.company = data.companyName;
    });
  }

  loadDataset() {
    this.captureService.iciList(this.listRequest).then(
      (res: ICIListResponse) => {
        this.tableConfig.dataset = res.clearingInstructions;

        if (res.clearingInstructions.length === 0) {
          this.notify.toastrwarning(res.outcome.outcome, res.outcome.outcomeMessage);
        } else {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  onFileChange(file: FileList) {
    this.fileToUpload = file.item(0);
    this.preview = file.item(0).name;
  }

  addICIModal() {
    this.preview = null;
    this.addRequest.fileName = null;
    this.addRequest.importersCode = null;
    this.addRequest.supplierRef = null;
    this.addRequest.waybillNo = null;
    this.openAddModal.nativeElement.click();
  }

  addICI() {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('requestModel', JSON.stringify(this.addRequest));

      this.captureService.iciAdd(formData).then(
        (res: Outcome) => {
          this.closeAddModal.nativeElement.click();
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadDataset();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
  }

  editICIModal() {
    this.preview = null;
    this.updateRequest.fileName = null;
    this.updateRequest.importersCode = null;
    this.updateRequest.supplierRef = null;
    this.updateRequest.waybillNo = null;
    this.openEditModal.nativeElement.click();
  }

  editICI() {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('requestModel', JSON.stringify(this.addRequest));

      this.captureService.iciUpdate(formData).then(
        (res: Outcome) => {
          this.closeAddModal.nativeElement.click();
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadDataset();
        },
        (msg) => {
          this.notify.errorsmsg('Failure', 'Cannot reach server');
        }
      );
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.listRequest.rowStart = $event.rowStart;
    this.listRequest.rowEnd = $event.rowEnd;
    this.loadDataset();
  }

  orderChange($event: Order) {
    this.listRequest.orderBy = $event.orderBy;
    this.listRequest.orderDirection = $event.orderByDirection;
    this.listRequest.rowStart = 1;
    this.listRequest.rowEnd = this.tableConfig.recordsPerPage;
    this.loadDataset();
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedIndex = obj.index;
    this.currentRecord = obj.record;
    this.popClick(obj.event);
  }

  popClick(event) {
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(true);
    this.contextMenu = true;
  }

  popOff() {
    this.contextMenu = false;
    this.selectedIndex = -1;
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.tableConfig.recordsPerPage = recordsPerPage;
    this.listRequest.rowStart = 1;
    this.loadDataset();
  }

  searchEvent(query: string) {
    this.listRequest.filter = query;
    this.loadDataset();
  }
}
