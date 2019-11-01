import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { CaptureInfoResponse } from 'src/app/models/HttpResponses/ListCaptureInfo';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { Router } from '@angular/router';
import { DoctypeListResponse } from 'src/app/models/HttpResponses/DoctypeResponse';
import { TableHeading, SelectedRecord, TableHeader } from 'src/app/models/Table';
import { stringify } from '@angular/compiler/src/util';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-capture-info',
  templateUrl: './view-capture-info.component.html',
  styleUrls: ['./view-capture-info.component.scss']
})
export class ViewCaptureInfoComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private transactionService: TransactionService,
    private router: Router) {}

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openEditModal', { static: true })
  private openEditModal: ElementRef;

  @ViewChild('closeEditModal', { static: true })
  private closeEditModal: ElementRef;

  @ViewChild('openAddModal', { static: true })
  private openAddModal: ElementRef;

  @ViewChild('closeAddModal', { static: true })
  private closeAddModal: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  private unsubscribe$ = new Subject<void>();

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  dataset: CaptureInfoResponse;
  recordsPerPage = 15;

  noData = false;
  showLoader = true;
  displayFilter = false;
  orderIndicator: string;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  showedSuccess: boolean;

  doctypeSelectedIndex: number;

  captureInfo: {
    captureInfoID: number,
    info: string,
  };

  company: {
    id: number,
    name: string,
  };

  requestModel = {
    userID: this.currentUser.userID,
    companyID: -1,
    doctypeID: -1,
    specificCaptureInfoID: -1,
    filter: '',
    orderBy: 'Info',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15,
  };

  requestModelAddInfo = {
    userID: this.currentUser.userID,
    companyID: -1,
    doctypeID: -1,
    info: ''
  };

  requestModelDoctypeList = {
    userID: this.currentUser.userID,
    specificDoctypeID: -1,
    filter: '',
    orderBy: '',
    orderByDirection: '',
    rowStart: 1,
    rowEnd: 15,
  };

  doctypeResponse: DoctypeListResponse;

  tableData = null;
  tableHeadings: TableHeading[] = [
    { title: '#', propertyName: 'rowNum', order: { enable: true } },
    { title: 'Information', propertyName: 'info', order: { enable: true, tag: 'Info' } },
    { title: 'Type', propertyName: 'doctype', order: { enable: true, tag: 'Type' } },
  ];

  tableHeader: TableHeader = {
    title: 'Capture Info',
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
  };

  ngOnInit() {
    this.showedSuccess = false;
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: SelectedCompany) => {
      this.company = {
        id: data.companyID,
        name: data.companyName
      };

      this.requestModelAddInfo.companyID = data.companyID;
      this.requestModel.companyID = data.companyID;
      this.loadDataset();
    });

    this.captureInfo = {
      captureInfoID: -1,
      info: ''
    };

    this.loadDoctypes();
  }

  searchEvent(query: string) {
    this.requestModel.filter = query;
    this.loadDataset();
  }


  loadDataset() {
    this.showLoader = true;

    this.transactionService.captureInfo(this.requestModel).then(
      (res: CaptureInfoResponse) => {
        this.showLoader = false;

        if (res.outcome.outcome === 'SUCCESS') {
          if (!this.showedSuccess) {
            this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            this.showedSuccess = true;
            this.tableData = res.captureInfo;
          }
          this.tableData = res.captureInfo;
          this.dataset = res;
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.showedSuccess = false;
          this.tableData = [];
        }
      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg('Failure', 'Bad request');
      }
    );
  }

  updateSort(orderBy: string) {
    if (this.requestModel.orderBy === orderBy) {
      if (this.requestModel.orderByDirection === 'ASC') {
        this.requestModel.orderByDirection = 'DESC';
      } else {
        this.requestModel.orderByDirection = 'ASC';
      }
    } else {
      this.requestModel.orderByDirection = 'ASC';
    }
    this.requestModel.orderBy = orderBy;
    this.orderIndicator = `${this.requestModel.orderBy}_${this.requestModel.orderByDirection}`;
    this.loadDataset();
  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, obj) {
    this.captureInfo = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.captureInfo = obj.record;
    this.popClick(obj.event, obj.record);
  }

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.requestModel.rowStart = $event.rowStart;
    this.requestModel.rowEnd = $event.rowEnd;
    this.loadDataset();
  }

  editCaptureInfo() {
    this.openEditModal.nativeElement.click();
  }

  editInfo() {
    const requestModel = {
      userID: this.currentUser.userID,
      captureID: this.captureInfo.captureInfoID,
      info: this.captureInfo.info
    };

    this.transactionService.captureInfoUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.loadDataset();
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.closeEditModal.nativeElement.click();
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot reach server');
      }
    );
  }

  // selectedRowChange(selectedRecord: SelectedRecord) {
  //   alert(selectedRecord.record.id);
  //   this.selectedRow = selectedRecord.index;
  //   this.captureInfo = selectedRecord.record;
  // }

  backToAttachments() {
    this.router.navigate(['companies']);
  }

  addCaptureInfoModal() {
    this.doctypeSelectedIndex = 0;
    this.requestModelAddInfo.info = null;
    this.requestModelAddInfo.doctypeID = -1;
    this.openAddModal.nativeElement.click();
  }

  addCapture() {
    this.transactionService.captureInfoAdd(this.requestModelAddInfo).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadDataset();
          this.closeAddModal.nativeElement.click();
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot Reach Server');
      }
    );
  }

  onDoctypeChange(id: number) {
    this.requestModelAddInfo.doctypeID = id;
  }

  loadDoctypes() {
    this.transactionService.doctypeList(this.requestModelDoctypeList).then(
      (res: DoctypeListResponse) => {
          this.doctypeResponse = res;
      },
      (msg) => {
        this.notify.errorsmsg('Failure', 'Cannot Reach Server');
      }
    );
  }

  backToCompanies() {
    this.router.navigate(['companies']);
  }

  removeCapture(id: number) {
    const requestModel = {
      userID: this.currentUser.userID,
      captureID: this.captureInfo.captureInfoID,
      isDeleted: 1,
      info: this.captureInfo.info,
    };

    this.transactionService.captureInfoUpdate(requestModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.loadDataset();
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
