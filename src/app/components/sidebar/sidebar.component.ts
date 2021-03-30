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
  showescalations = false;

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
        console.log(res);
        // Process Success
        res.userRightsList.forEach(uRight => {
          if (+uRight.designationID === 1) {
            this.showcontactTypes = true;
            this.showaddressTypes = true;
          }
          if (+uRight.designationID === 1 || +uRight.designationID === 2) {
            if (uRight.name === 'Users') {
              this.showusers = true;
            }
            if (uRight.name === 'Rights') {
              this.showrights = true;
            }
            if (uRight.name === 'Backgrounds') {
              this.showbackgrounds = true;
            }
            if (uRight.name === 'Designations') {
              this.showdesignation = true;
            }
            if (uRight.name === 'BackgroundUser') {
              this.showbackgroundUser = true;
            }
            if (uRight.name === 'BackgroundColorUser') {
              this.showbackgroundColorUser = true;
            }
            if (uRight.name === 'ObjectHelp') {
              this.showobjectHelp = true;
            }
            if (uRight.name === 'HelpGlossary') {
              this.showhelpglossary = true;
            }
            if (uRight.name === 'UnitOfMeasures') {
              this.showunitofmeasures = true;
            }
            if (uRight.name === 'Countries') {
              this.showcountries = true;
            }
            if (uRight.name === 'Regions') {
              this.showregions = true;
            }
            if (uRight.name === 'Cities') {
              this.showcities = true;
            }
            if (uRight.name === 'Places') {
              this.showplaces = true;
            }
            if (uRight.name === 'Transactions') {
              this.showtransactions = true;
            }
            if (uRight.name === 'Attachments') {
              this.showattachments = true;
            }
            if (uRight.name === 'CompanyContactsList') {
              this.showcompanyContactsList = true;
            }
            if (uRight.name === 'Services') {
              this.showservices = true;
            }
            if (uRight.name === 'Tariffs') {
              this.showtariffs = true;
            }
            if (uRight.name === 'Items') {
              this.showitems = true;
            }
            if (uRight.name === 'ReportQueues') {
              this.showreportqueues = true;
            }
            if (uRight.name === 'ContactTypes') {
              this.showcontactTypes = true;
            }
            if (uRight.name === 'CompanyAddInfoTypes') {
              this.showcompanyAddInfoTypes = true;
            }
            if (uRight.name === 'Places') {
              this.showlocations = true;
            }
            if (uRight.name === 'AttchmentCapture') {
              this.showCapturer = true;
            }
            if (uRight.name === 'CompanyTransactionsCaptureList') {
              this.showcapturequeue = true;
            }
            if (uRight.name === 'CompanyAddInfoTypes') {
              this.showcompanyAddInfoTypes = true;
            }
            if (uRight.name === 'CompanyAddInfoList') {
              this.showcompanyAddInfoList = true;
            }
            if (uRight.name === 'CompanyAddInfoTypes') {
              this.showcompanyAddInfoTypes = true;
            }

            if (uRight.name === 'CompanyAddInfoList') {
              this.showcompanyAddInfoList = true;
            }
            if (uRight.name === 'Currencies') {
              this.showcurrencies = true;
            }
          }
          //if (uRight.name === 'ContactTypes' && +uRight.designationID !== 3) {
          //if (+uRight.designationID === 1) {
          //  this.showcontactTypes = true;
          // }

          if (uRight.name === 'Attachments') {
            this.showcompanies = true;
          }
          if (uRight.name === 'Companies') {
            this.showescalations = true;
          }
          //if (uRight.name === 'AddressTypes' && +uRight.designationID !== 3) {
          //if (+uRight.designationID === 1) {
          //  this.showaddressTypes = true;
          //}
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
