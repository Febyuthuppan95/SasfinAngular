import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { ValidateService } from 'src/app/services/Validation.Service';
import { TableConfig } from 'src/app/models/Table';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { SAD500ListResponse } from 'src/app/models/HttpResponses/SAD500Get';

@Component({
  selector: 'app-view-sad500',
  templateUrl: './view-sad500.component.html',
  styleUrls: ['./view-sad500.component.scss']
})
export class ViewSAD500Component implements OnInit {
  constructor(private themeService: ThemeService, private transactionService: TransactionService, private userService: UserService,
              private captureService: CaptureService, private companyService: CompanyService, private validateService: ValidateService) { }

  currentTheme: string;
  currentUser = this.userService.getCurrentUser();
  showLoader: boolean;

  // Data Table Configuration
  tableConfig: TableConfig = {
    header:  {
      title: 'SAD500s',
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
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'Serial No', propertyName: 'serialNo', order: { enable: false } },
      { title: 'Total Customs Value', propertyName: 'totalCustomsValue', order: { enable: false } },
      { title: 'Waybill No', propertyName: 'waybillNo', order: { enable: false } },
      { title: 'PCC', propertyName: 'pcc', order: { enable: false } },
      { title: 'LRN', propertyName: 'mrn', order: { enable: false } },
      { title: 'MRN', propertyName: 'lrn', order: { enable: false } },
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
    sad500ID: -1,
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

  preview: string = null;
  fileToUpload: File = null;

  @ViewChild(NotificationComponent, { static: false})
  private notify: NotificationComponent;

  @ViewChild('openAddModal', { static: false})
  private openAddModal: ElementRef;

  @ViewChild('closeAddModal', { static: false})
  private closeAddModal: ElementRef;

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
    this.captureService.sad500List(this.listRequest).then(
      (res: SAD500ListResponse) => {
        this.tableConfig.dataset = res.sad500s;

        if (res.sad500s.length === 0) {
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


}
