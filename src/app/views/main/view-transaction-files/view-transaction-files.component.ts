import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { TransactionFileListResponse, TransactionFile } from 'src/app/models/HttpResponses/TransactionFileListModel';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-transaction-files',
  templateUrl: './view-transaction-files.component.html',
  styleUrls: ['./view-transaction-files.component.scss']
})
export class ViewTransactionFilesComponent implements OnInit, OnDestroy {

  constructor(
    private transationService: TransactionService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.activePage = +1;
    this.prevPageState = true;
    this.nextPageState = false;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;
    this.filter = '';
    this.orderBy = 'Name';
    this.orderDirection = 'ASC';
    this.totalShowing = 0;
    this.rowCount = 0;
  }

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: false })
  closeModal: ElementRef;

  @ViewChild('inputFile', { static: false })
  inputFile: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: TransactionFileListResponse;
  dataList: TransactionFile[] = [];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  focusPath: string;
  disableAttachmentType: boolean;
  attachmentTypeIndex: number;
  preview: string;
  selectAttachmentType = new FormControl();

  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords: number;
  activePage: number;

  focusHelp: number;
  focusHelpName: string;
  focusDescription: string;
  focusStatusID: number;
  focusType: string;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  transactionID: number;

  transactionTypes = [
    { name: 'ICI', value: 1 },
    { name: 'SAD500', value: 2 },
    { name: 'PACKING', value: 3 },
    { name: 'CUSRELEASE', value: 4 },
    { name: 'VOC', value: 5 },
  ];
  attachmentName: string;
  attachmentQueue: { name?: string, type?: string, file: File, uploading?: boolean, status?: string }[] = [];
  attachmentQueueDisplay: { name?: string, type?: string, file: File, uploading?: boolean, status?: string }[] = [];
  selectedTransactionType: number;
  fileToUpload: File;
  currentAttachment = 0;
  uploading = false;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(params => {
      this.transactionID = +params.get('id');
    });

    this.transationService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if (data !== null || data !== undefined) {
        this.transactionID = data.transactionID;
      }
    });

    this.loadAttachments();
  }


  paginateData() {

    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();
      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;
      rowStart = +rowEnd + 1;
      rowEnd += +this.rowCountPerPage;
    }

    this.updatePagination();
  }

  pageChange(pageNumber: number) {
    const page = this.pages[+pageNumber - 1];
    this.rowStart = page.rowStart;
    this.rowEnd = page.rowEnd;
    this.activePage = +pageNumber;
    this.prevPage = +this.activePage - 1;
    this.nextPage = +this.activePage + 1;

    if (this.prevPage < 1) {
      this.prevPageState = true;
    } else {
      this.prevPageState = false;
    }

    let pagenumber = +this.rowCount / +this.rowCountPerPage;
    const mod = +this.rowCount % +this.rowCountPerPage;

    if (mod > 0) {
      pagenumber++;
    }

    if (this.nextPage > pagenumber) {
      this.nextPageState = true;
    } else {
      this.nextPageState = false;
    }

    this.updatePagination();

    this.loadAttachments();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadAttachments();
  }

  loadAttachments() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificTransactionID: this.transactionID,
      specificAttachmentID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.transationService
      .listAttatchments(model)
      .then(
        (res: TransactionFileListResponse) => {
          if (res.outcome.outcome === 'FAILURE') {
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          } else {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }

          this.dataList = res.attachments;

          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.rowCount = res.rowCount ;
            this.dataset = res;
            this.showingRecords = res.attachments.length;
            this.showLoader = false;
            this.totalShowing = +this.rowStart + +this.dataList.length - 1;
            this.paginateData();
          }
        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
        }
      );
  }

  updateSort(orderBy: string) {
    if (this.orderBy === orderBy) {
      if (this.orderDirection === 'ASC') {
        this.orderDirection = 'DESC';
      } else {
        this.orderDirection = 'ASC';
      }
    } else {
      this.orderDirection = 'ASC';
    }

    this.orderBy = orderBy;
    this.orderIndicator = `${this.orderBy}_${this.orderDirection}`;
    this.loadAttachments();
  }

  updatePagination() {
    if (this.dataset.attachments.length <= this.totalShowing) {
      this.prevPageState = false;
      this.nextPageState = false;
    } else {
      this.showingPages = Array<Pagination>();
      this.showingPages[0] = this.pages[this.activePage - 1];
      const pagenumber = +this.rowCount / +this.rowCountPerPage;

      if (this.activePage < pagenumber) {
        this.showingPages[1] = this.pages[+this.activePage];

        if (this.showingPages[1] === undefined) {
          const page = new Pagination();
          page.page = 1;
          page.rowStart = 1;
          page.rowEnd = this.rowEnd;
          this.showingPages[1] = page;
        }
      }

      if (+this.activePage + 1 <= pagenumber) {
        this.showingPages[2] = this.pages[+this.activePage + 1];
      }
    }

  }

  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  popClick(event, id, fileName, statusID, doctype?) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusHelp = id;
    this.focusPath = fileName;
    this.focusStatusID = statusID;
    this.focusType = doctype;

    if (!this.contextMenu) {
      this.themeService.toggleContextMenu(true);
      this.contextMenu = true;
    } else {
      this.themeService.toggleContextMenu(false);
      this.contextMenu = false;
    }
  }

  popOff() {
    this.contextMenu = false;
    this.selectedRow = -1;
  }
  setClickedRow(index) {
    this.selectedRow = index;
  }

  backToCompanies() {
    this.router.navigate(['companies', 'transactions']);
  }

  uploadAttachments() {
    this.uploading = true;
    this.attachmentQueue.forEach((attach, index) => {
      attach.status = 'Uploading';
      attach.uploading = false;

      this.transationService.uploadAttachment(
        attach.name,
        attach.file,
        attach.type,
        this.transactionID,
        this.currentUser.userID,
        'The Boring Company' // Change to company name
      ).then(
        (res) => {
            attach.uploading = false;
            attach.status = 'Complete';
            this.loadAttachments();
            this.attachmentQueue.splice(index, 1);
            this.attachmentQueueDisplay.splice(index, 1);
            this.preview = null;
            this.attachmentName = null;
            this.selectAttachmentType.reset(-1);

        },
        (msg) => {
          attach.uploading = false;
          attach.status = 'Failed to upload';
      }
      );
    });
  }

  upload() {
    this.attachmentName = null;
    this.attachmentTypeIndex = 0;
    this.currentAttachment = 0;
    this.attachmentQueue = [];
    this.attachmentQueueDisplay = [];
    this.selectAttachmentType.reset(-1);
    this.inputFile.nativeElement.value = '';
    console.log(this.inputFile.nativeElement.files);
    this.openModal.nativeElement.click();
  }

  onFileChange(files: FileList) {
    this.preview = files.item(0).name;

    this.attachmentQueue[this.currentAttachment] = {
      file: files.item(0),
    };
  }

  onTypeSelect(id: number) {
    this.selectedTransactionType = id;
    this.disableAttachmentType = true;
  }

  addToQueue() {
    let errors = 0;

    if (this.attachmentName === '' || this.attachmentName === null || this.attachmentName === undefined) {
      errors++;
      this.notify.toastrwarning('Warning', 'Enter attachment name');
    } else if (this.transactionTypes[this.selectedTransactionType - 1] === undefined) {
      errors++;
      this.notify.toastrwarning('Warning', 'Please select an attachment type');
    }

    if (errors === 0) {
      this.attachmentQueue[this.currentAttachment].name = this.attachmentName;
      this.attachmentQueue[this.currentAttachment].type = this.transactionTypes[this.selectedTransactionType - 1].name;
      this.attachmentQueue[this.currentAttachment].uploading = false;
      this.attachmentQueue[this.currentAttachment].status = 'Pending Upload';

      this.attachmentQueueDisplay[this.currentAttachment] = this.attachmentQueue[this.currentAttachment];

      this.attachmentName = '';
      this.selectedTransactionType = - 1;
      this.currentAttachment++;
      this.disableAttachmentType = false;
      this.attachmentTypeIndex = 0;
      this.preview = null;
      this.attachmentTypeIndex = 0;
      this.selectAttachmentType.reset(-1);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
