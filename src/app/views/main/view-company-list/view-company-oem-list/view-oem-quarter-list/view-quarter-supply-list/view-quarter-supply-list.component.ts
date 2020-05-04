import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { Subject } from 'rxjs';
import { QuartersSupplyContextMenuComponent } from 'src/app/components/menus/quarters-supply-context-menu/quarters-supply-context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { takeUntil } from 'rxjs/operators';
import { SelectedCompanyOEM } from '../../view-company-oem-list.component';

@Component({
  selector: 'app-view-quarter-supply-list',
  templateUrl: './view-quarter-supply-list.component.html',
  styleUrls: ['./view-quarter-supply-list.component.scss']
})
export class ViewQuarterSupplyListComponent implements OnInit {

  constructor(private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService) { 
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
    }
    currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;
  rowStart: number;
  rowEnd: number;
  filter: string;
  orderBy: string;
  orderDirection: string;

  dataList: OEMQuarterSupply[];
  pages: Pagination[];
  showingPages: Pagination[];
  dataset: OEMQuarterSupplyList;
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

  totalShowing: number;
  orderIndicator = 'Name_ASC';
  rowCountPerPage: number;
  showingRecords = 15;
  activePage: number;

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;
  selectedCompanyOEM: SelectedCompanyOEM;
  selectedQuarterSupply: SelectedOEMQuarterSupply;

  private unsubscribe$ = new Subject<void>();

@ViewChild(QuartersSupplyContextMenuComponent, {static: true } )
  private contextmenu: QuartersSupplyContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openaddModal', {static: true})
  openaddModal: ElementRef;

  @ViewChild('closeaddModal', {static: true})
  closeaddModal: ElementRef;
  ngOnInit() {
    
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.companyService.observeCompanyOEM()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompanyOEM) => {
      if (obj !== null || obj !== undefined) {
        this.selectedCompanyOEM = obj;
      }
    });
  }

}

export class OEMQuarterSupply {
  rowNum: number;
  companyOEMQuarterSupplyID: number;
  productCode: string;
  productDescription: string;
  quantity: string;
}

export class OEMQuarterSupplyList {
  list: OEMQuarterSupply[];
  rowCount: number;
  outcome: Outcome;
}
export class SelectedOEMQuarterSupply {
  rowNum: number;
  companyOEMQuarterSupplyID: number;
  productCode: string;
  productDescription: string;
  quantity: string;
}