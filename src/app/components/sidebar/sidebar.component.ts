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
  @Input() showusers = false;
  @Input() showrights = false;
  @Input() showbackgrounds = false;
  @Input() showdesignation = false;
  @Input() showbackgroundUser = false;
  @Input() showbackgroundColorUser = false;
  @Input() showobjectHelp = false;
  @Input() showhelpglossary = false;
  @Input() showunitofmeasures = false;
  @Input() showcountries = false;
  @Input() showregions = false;
  @Input() showcities = false;
  @Input() showcontactTypes = false;
  @Input() showcurrencies = false;
  @Input() showcompanies = false;
  @Input() showcompanyAddInfoTypes = false;
  @Input() showcompanyAddInfoList = false;
  @Input() showaddressTypes = false;
  @Input() showplaces = false;
  @Input() showtransactions = false;
  @Input() showattachments = false;
  @Input() showcompanyContactsList = false;
  @Input() showcompanyAddressList = false;
  @Input() showservices = false;
  @Input() showtariffs = false;
  @Input() showitems = false;
  @Input() showreportqueues = false;
  @Input() showlocations = false;
  @Input() showCapturer = true;
  @Input() showcapturequeue = true;

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
                // Process Success
        res.userRightsList.forEach(uRight => {
          console.log('***');
          console.log(uRight.designationID);
          if (uRight.name === 'Users' && uRight.designationID !== 3) {
            this.showusers = true;
          } else {
            this.showusers = false;
          }
          if (uRight.name === 'Rights' && uRight.designationID !== 3) {
            this.showrights = true;
          } else {
            this.showrights = false;
          }
          if (uRight.name === 'Backgrounds' && uRight.designationID !== 3) {
            this.showbackgrounds = true;
          } else {
            this.showbackgrounds = false;
          }
          if (uRight.name === 'Designations' && uRight.designationID !== 3) {
            this.showdesignation = true;
          } else {
            this.showdesignation = false;
          }
          if (uRight.name === 'BackgroundUser' && uRight.designationID !== 3) {
            this.showbackgroundUser = true;
          } else {
            this.showbackgroundUser = false;
          }
          if (uRight.name === 'BackgroundColorUser' && uRight.designationID !== 3) {
            this.showbackgroundColorUser = true;
          } else {
            this.showbackgroundColorUser = false;
          }
          if (uRight.name === 'ObjectHelp' && uRight.designationID !== 3) {
            this.showobjectHelp = true;
          } else {
            this.showobjectHelp = false;
          }
          if (uRight.name === 'HelpGlossary' && uRight.designationID !== 3) {
            this.showhelpglossary = true;
          } else {
            this.showhelpglossary = false;
          }
          if (uRight.name === 'UnitOfMeasures' && uRight.designationID !== 3) {
            this.showunitofmeasures = true;
          } else {
            this.showunitofmeasures = false;
          }
          if (uRight.name === 'Countries' && uRight.designationID !== 3) {
            this.showcountries = true;
          } else {
            this.showcountries = false;
          }
          if (uRight.name === 'Regions' && uRight.designationID !== 3) {
            this.showregions = true;
          } else {
            this.showregions = false;
          }
          if (uRight.name === 'Cities' && uRight.designationID !== 3) {
            this.showcities = true;
          } else {
            this.showcities = false;
          }
          if (uRight.name === 'ContactTypes' && uRight.designationID !== 3) {
            this.showcontactTypes = true;
          } else {
            this.showcontactTypes = false;
          }
          if (uRight.name === 'Currencies' && uRight.designationID !== 3) {
            this.showcurrencies = true;
          } else {
            this.showcurrencies = false;
          }
          if (uRight.name === 'Companies' && uRight.designationID !== 3) {
            this.showcompanies = true;
          } else {
            this.showcompanies = false;
          }
          if (uRight.name === 'CompanyAddInfoTypes' && uRight.designationID !== 3) {
            this.showcompanyAddInfoTypes = true;
          } else {
            this.showcompanyAddInfoTypes = false;
          }
          if (uRight.name === 'CompanyAddInfoList' && uRight.designationID !== 3) {
            this.showcompanyAddInfoList = true;
          } else {
            this.showcompanyAddInfoList = false;
          }
          if (uRight.name === 'AddressTypes' && uRight.designationID !== 3) {
            this.showaddressTypes = true;
          } else {
            this.showaddressTypes = false;
          }
          if (uRight.name === 'Places' && uRight.designationID !== 3) {
            this.showplaces = true;
          } else {
            this.showplaces = false;
          }
          if (uRight.name === 'Transactions' && uRight.designationID !== 3) {
            this.showtransactions = true;
          } else {
            this.showtransactions = false;
          }
          if (uRight.name === 'Attachments' && uRight.designationID !== 3) {
            this.showattachments = true;
          } else {
            this.showattachments = false;
          }
          if (uRight.name === 'CompanyContactsList' && uRight.designationID !== 3) {
            this.showcompanyContactsList = true;
          } else {
            this.showcompanyContactsList = false;
          }
          if (uRight.name === 'CompanyAddressList' && uRight.designationID !== 3) {
            this.showcompanyAddressList = true;
          } else {
            this.showcompanyAddressList = false;
          }
          if (uRight.name === 'Services' && uRight.designationID !== 3) {
            this.showservices = true;
          } else {
            this.showservices = false;
          }
          if (uRight.name === 'Tariffs' && uRight.designationID !== 3) {
            this.showtariffs = true;
          } else {
            this.showtariffs = false;
          }
          if (uRight.name === 'Items' && uRight.designationID !== 3) {
            this.showitems = true;
          } else {
            this.showitems = false;
          }
          if (uRight.name === 'ReportQueues' && uRight.designationID !== 3) {
            this.showreportqueues = true;
          } else {
            this.showreportqueues = false;
          }
          if (uRight.name === 'ContactTypes' && uRight.designationID !== 3) {
            this.showcontactTypes = true;
          } else {
            this.showcontactTypes = false;
          }
          if (uRight.name === 'CompanyAddInfoTypes' && uRight.designationID !== 3) {
            this.showcompanyAddInfoTypes = true;
          } else {
            this.showcompanyAddInfoTypes = false;
          }
          if (uRight.name === 'Places' && uRight.designationID !== 3) {
            this.showlocations = true;
          } else {
            this.showlocations = false;
          }
          if (uRight.name === 'AttchmentCapture' && uRight.designationID !== 3) {
            this.showCapturer = true;
          }
          if (uRight.name === 'CompanyTransactionsCaptureList') {
            this.showcapturequeue = true;
          } else {
            this.showcapturequeue = false;
          }
        });
      },
      msg => {
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
