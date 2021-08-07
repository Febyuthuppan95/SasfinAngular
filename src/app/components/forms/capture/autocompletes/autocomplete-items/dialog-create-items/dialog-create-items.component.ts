import { ContextCompanyItemsListComponent } from './../../../../../../views/main/view-company-items-list/view-company-items-list.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.Service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ThemeService } from 'src/app/services/theme.Service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Subject } from 'rxjs';
import { ItemType } from 'src/app/models/HttpResponses/ItemType';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { CompanyItemsResponse, Item } from 'src/app/models/HttpResponses/CompanyItemsResponse';
import {ItemTypeListResponse} from 'src/app/models/HttpResponses/ItemTypeListResponse';
@Component({
  selector: 'app-dialog-create-items',
  templateUrl: './dialog-create-items.component.html',
  styleUrls: ['./dialog-create-items.component.scss']
})
export class DialogCreateItemsComponent implements OnInit {

  constructor(private captureService: CaptureService, private userService: UserService,
              private dialogRef: MatDialogRef<DialogCreateItemsComponent>, private snackbar: MatSnackBar,
              private snackbarService: HelpSnackbar,
              private themeService: ThemeService,
              private api: ApiService,
              private companyService: CompanyService,
              ) { }

  currentUser = this.userService.getCurrentUser();
  tariffControl = new FormControl(null);
  usageControl = new FormControl();
  typeControl = new FormControl();
  classControl = new FormControl();
  contextMenu = false;
  companyID: number;
  vulnerableControl = new FormControl();
  orderBy: string;
  orderDirection: string;
  rowCountPerPage: number;
  rowStart: number;
  rowEnd: number;
  showLoader = true;
  filter: string;
  private unsubscribe$ = new Subject<void>();
  itemTypes: ItemType[];
  itemClasses: any[];
  usages: any[];
  YESNO: any[] = [{title: 'True', value: true}, {title: 'False', value: false}];


  @ViewChild('openAddModal', {static: true})
  openAddModal: ElementRef;

  @ViewChild('closeAddModal', {static: true})
  closeAddModal: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  form = new FormGroup({
    userID: new FormControl(this.currentUser.userID),
    tariffID: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {}
  newItem: {
    itemID: number,
    item: string,
    description: string,
    tariffID: number,
    itemtypeID: number,
    usageTypeID: number,
    itemClassID: number,
    qualify521: boolean,
    qualify536: boolean,
    qualifyPI: boolean,
    vulnerable: string,
  } = {
    itemID: null,
    item: null,
    description: null,
    tariffID: null,
    itemtypeID: null,
    usageTypeID: null,
    itemClassID: null,
    qualify521: null,
    qualify536: null,
    qualifyPI: null,
    vulnerable: null,
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  onTypeChange(id: number) {
    //console.log(id);
    this.newItem.itemtypeID = id;
  }

  onVulnerablestateChange(state: string) {
    this.newItem.vulnerable = state;
  }

  onClassChange(id: number) {
    //console.log(id);
    this.newItem.itemClassID = id;
  }

  onUsageChange(id: number) {
    //console.log(id);
    this.newItem.usageTypeID = id;
  }
  //Populate Item Types
  loadItemTypes(displayGrowl: boolean) {
    const model = {
      userID: this.currentUser.userID,
      filter: this.filter,
      itemTypeID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
    this.companyService.getItemTypesList(model).then(
      (res: ItemTypeListResponse) => {
        this.itemTypes = res.itemTypeLists;
        console.log(this.itemTypes);
      },
      msg => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error 615.2',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  //Populate itemClasses
  loadItemClasses() {
    const model = {
      request: {
        userID: this.currentUser.userID,
      },
      procedure: 'ItemClassList'
    }
    this.api.post(`${environment.ApiEndpoint}/capture/list`, model).then(
      (res: any) => {
        if (res.outcome) {
          this.itemClasses = res.data;
          console.log(this.itemClasses);
        }
        else {
          this.notify.errorsmsg(
            'Error',
            res.outcomeMessage
          );
        }
      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error 110',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }

  //Populate UsageTypes
  loadUsageTypes() {
    const model = {
      request: {
        userID: this.currentUser.userID,
      },
      procedure: 'UsageTypesList'
    }
    this.api.post(`${environment.ApiEndpoint}/capture/list`, model).then(
      (res: any) => {
        if (res.outcome) {
          this.usages = res.data;
          console.log(this.usages);
        }
        else {
          this.notify.errorsmsg(
            'Error',
            res.outcomeMessage
          );
        }
      },
      (msg) => {
        this.showLoader = false;
        this.notify.errorsmsg(
          'Server Error 110',
          'Something went wrong while trying to access the server.'
        );
      }
    );
  }


  addItem(){
    this.themeService.toggleContextMenu(false);
    this.contextMenu = false;
    this.typeControl.setValue(-1);
    this.usageControl.setValue(-1);
    this.classControl.setValue(-1);
    this.tariffControl = new FormControl(null);
    this.newItem = {
      itemID: null,
      item: null,
      description: null,
      tariffID: null,
      itemtypeID: null,
      usageTypeID: null,
      itemClassID: null,
      qualify521: false,
      qualify536: false,
      qualifyPI: false,
      vulnerable: null,
    }
    this.openAddModal.nativeElement.click();
  }

  submit(form: FormGroup) {
    if (form.valid) {
      this.captureService.post({ request: form.value, procedure: 'ItemAdd' }).then(
        (res: any) => {
          // console.log(res);
          this.dialogRef.close(res.data[0].createdID);
          if (res.outcome) {
            this.dialogRef.close(res.data[0].createdID);
          } else {
             this.snackbar.open(res.outcomeMessage, '', { duration: 3000 });
          }
        }
      );
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }
  loadCompanyItemsList(displayGrowl?: boolean) {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = true;
    const model = {
      filter: this.filter,
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificItemID: -1,
      rowStart: this.rowStart,
      rowEnd: this.rowEnd,
      orderBy: this.orderBy,
      orderByDirection: this.orderDirection
    };
  }
  AddItem(){
    if (this.newItem.item.length !== 0 && this.newItem.description.length !== 0  &&
      this.newItem.usageTypeID > 0 && this.newItem.itemtypeID > 0 && this.newItem.itemClassID > 0 ) {
        const requestModel = {
          request: {
            userID: this.currentUser.userID,
            companyID: this.companyID,
            name: this.newItem.item,
            description: this.newItem.description,
            tariffID: this.tariffControl.value,
            vulnerable: this.vulnerableControl.value === 'true'? true : false,
            usageTypeID: this.newItem.usageTypeID,
            itemTypeID: this.newItem.itemtypeID,
            itemClassID: this.newItem.itemClassID,
            qualify521: this.newItem.qualify521,
            qualify536: this.newItem.qualify536,
            qualifyPI: this.newItem.qualifyPI
          },
          procedure: 'CompanyItemAdd'
        };
        this.api.post(`${environment.ApiEndpoint}/capture/post`,requestModel).then(
          (res: any) => {
            if (res.outcome) {
              this.notify.successmsg('Success', res.outcomeMessage);
              this.loadCompanyItemsList(false);
              this.closeAddModal.nativeElement.click();
            } else {
              this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            }
          },
          (msg) => {
            //console.log(msg)
          }
        );
    }
    else {
      this.notify.errorsmsg('Error','Please fill in all the fields');
    }

  }
 
}

