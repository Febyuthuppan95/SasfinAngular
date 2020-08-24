import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { UserRightService } from 'src/app/services/UserRight.service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { UserRightsListResponse } from 'src/app/models/HttpResponses/UserRightsListResponse';
import { NotificationComponent } from '../notification/notification.component';
import { GetUserRightsList } from 'src/app/models/HttpRequests/UserRights';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { CaptureAttachmentResponse, CaptureAttachment } from 'src/app/models/HttpResponses/CaptureAttachmentResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { UUID } from 'angular2-uuid';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private snackbarService: HelpSnackbar,
              private userRightService: UserRightService,
              private userService: UserService,
              private router: Router,
              private storageService: StorageService,
              private docService: DocumentService,
              private companyService: CompanyService,
              private transactionService: TransactionService) {}

  currentUser: User = this.userService.getCurrentUser();

  specificUser = -1;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  activePage: number;
  orderBy: string;
  orderByDirection: string;
  noData = false;
  totalShowing: number;
  orderIndicator = 'Surname_ASC';
  showLoader = true;
  displayFilter = false;
  contextMenu = false;
  sidebarCollapsed = true;
  contextMenuX = 0;
  contextMenuY = 0;
  currentRightID: number;
  CaptureInfo: CaptureAttachment;
  docPath: string;
  transactionID: number;
  attachmentID: number;
  fileType: string;
  companyID: number;
  companyName: string;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;


  @Input() currentTheme = 'light';
  @Input() collapse = true;
  @Input() offcanvas = true;
  @Input() helpContext = false;

  showusers = false;
  showrights = false;
  showbackgrounds = false;
  showdesignation = false;
  showbackgroundUser = false;
  showbackgroundColorUser = false;
  showobjectHelp = false;
  showhelpglossary = false;
  showunitofmeasures = false;
  showcountries = false;
  showregions = false;
  showcities = false;
  showcontactTypes = false;
  showcurrencies = false;
  showcompanies = false;
  showcompanyAddInfoTypes = false;
  showcompanyAddInfoList = false;
  showaddressTypes = false;
  showplaces = false;
  showtransactions = false;
  showattachments = false;
  showcompanyContactsList = false;
  showcompanyAddressList = false;
  showservices = false;
  showtariffs = false;
  showitems = false;
  showreportqueues = false;
  showlocations = false;
  showCapturer = true;
  showcapturequeue = true;
  showescalations = true;

  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  @Output() snackBar = new EventEmitter<string>();

  ngOnInit() {
    this.loadUserRights();
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  loadUserRights() {
    const uRModel: GetUserRightsList = {
      userID: 3,
      specificRightID: -1, // default
      specificUserID: this.currentUser.userID,
      filter: '',
      orderBy: 'Name',
      orderByDirection: 'DESC',
      rowStart: 1,
      rowEnd: 100000
    };
    this.userRightService
      .getUserRightsList(uRModel).then(
      (res: UserRightsListResponse) => {
        this.storageService.save('rights', JSON.stringify(res.userRightsList));

        // Process Success
        res.userRightsList.forEach(uRight => {
          if (uRight.name === 'Users' && +uRight.designationID !== 3) {
            this.showusers = true;
          }
          if (uRight.name === 'Rights' && +uRight.designationID !== 3) {
            this.showrights = true;
          }
          if (uRight.name === 'Backgrounds' && +uRight.designationID !== 3) {
            this.showbackgrounds = true;
          }
          if (uRight.name === 'Designations' && +uRight.designationID !== 3) {
            this.showdesignation = true;
          }
          if (uRight.name === 'BackgroundUser' && +uRight.designationID !== 3) {
            this.showbackgroundUser = true;
          }
          if (uRight.name === 'BackgroundColorUser' && +uRight.designationID !== 3) {
            this.showbackgroundColorUser = true;
          }
          if (uRight.name === 'ObjectHelp' && +uRight.designationID !== 3) {
            this.showobjectHelp = true;
          }
          if (uRight.name === 'HelpGlossary' && +uRight.designationID !== 3) {
            this.showhelpglossary = true;
          }
          if (uRight.name === 'UnitOfMeasures' && +uRight.designationID !== 3) {
            this.showunitofmeasures = true;
          }
          if (uRight.name === 'Countries' && +uRight.designationID !== 3) {
            this.showcountries = true;
          }
          if (uRight.name === 'Regions' && +uRight.designationID !== 3) {
            this.showregions = true;
          }
          if (uRight.name === 'Cities' && +uRight.designationID !== 3) {
            this.showcities = true;
          }

          if (uRight.name === 'ContactTypes' && +uRight.designationID !== 3) {
            this.showcontactTypes = true;
          }

          if (uRight.name === 'Currencies' && +uRight.designationID !== 3) {
            this.showcurrencies = true;
          }

          if (uRight.name === 'Companies') {
            this.showcompanies = true;
          }

          if (uRight.name === 'CompanyAddInfoTypes' && +uRight.designationID !== 3) {
            this.showcompanyAddInfoTypes = true;
          }

          if (uRight.name === 'CompanyAddInfoList' && +uRight.designationID !== 3) {
            this.showcompanyAddInfoList = true;
          }

          if (uRight.name === 'AddressTypes' && +uRight.designationID !== 3) {
            this.showaddressTypes = true;
          }

          if (uRight.name === 'Places' && +uRight.designationID !== 3) {
            this.showplaces = true;
          }

          if (uRight.name === 'Transactions' && +uRight.designationID !== 3) {
            this.showtransactions = true;
          }

          if (uRight.name === 'Attachments' && +uRight.designationID !== 3) {
            this.showattachments = true;
          }

          if (uRight.name === 'CompanyContactsList' && +uRight.designationID !== 3) {
            this.showcompanyContactsList = true;
          }

          if (uRight.name === 'Services' && +uRight.designationID !== 3) {
            this.showservices = true;
          }

          if (uRight.name === 'Tariffs' && +uRight.designationID !== 3) {
            this.showtariffs = true;
          }

          if (uRight.name === 'Items' && +uRight.designationID !== 3) {
            this.showitems = true;
          }

          if (uRight.name === 'ReportQueues' && +uRight.designationID !== 3) {
            this.showreportqueues = true;
          }

          if (uRight.name === 'ContactTypes' && +uRight.designationID !== 3) {
            this.showcontactTypes = true;
          }

          if (uRight.name === 'CompanyAddInfoTypes' && +uRight.designationID !== 3) {
            this.showcompanyAddInfoTypes = true;
          }

          if (uRight.name === 'Places' && +uRight.designationID !== 3) {
            this.showlocations = true;
          }

          if (uRight.name === 'AttchmentCapture' && +uRight.designationID !== 3) {
            this.showCapturer = true;
          }

          if (uRight.name === 'CompanyTransactionsCaptureList' && +uRight.designationID !== 3) {
            this.showcapturequeue = true;
          }

        });
      },
      (msg) => {
        // Process Failure
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      }
    );

  }

  loadCaptureScreen() {
    // this.companyService.setCapture({ capturestate: true, token: UUID.UUID()}); // Generated token to prevent duplicate events
    this.router.navigateByUrl('transaction/capturerlanding');
  }
}
