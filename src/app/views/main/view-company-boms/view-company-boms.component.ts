import { BOMUpload } from './../../../models/HttpResponses/BOMsLinesResponse';
import { DocumentService } from 'src/app/services/Document.Service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/Menu.Service';
import { Pagination } from '../../../models/Pagination';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { User } from '../../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service.js';
import {SnackbarModel} from '../../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../../services/HelpSnackbar.service';
import { TableHeading, SelectedRecord, Order, TableHeader } from 'src/app/models/Table';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { ServicesService } from 'src/app/services/Services.Service';
import { GetCompanyBOMs } from 'src/app/models/HttpRequests/GetCompanyBOMs';
import { CompanyBOMsListResponse, CompanyBOM } from 'src/app/models/HttpResponses/CompanyBOMsListResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-company-boms',
  templateUrl: './view-company-boms.component.html',
  styleUrls: ['./view-company-boms.component.scss']
})
export class ViewCompanyBOMsComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private ServiceService: ServicesService,
    private userService: UserService,
    private themeService: ThemeService,
    private IMenuService: MenuService,
    private IDocumentService: DocumentService,
    private router: Router,
    private snackbarService: HelpSnackbar
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
    this.subscription = this.IMenuService.subSidebarEmit$.subscribe(result => {
      this.sidebarCollapsed = result;
    });
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openAddModal', {static: true})
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', {static: true})
  closeAddModal: ElementRef;

  @ViewChild('bomFile', { static: false })
  bomFile: ElementRef;

  // @ViewChild('openRemoveModal', {static: true})
  // openRemoveModal: ElementRef;
  // @ViewChild('closeRemoveModal', {static: true})
  // closeRemoveModal: ElementRef;

  BOM: {
    bomid: number,
    bomInput: string,
    status: string,
  };

  tableHeader: TableHeader = {
    title: 'BOMs',
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

  tableHeadings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      }
    },
    {
      title: 'BOMCode',
      propertyName: 'bomInput',
      order: {
        enable: true,
        tag: 'BOMInput'
      }
    },
    {
      title: 'Status',
      propertyName: 'status',
      order: {
        enable: true,
        tag: 'Status'
      }
    }
  ];

  selectedRow = -1;
  BOMCode = 0;
  status = '';
  BOMID = -1;

  CompanyBOMs: CompanyBOM[] = [];

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  recordsPerPage = 15;
  sidebarCollapsed = true;
  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  showingPages: Pagination[];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;
  subscription: Subscription;
  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  activePage: number;
  orderBy: string;
  orderDirection: string;
  totalShowing: number;
  noData = false;
  showLoader = true;
  displayFilter = false;
  isAdmin: false;
  companyID = 0;
  companyName = '';
  BomFile: File;
  filePreview: string;


  ngOnInit() {
    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });

    this.loadCompanyBOMs(true);

  }

  loadCompanyBOMs(displayGrowl: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model: GetCompanyBOMs = {
      userID: this.currentUser.userID,
      filter: this.filter,
      companyID: this.companyID,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getCompanyBoms(model).then(
      (res: CompanyBOMsListResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if (displayGrowl) {
            this.notify.successmsg(
              res.outcome.outcome,
              res.outcome.outcomeMessage);
          }
        }
        this.CompanyBOMs = res.companyBoms;

        if (res.rowCount === 0) {
          this.noData = true;
          this.showLoader = false;
        } else {
          this.noData = false;
          this.rowCount = res.rowCount;
          this.showingRecords = res.companyBoms.length;
          this.showLoader = false;
          this.totalShowing = +this.rowStart + +this.CompanyBOMs.length - 1;
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

  pageChange($event: {rowStart: number, rowEnd: number}) {
    this.rowStart = $event.rowStart;
    this.rowEnd = $event.rowEnd;
    this.loadCompanyBOMs(false);
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyBOMs(false);
  }


  toggleFilters() {
    this.displayFilter = !this.displayFilter;
  }

  orderChange($event: Order) {
    this.orderBy = $event.orderBy;
    this.orderDirection = $event.orderByDirection;
    this.rowStart = 1;
    this.rowEnd = this.rowCountPerPage;
    this.loadCompanyBOMs(false);
  }

  popClick(event, obj) {
    this.BOM = obj;
    this.contextMenuX = event.clientX + 3;
    this.contextMenuY = event.clientY + 5;
    this.themeService.toggleContextMenu(!this.contextMenu);
    this.contextMenu = true;
  }

  back() {
    this.router.navigate(['companies']);
  }

  selectedRecord(obj: SelectedRecord) {
    this.selectedRow = obj.index;
    this.popClick(obj.event, obj.record);
  }

  updateHelpContext(slug: string, $event?) {
    if (this.isAdmin) {
      const newContext: SnackbarModel = {
        display: true,
        slug,
      };

      this.snackbarService.setHelpContext(newContext);
    } else {
      if ($event.target.attributes.matTooltip !== undefined && $event.target !== undefined) {
        $event.target.setAttribute('mattooltip', 'New Tooltip');
        $event.srcElement.setAttribute('matTooltip', 'New Tooltip');
      }
    }
  }

  recordsPerPageChange(recordsPerPage: number) {
    this.rowCountPerPage = recordsPerPage;
    this.rowStart = 1;
    this.loadCompanyBOMs(true);
  }

  searchEvent(query: string) {
    this.filter = query;
    this.loadCompanyBOMs(false);
  }
  add() {
    // Render modal
    this.filePreview = null;
    this.bomFile.nativeElement.value = '';
    this.BomFile = null;
    this.openAddModal.nativeElement.click();
  }
  queueBOM() {
    // Add to import queue

  }
  onFileChange(files: FileList) {
    this.BomFile = files.item(0);
    this.filePreview = this.BomFile.name;
  }

  saveBOMUpload() {
    // Save
    this.IDocumentService.upload(this.BomFile).then(
      (res: BOMUpload) => {
        console.log(res);
      },
      (msg) => {
        // nothing yet
      }
    );
  }
}




