import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TableHeader, TableHeading, SelectedRecord } from 'src/app/models/Table';
import { ThemeService } from 'src/app/services/theme.Service';
import { CaptureService } from 'src/app/services/capture.service';
import { environment } from 'src/environments/environment';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { SAD500LineUpdateModel } from 'src/app/models/HttpRequests/SAD500Line';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { UserService } from 'src/app/services/user.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sad500-lines',
  templateUrl: './sad500-lines.component.html',
  styleUrls: ['./sad500-lines.component.scss']
})
export class Sad500LinesComponent implements OnInit, OnDestroy {

  constructor(private themeService: ThemeService, private captureService: CaptureService,
              private transactionService: TransactionService, private router: Router, private userService: UserService) { }

  currentTheme: string;

  @ViewChild('closeAddModal', { static: false })
  closeAddModal: ElementRef;

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
  currentUser = this.userService.getCurrentUser();

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
    { title: 'Customs Value', propertyName: 'customsValue', order: { enable: true, tag: 'CustomsValue' } },
    { title: 'Line No', propertyName: 'lineNo', order: { enable: true, tag: 'LineNo' } },
    { title: 'Unit Of Measure', propertyName: 'unitOfMeasure', order: { enable: true, tag: 'UnitOfMeasure' } },
    // { title: 'Quantity', propertyName: 'quantity', order: { enable: true, tag: 'Quantity' } },
    // { title: 'Previous Declaration', propertyName: 'previousDeclaration', order: { enable: true, tag: 'PreviousDeclaration' } },
  ];

  private unsubscribe$ = new Subject<void>();

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('closeDeleteModal', { static: false })
  private closeDeleteModal: ElementRef;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(theme => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe (obj => {
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
    // alert('row click');
  }

  update(obj: SAD500Line) {
      const requestModel: SAD500LineUpdateModel = {
        userID: this.currentUser.userID,
        sad500ID: this.attachmentID,
        specificSAD500LineID: obj.sad500LineID,
        // unitOfMeasure: obj.unitOfMeasure,
        unitOfMeasureID: obj.unitOfMeasureID,
        // tariff: obj.tariff,
        tariffID: obj.tariffID,
        quantity: obj.quantity,
        customsValue: obj.customsValue,
        isDeleted: 0,
        lineNo: obj.lineNo,
        cooID: -1,
        supplyUnit: ''
      };

      this.captureService.sad500LineUpdate(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.closeAddModal.nativeElement.click();
            this.loadDataset();
          } else {
            this.notify.errorsmsg(res.outcome, res.outcomeMessage);
          }
        },
        (msg) => {
          this.notify.errorsmsg('Failure', 'Something went wrong');
        }
      );
    }

    delete(obj: SAD500Line) {
      const requestModel: SAD500LineUpdateModel = {
        userID: this.currentUser.userID,
        sad500ID: this.attachmentID,
        specificSAD500LineID: obj.sad500LineID,
        // unitOfMeasure: obj.unitOfMeasure,
        unitOfMeasureID: obj.unitOfMeasureID,
        // tariff: obj.tariff,
        tariffID: obj.tariffID,
        quantity: obj.quantity,
        customsValue: obj.customsValue,
        isDeleted: 1,
        lineNo: obj.lineNo,
        cooID: -1,
        supplyUnit: ''
      };

      this.captureService.sad500LineUpdate(requestModel).then(
        (res: Outcome) => {
          if (res.outcome === 'SUCCESS') {
            this.closeDeleteModal.nativeElement.click();
            this.loadDataset();
          } else {

          }
        },
        (msg) => {
        }
      );
    }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
