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
import { CaptureService } from 'src/app/services/capture.service';
import { SAD500ListResponse, SAD500Get } from 'src/app/models/HttpResponses/SAD500Get';
import { SPSAD500LineList, SAD500Line } from 'src/app/models/HttpResponses/SAD500Line';
import { SelectedCompany, CompanyService } from 'src/app/services/Company.Service';
import { SplitDocumentComponent } from 'src/app/components/split-document/split-document.component';
import { ApiService } from 'src/app/services/api.service';
import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveAttachmentComponent } from 'src/app/components/menus/context-menu-transaction-attachment/dialog-remove-attachment/dialog-remove-attachment.component';
import { DialogConfirmationComponent } from './linking-lines/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-view-transaction-files',
  templateUrl: './view-transaction-files.component.html',
  styleUrls: ['./view-transaction-files.component.scss']
})
export class ViewTransactionFilesComponent implements OnInit, OnDestroy {
  fileReader: FileReader;
  filePreview: any;

  constructor(
    private transationService: TransactionService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private captureService: CaptureService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    private apiService: ApiService

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

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: false })
  closeModal: ElementRef;

  @ViewChild('openPreview', {static: true})
  openPreview: ElementRef;

  @ViewChild('closePreview', {static: true})
  closePreview: ElementRef;

  @ViewChild('inputFile', { static: false })
  inputFile: ElementRef;

  public currentPDFIndex: number;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: TransactionFileListResponse;
  dataList: TransactionFile[] = [];
  sad500DataList: TransactionFile[] = [];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  focusPath: string;
  focusFileType: number;
  disableAttachmentType: boolean;
  disableSAD500: boolean;
  disableSAD500Lines: boolean;
  attachmentTypeIndex: number;
  sad500Index: number;
  sad500LineIndex: number;

  preview: string;
  selectAttachmentType = new FormControl();
  selectSAD500Control = new FormControl();
  selectSAD500LinesControl = new FormControl();
  sad500s: SAD500Get[] = [];
  sad500Line: SAD500Line[] = [];

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
  focusReason: string;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  transactionID: number;
  transactionName: string;

  transactionTypes = [];
  attachmentName: string;
  // tslint:disable-next-line: max-line-length
  attachmentQueue: { name?: string, type?: string, file: File[], uploading?: boolean, status?: string, sad500ID?: number, ediStatusID?: number }[] = [];
  // tslint:disable-next-line: max-line-length
  attachmentQueueDisplay: { name?: string, type?: string, file: File[], uploading?: boolean, status?: string, sad500LineID?: number, ediStatusID?: number }[] = [];
  selectedTransactionType: number;
  selectedSAD500: number;
  selectedSAD500Line: number;
  fileToUpload: File[];
  transactionType: string;
  currentAttachment = 0;
  uploading = false;
  isVOC = false;
  companyName: string;

  selectEDIControl = new FormControl(0);
  selectedEDIIndex = 0;
  ediDisable: boolean;
  ediStatuses: any[] = [];
  docType = '';

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    // console.log(this.attachmentQueueDisplay);
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
      console.log(data);
      if (data !== null || data !== undefined) {
        this.transactionID = data.transactionID;
        this.transactionType = data.transactionType;
        this.docType = data.docType;
        this.transactionName = data.transactionName;

      }
    });

    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      if (obj !== null || obj !== undefined) {
        this.companyName = obj.companyName;
      }
    });

    this.loadAttachments();
    this.initTypes();
    this.loadEDIStatuses();
  }

  onEDIChange() {
    this.ediDisable = true;
  }

  loadEDIStatuses() {
    this.captureService.ediStatusList({}).then(
      (res: any) => {
        this.ediStatuses = res.data;
        // console.log(this.ediStatuses[0]);
      }
    );
  }

  initTypes() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        transactionID: this.transactionID
      },
      requestProcedure: 'DoctypesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: any) => {
        res.data.forEach(x => {
          this.transactionTypes.push({
            name: x.Name,
            description: x.Description,
            value: x.FileTypeID
          });
        });
      }
    );
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
           console.log(res);
          if (res.outcome.outcome === 'SUCCESS') {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          } else {
            this.notify.errorsmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage
            );
          }
          const pre_processed = res.attachments;
          pre_processed.forEach((item) => {
            item.dateCreated = new Date(item.dateCreated).toString();
            item.dateEdited = item.dateEdited === null ? null : new Date(item.dateEdited).toLocaleString();
          });

          this.dataList = pre_processed;

          if (this.transactionType === 'Export') {
            this.dataList.forEach((item) => {
                if (item.fileType === 'Import Clearing Instruction') {
                  item.fileType = 'Export Clearing Instruction';
                }
            });
          }

          this.sad500DataList = this.dataList.filter(x => x.fileType === 'SAD500');

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
    if (this.rowCount <= this.rowCountPerPage) {
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

  popClick(event, id, fileName, statusID, doctype?, fileTypeID?, reason?) {

     console.log(doctype);
     console.log(fileTypeID);

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
    this.focusFileType = fileTypeID;
    this.focusReason = reason;
    const type = this.transactionTypes.find(x => x.value === fileTypeID);

    if (type) {
      this.focusType = type.name;

      if (!this.contextMenu) {
        this.themeService.toggleContextMenu(true);
        this.contextMenu = true;
      } else {
        this.themeService.toggleContextMenu(false);
        this.contextMenu = false;
      }
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
    if (this.attachmentQueue.length !== 0) {
      this.iterateAttachments(0);
    } else {
      this.uploading = false;
    }
  }

  iterateAttachments(index) {
    console.log('uploading attachment index');
    console.log(index);
    console.log(this.attachmentQueue.length);
    if (index < this.attachmentQueue.length) {
      this.uploading = true;
      this.uploadAttach(index, this.attachmentQueue[index]);
    } else {
      this.uploading = false;
      this.resetUpload();
    }
  }

  uploadAttach(index, attach) {
    attach.status = 'Uploading';
    attach.uploading = false;
    console.log('uploading attachment');
    console.log(attach);
    this.transationService.uploadAttachment(
      attach.name,
      attach.file,
      attach.type,
      this.transactionID,
      this.currentUser.userID,
      this.companyName,
      attach.sad500ID,
      attach.ediStatusID
    ).then(
      (res: any) => {
        if (res != 200) {
          this.notify.errorsmsg(
            'ERROR',
            'Failed to upload document'
          );
        }

        attach.uploading = false;
        attach.status = 'Complete';
        index++;
        this.iterateAttachments(index);
      },
      (msg) => {
        attach.uploading = false;
        attach.status = 'Failed to upload';

        this.notify.errorsmsg(
          'ERROR',
          msg
        );
    }
    );
  }

  resetUpload() {
    this.attachmentQueue = [];
    this.attachmentQueueDisplay = [];
    this.attachmentName = '';
    this.selectedTransactionType = - 1;
    this.disableAttachmentType = false;
    this.disableSAD500 = false;
    this.disableSAD500Lines = false;
    this.attachmentTypeIndex = 0;
    this.preview = null;
    this.attachmentTypeIndex = 0;
    this.selectedSAD500Line = -1;
    this.selectAttachmentType.reset(-1);
    this.selectSAD500Control.reset(-1);
    this.selectSAD500LinesControl.reset(-1);
    this.inputFile.nativeElement.value = '';
    this.currentAttachment = 0;
    this.isVOC = false;
    this.selectedSAD500 = null;
    this.loadAttachments();
  }

  upload() {
    this.resetUpload();
    this.openModal.nativeElement.click();
  }

  onFileChange(files: File[]) {
    this.preview = '';

    for (let i = 0; i < files.length; i++) {
      this.preview += `${files[i].name} `;
    }

    this.attachmentQueue[this.currentAttachment] = {
      file: files,
    };
  }

  onTypeSelect(id: number) {
    // console.log(id);
    let hasSAD = false;

    if (this.transactionTypes[id].name === 'VOC') {
      if ( this.dataList.length > 0) {
        this.dataList.forEach((item) => {
          if (item.fileTypeID === 2) {
            hasSAD = true;
          }
        });
      }

      if (hasSAD) {
        this.isVOC = true;
        this.loadSAD500s();
      } else {
        this.selectAttachmentType.reset(-1);
        this.notify.toastrwarning('INFO', 'There are now SAD500 attachments found for a VOC to be added');
        this.isVOC = false;
      }

    } else {
      this.isVOC = false;
    }

    if (id === 0) {
      this.selectedTransactionType = 1;
    } else if (id === 1) {
      this.selectedTransactionType = 10;
    } else {
      this.selectedTransactionType = id;
    }

    this.disableAttachmentType = true;
  }

  onSAD500Select(id: number) {
    this.selectedSAD500 = id;
    this.disableSAD500 = true;
    this.selectedSAD500Line = id;
    this.loadSAD500Lines();
  }

  onSAD500LineSelect(id: number) {
    this.selectedSAD500Line = id;
    this.disableSAD500Lines = true;
  }

  addToQueue() {
    let errors = 0;
    if (this.attachmentName === '' || this.attachmentName === null || this.attachmentName === undefined) {
      errors++;
      this.notify.toastrwarning('Warning', 'Enter attachment name');
    } else if (this.transactionTypes[this.selectedTransactionType] === undefined) {
      errors++;
      this.notify.toastrwarning('Warning', 'Please select an attachment type');
    } else if (this.isVOC) {
      if (this.selectedSAD500 === 0 || this.selectedSAD500 === null  || this.selectedSAD500 === undefined) {
        errors++;
        this.notify.toastrwarning('Warning', 'Please Select an SAD500 attachment');
      }

    }

    if (errors === 0) {
      this.attachmentQueue[this.currentAttachment].name = this.attachmentName;
      this.attachmentQueue[this.currentAttachment].ediStatusID = this.selectEDIControl.value;
      this.attachmentQueue[this.currentAttachment].type = this.transactionTypes[this.selectedTransactionType].name;
      this.attachmentQueue[this.currentAttachment].uploading = false;
      this.attachmentQueue[this.currentAttachment].status = 'Pending Upload';
      this.attachmentQueue[this.currentAttachment].sad500ID = this.selectedSAD500Line;
      this.attachmentQueueDisplay[this.currentAttachment] = this.attachmentQueue[this.currentAttachment];
      this.attachmentName = '';
      this.selectedTransactionType = - 1;
      this.currentAttachment++;
      this.disableAttachmentType = false;
      this.disableSAD500 = false;
      this.disableSAD500Lines = false;
      this.attachmentTypeIndex = 0;
      this.preview = null;
      this.attachmentTypeIndex = 0;
      this.selectedSAD500Line = -1;
      this.isVOC = false;
      this.selectAttachmentType.reset(-1);
      this.selectSAD500Control.reset(-1);
      this.selectSAD500LinesControl.reset(-1);
      this.selectEDIControl.reset(0);
    }
  }

  loadSAD500s() {
    console.log('trans');
    console.log(this.transactionID);
    this.captureService.sad500List({
      userID: this.currentUser.userID,
      filter: '',
      rowStart: 1,
      sad500ID: -1,
      rowEnd: 100,
      orderBy: '',
      orderDirection: '',
      transactionID: this.transactionID,
    }).then(
      (res: SAD500ListResponse) => {
        // console.log(res);
        this.sad500s = res.sad500s;
      },
      (msg) => {

      }
    );
  }

  loadSAD500Lines() {
    this.captureService.sad500LineList({
      userID: this.currentUser.userID,
      filter: '',
      rowStart: 1,
      rowEnd: 100,
      orderBy: '',
      orderByDirection: '',
      specificSAD500LineID: -1,
      sad500ID: this.selectedSAD500,
    }).then(
      (res: SPSAD500LineList) => {

        this.selectedSAD500Line = -1;
        this.sad500Line = res.lines;
      },
      (msg) => {

      }
    );
  }

  removeAttachment($event) {
    this.dialog.open(DialogRemoveAttachmentComponent, {
      width: '512px'
    }).afterClosed().subscribe((value) => {
      if (value) {
        this.showLoader = true;
        const model = {
          requestParams: {
            userID: this.currentUser.userID,
            attachmentID: JSON.parse($event).fileID,
            fileTypeID: JSON.parse($event).fileTypeID,
            isDeleted: 1
          },
          requestProcedure: 'AttachmentsUpdate'
        };

        console.log('Building Request');
        console.log(model);

        this.apiService.post(`${environment.ApiEndpoint}/capture/update`, model).then(
          (res) => {
            console.log(res);
            this.loadAttachments();
          },
          msg => {
            console.log(msg);

            this.showLoader = false;
            this.notify.errorsmsg(
              'Server Error',
              'Something went wrong while trying to access the server.'
            );
          }
        );
      }
    });


  }
  splitPDF() {
    this.closeModal.nativeElement.click();

    this.dialog.open(SplitDocumentComponent, {
      data: {
        userID: this.currentUser.userID,
        transactionID: this.transactionID,
        transactionType: this.transactionType
      },
      panelClass: 'splitter',
      height: '80vh',
      width: '80%'
    }).afterClosed().subscribe((response: { state: boolean }) => {
      if (response.state) {
        this.loadAttachments();
      }
    });
  }

  previewDocument(src: string) {
    const myWindow = window.open(
      `${environment.appRoute}/documentpreview/${btoa(src)}`,
      '_blank',
      'width=600, height=800, noreferrer'
    );

    myWindow.opener = null;
  }

  // View the permit before submitting
  viewDoc(file: any) {
    this.fileReader = new FileReader();
    this.fileReader.readAsDataURL(file[0]);
    this.fileReader.onload = (e) => {
    this.filePreview = this.fileReader.result;
    };
    this.openPreview.nativeElement.click();
  }

  returnAttachment(attachment: any){
    this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Return Attachment',
        message: 'Are you sure you want to return this attachement to the capturing queue?'
      },
      width: '512px'
    }).afterClosed().subscribe((state) => {
      if (state) {
        this._returnAttachment(JSON.parse(attachment));
        this.loadAttachments()
      }
    })
  }

  _returnAttachment(attachment: any){
    console.log(attachment);
    console.log(this.focusFileType);
    let model = {
      request: {
        userID: this.currentUser.userID,
        attachmentID: attachment.attachmentID,
        fileTypeID: attachment.fileTypeID,
        isDeleted: 0
      },
      procedure: 'AttachmentsUpdate'
    }
    this.apiService.post(`${environment.ApiEndpoint}/capture/post`, model).then(
      (res) => {
        console.log(res)
      }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
