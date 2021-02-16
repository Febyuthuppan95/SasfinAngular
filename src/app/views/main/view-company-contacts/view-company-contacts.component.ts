import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { ThemeService } from 'src/app/services/theme.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'src/app/components/menus/context-menu/context-menu.component';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/HttpResponses/User';
import { Pagination } from 'src/app/models/Pagination';
import { CompanyContactsResponse, Contacts } from 'src/app/models/HttpResponses/CompanyContactsResponse';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddContact } from 'src/app/models/HttpRequests/AddContact';
import { ContactTypesService } from 'src/app/services/ContactTypes.Service';
import { ContactTypesListRequest } from 'src/app/models/HttpRequests/ContactTypesList';
import { ListContactTypes } from 'src/app/models/HttpResponses/ListContactTypes';
import { ContactType } from 'src/app/models/HttpResponses/ContactType';
import { UpdateItemServiceResponse } from 'src/app/models/HttpResponses/UpdateItemServiceResponse';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-view-company-contacts',
  templateUrl: './view-company-contacts.component.html',
  styleUrls: ['./view-company-contacts.component.scss']
})
export class ViewCompanyContactsComponent implements OnInit, OnDestroy {

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private contactTypeService: ContactTypesService
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
    this.loadCompanyInfoList();
  }

  @ViewChild(ContextMenuComponent, {static: true } )
  private contextmenu: ContextMenuComponent;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('closeeditModal', {static: true})
  closeeditModal: ElementRef;

  @ViewChild('openeditModal', {static: true})
  openeditModal: ElementRef;


  @ViewChild('openRemoveModal', {static: true})
  openRemoveModal: ElementRef;
  @ViewChild('closeRemoveModal', {static: true})
  closeRemoveModal: ElementRef;

  defaultProfile =
    `${environment.ApiProfileImages}/default.jpg`;

  private unsubscribe$ = new Subject<void>();

  currentUser: User = this.userService.getCurrentUser();
  currentTheme: string;

  pages: Pagination[];
  showingPages: Pagination[];
  dataset: CompanyContactsResponse;
  dataList: Contacts[] = [];
  rowCount: number;
  nextPage: number;
  nextPageState: boolean;
  prevPage: number;
  prevPageState: boolean;

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

  noData = false;
  showLoader = true;
  displayFilter = false;

  contextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;
  sidebarCollapsed = true;
  selectedRow = -1;

  companyName: string;
  companyID: number;
  test: string = 'Test';


  //Add/ Edit or Delete
  CaptureModel: AddContact;

  //Used for loading the contact types into the Add / Edit Modal
  contactTypes: ContactTypesListRequest = {
    userID: this.currentUser.userID,
    specificContactTypeID: -1,
    filter: '',
    orderBy: 'Name',
    orderByDirection: 'ASC',
    rowStart: 1,
    rowEnd: 15
  };



  //Variable to store the contact types
  contactTypeDropDown: ContactType[];
  //Display text on Modal.
  modalDisplay: string;


  ngOnInit() {
    this.companyService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.resetCaptureModal();
    this.loadContactTypes(); // load contact types into edit / add dropdown
  }

  backToCompanies() {
    this.router.navigate(['companies']);

  }


  resetCaptureModal()
  {
    this.CaptureModel = {
    "CUserID": this.currentUser.userID,
    "ContactTypeID": this.companyService.selectedCompany.value.companyID,
    "CompanyID": 0,
    "Name": '',
    "Email": '',
    "CellNo": '',
    "LandNo": '',
    "FaxNo": '',
    "isDeleted": 0,
    "ContactID" : 0,
    "ContactName" : ''

    }
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

    this.loadCompanyInfoList();
  }

  searchBar() {
    this.rowStart = 1;
    this.loadCompanyInfoList();
  }

  loadCompanyInfoList() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;

    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyService.selectedCompany.value.companyID,
      specificContactID: -1,
      specificContacTypeID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };

    this.companyService
      .contacts(model)
      .then(
        (res: CompanyContactsResponse) => {
          if (res.rowCount === 0) {
            this.noData = true;
            this.showLoader = false;
          } else {
            this.noData = false;
            this.dataset = res;
            this.dataList = res.contacts;
            this.rowCount = res.rowCount;
            this.showLoader = false;
            this.showingRecords = res.contacts.length;
            this.totalShowing = +this.rowStart + +this.dataset.contacts.length - 1;
            this.paginateData();
          }
          console.log('fax');
          console.log(model);

        },
        msg => {
          this.showLoader = false;
          this.notify.errorsmsg(
            'Server Error',
            'Something went wrong while trying to access the server.'
          );
          console.log(JSON.stringify(msg));
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
    this.loadCompanyInfoList();
  }

  updatePagination() {
    if (this.dataset.contacts.length <= this.totalShowing) {
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

  popClick(event, id, name, description) {
    if (this.sidebarCollapsed) {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    } else {
      this.contextMenuX = event.clientX + 3;
      this.contextMenuY = event.clientY + 5;
    }

    this.focusHelp = id;
    this.focusHelpName = name;
    this.focusDescription = description;

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  loadContactTypes(){

    this.contactTypeService.list(this.contactTypes).then(
      (res: ListContactTypes) => {
        if(res.outcome.outcome == "FAILURE"){
          this.notify.errorsmsg(
            res.outcome.outcome, res.outcome.outcomeMessage
          )
        }else{
          this.contactTypeDropDown = res.contactTypesList;
          //Capture modal will contain the first id of the dropdown on FIRST LOAD.
          this.CaptureModel.ContactTypeID = res.contactTypesList[0].contactTypeID;
        }
      }

    )

  }

  //on change of the dropdown on the contacts modal. store value
  onContactTypeChange(type: string){
    this.CaptureModel.ContactTypeID = +type;
  }

  //Open the Edit modal and load data in the modal of the selected modal
  EditCompanyContact(){
    this.modalDisplay = 'Edit Contact';
    this.CaptureModel.isDeleted = 0;
    this.openeditModal.nativeElement.click();
  }

  OpenModalForAdd(){
    this.modalDisplay = 'Add Contact';
    this.resetCaptureModal();
    this.openeditModal.nativeElement.click();
  }

  setIndex(contact: Contacts)
 {
   this.resetCaptureModal();
   this.CaptureModel.CellNo = contact.cellNo;
   this.CaptureModel.CompanyID = contact.contactID;
   this.CaptureModel.ContactTypeID  = contact.contactTypeID;
   this.CaptureModel.Email = contact.email;
   this.CaptureModel.LandNo = contact.landNo;
   this.CaptureModel.FaxNo = contact.faxNo;
   this.CaptureModel.Name = contact.contact;
   this.CaptureModel.isDeleted = 0; // No Delete
   this.CaptureModel.ContactID = contact.contactID;
   this.CaptureModel.ContactName = contact.contactType;

 }


 //Validation to ensure all fields are filled in
 Validate(){

  if(this.CaptureModel.Name == '' ||
     this.CaptureModel.Email == '' ||
     this.CaptureModel.CellNo == '' ||
     this.CaptureModel.LandNo == '' ||
     this.CaptureModel.FaxNo == '' )
     {
      this.notify.toastrwarning("Required Fields Error", "Please enter all required fields")
      return false;
     }
  else
   return true


 }

 submit()
 {
  if(this.Validate())
   if(this.CaptureModel.ContactID == 0)
      this.AddNewContact();
   else
      this.UpdateContact();
 }

 DeleteContact()
 {
   this.CaptureModel.isDeleted = 1;
   this.openRemoveModal.nativeElement.click();
 }

  AddNewContact(){
    this.CaptureModel.isDeleted = 0;
    this.CaptureModel.CompanyID = this.companyService.selectedCompany.value.companyID;

    this.companyService.addContact(this.CaptureModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          this.updatePagination();
          this.loadCompanyInfoList();
          this.closeeditModal.nativeElement.click();
          this.resetCaptureModal();
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
        // this.loadItems(false);
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );



  }

  UpdateContact(){

    this.CaptureModel.CompanyID = this.companyService.selectedCompany.value.companyID;

    this.companyService.UpdateContact(this.CaptureModel).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {

          if (this.CaptureModel.isDeleted = 0)
          this.notify.successmsg(res.outcome, res.outcomeMessage);
          else{
            this.notify.successmsg('Success', 'Contact Removed')
            this.closeRemoveModal.nativeElement.click();
          }
          this.updatePagination();
          this.loadCompanyInfoList();
          this.closeeditModal.nativeElement.click();
          this.resetCaptureModal();
        } else {
          this.notify.errorsmsg(res.outcome, res.outcomeMessage);
        }
        // this.loadItems(false);
      },
      (msg) => this.notify.errorsmsg('Failure', 'Cannot reach server')
    );



  }

}
