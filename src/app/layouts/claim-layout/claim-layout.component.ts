import { Component, OnInit, OnDestroy } from '@angular/core';
import { Import, Export, ClaimImportComponents } from 'src/app/views/main/view-company-service-claims/view-company-service-claims.component';
import { TableHeading } from 'src/app/models/Table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { MatTableConfig, MatTableColumn } from 'src/app/components/nested-table/nested-table.component';
import { User } from 'src/app/models/HttpResponses/User';
import { environment } from 'src/environments/environment';
import { CompanyService } from 'src/app/services/Company.Service';
import { SelectedCompany } from 'src/app/services/Cities.Service';
import { PageEvent } from '@angular/material';
import { ServicesService, SelectedCompanyClaim } from 'src/app/services/Services.Service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';

@Component({
  selector: 'app-claim-layout',
  templateUrl: './claim-layout.component.html',
  styleUrls: ['./claim-layout.component.scss']
})
export class ClaimLayoutComponent implements OnInit, OnDestroy {

 
  pageEvent: PageEvent;
  data: Import[] = [];
  headings: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      },
      position: 0
    },
    {
      title: 'Component Code',
      propertyName: 'itemName',
      order: {
        enable: true,
        tag: 'ItemName'
      },
      position: 1
    },
    {
      title: 'Available Duty',
      propertyName: 'availDuty',
      order: {
        enable: true,
        tag: 'availDuty'
      },
      position: 2
    },
    {
      title: 'Total Duty',
      propertyName: 'totDuty',
      order: {
        enable: true,
        tag: 'totDuty'
      },
      position: 3
    },
    {
      title: 'Total HS Quantity',
      propertyName: 'totHSQuantity',
      order: {
        enable: true,
        tag: 'totHSQuantity'
      },
      position: 4
    },
    {
      title: 'Import Date',
      propertyName: 'importDate',
      order: {
        enable: true,
        tag: 'importDate'
      },
      position: 5
    },
    {
      title: 'IDtop',
      propertyName: 'cjid',
      order: {
        enable: true,
        tag: 'cjid'
      },
      position: 6
    },
    {
      title: 'IDbottom',
      propertyName: 'itemID',
      order: {
        enable: true,
        tag: 'cjid'
      },
      position: 7
    }
  ];
  dataLinesAvailable: Export[] = []
  headingsB: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      },
      position: 0
    },
    {
      title: 'Product Code',
      propertyName: 'prodname',
      order: {
        enable: true,
        tag: 'prodname'
      },
      position: 1
    },
    {
      title: 'Quantity',
      propertyName: 'quantity',
      order: {
        enable: true,
        tag: 'quantity'
      },
      position: 2
    },
    {
      title: 'Supply Unit',
      propertyName: 'supplyunit',
      order: {
        enable: true,
        tag: 'supplyunit'
      },
      position: 3
    },
    {
      title: 'Total Export Units',
      propertyName: 'totalexportunits',
      order: {
        enable: true,
        tag: 'totalexportunits'
      },
      position: 4
    }
  ];
  dataLinesAssigned: Export[] = [];
  headingsC: TableHeading[] = [
    {
      title: '',
      propertyName: 'rowNum',
      order: {
        enable: false,
      },
      position: 0
    },
    {
      title: 'Product Code',
      propertyName: 'prodname',
      order: {
        enable: true,
        tag: 'prodname'
      },
      position: 1
    },
    {
      title: 'Quantity Per',
      propertyName: 'quantityper',
      order: {
        enable: true,
        tag: 'quantityper'
      },
      position: 2
    },
    {
      title: 'Export Quantity',
      propertyName: 'expquantity',
      order: {
        enable: true,
        tag: 'expquantity'
      },
      position: 3
    },
    {
      title: 'Total Quantity',
      propertyName: 'totquantity',
      order: {
        enable: true,
        tag: 'totquantity'
      },
      position: 4
    },
    {
      title: 'Available Export Quantity',
      propertyName: 'availexpquantity',
      order: {
        enable: true,
        tag: 'availexpquantity'
      },
      position: 5
    }
  ];
  docPreview = false;
  claimRequestParams: FormGroup;

  // build Columns
  columnsA: MatTableColumn[] = [
    {
      name: "rowNum",
      isSort: true,
      isFilter: false
    },
    {
      name: "itemName",
      isSort: true,
      isFilter: false
    },
    {
      name: "itemID",
      isSort: true,
      isFilter: false
    },
    {
      name: "action",
      isSort: true,
      isFilter: false
    }
  ];

  columnsB: MatTableColumn[] = [
    {
      name: "rowNum",
      isSort: true,
      isFilter: false
    },
    {
      name: "itemName",
      isSort: true,
      isFilter: false
    },
    {
      name: "itemID",
      isSort: true,
      isFilter: false
    },
    {
      name: "action",
      isSort: true,
      isFilter: false
    }
  ];
  ///
  selectedA: number;
  selectedB: number;
  selectedC: number;
  company: SelectedCompany;
  filterA = true;
  filterB = false;
  loading = false;
  // User
  currentUser: User;
  currentClaim: SelectedCompanyClaim;
  extensionDays = [];
  lookBackDays = [];

  pageA: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };
  pageB: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };
  pageC: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  }
  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private themeService: ThemeService,
    private userService: UserService,
    private companyService: CompanyService,
    private claimService: ServicesService) {
      this.lookBackDays.push(
        {value: 180},
        {value: 270},
        {value: 360},
        {value: 540},
        {value: 730},
        {value: 900}
        );
      this.extensionDays.push(
        {value: 10},
        {value: 11},
        {value: 12},
        {value: 13},
        {value: 14},
        {value: 15}
        );
     }
    
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.claimService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$)).subscribe((res)=> {
      console.log('loading claim..');
      this.currentClaim = res;
      console.log(this.currentClaim);
    });
    this.currentUser = this.userService.getCurrentUser();
    // INIT FORM DATA
    this.initClaimForm();

    // INIT data
    this.loadDataSets();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  // initServiceType() {
  //   switch(this.currentClaim.serviceID) {
  //     case 1:  // 521
  //       break;
  //     case 2: // 536
  //     break;
  //     case 3: 
  //   } 
  // }
  loadDataSets() {
    this.loading = true;
    this.loadMainDataSet();
    this.loading = false;
  }
  /****** PARAMS *******/
  initClaimForm() {
   
    this.claimRequestParams = this.formBuilder.group({
      LookBackDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
      ExtensionDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
      ExportStartDate: ['', { validators: [Validators.required] , updateOn: 'blur'}],
      ExportEndDate: ['', { validators: [Validators.required] , updateOn: 'blur'}],
      selectedPermits: ['', { validators: [Validators.required] , updateOn: 'blur'}],
      ClaimDate: ['', { validators: [Validators.required] , updateOn: 'blur'}]
    });
    this.pageEvent = {
      pageIndex: 0,
      pageSize: 10,
      length: 0
    };
    this.initClaimFormData();
  }
  initClaimFormData() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        companyID: this.currentClaim.companyID,
        rowStart: 1,
        rowEnd: 5
      },
      requestProcedure: `CompanyServiceClaimsList`
    };

    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: any) => {
        let objectKeys: string[];
        let objectValues: string[];
        res.data.forEach(obj => {

          objectKeys = Object.keys(obj);
          objectValues = Object.values(obj);
          
          objectKeys.forEach((element: string, i:number) => {
            if (this.claimRequestParams.get(element) !== null 
            && this.claimRequestParams.get(element) !== undefined) {
                if (element === 'ClaimDate') {
                  console.log(new Date(objectValues[i]));
                  this.claimRequestParams.get(element).setValue(new Date(objectValues[i]));
                } else {
                  this.claimRequestParams.get(element).setValue(objectValues[i]);
                }
                

            }
            
          });
        });
        // Get objects and values from res
        this.loading =false;
      },
      msg => {
        //snackbaa
      }
    );
  }
  updateClaimParams() {
    console.log('Updating claim params..');

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        lookbackDays: this.claimRequestParams.get('lookbackDays').value,
        extensionDays: this.claimRequestParams.get('extensionDays').value,
        exportStartDate: this.claimRequestParams.get('exportStartDate').value,
        exportEndDate: this.claimRequestParams.get('exportEndDate').value,
        claimDate: this.claimRequestParams.get('claimDate').value,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        companyID: this.currentClaim.companyID
      },
      requestProcedure: `CompanyServiceClaimsUpdate`
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/update`,model).then(
      (res:UpdateResponse ) => {
        console.log(res);
      }
    );

  }
    /****** END PARAMS *******/

    /****** IMPORTS *******/
  //Main Left Table
  loadMainDataSet() {
    const reqP = {
      userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID ,
        rowStart: this.pageA.pageIndex * this.pageA.pageSize + 1,
        rowEnd: (this.pageA.pageIndex * this.pageA.pageSize) + this.pageA.pageSize
    };
    const model = {
      requestParams: reqP,
      requestProcedure: `ImportsList${this.currentClaim.serviceName}`
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: any) => {
        console.log(res);
        if (res.outcome.outcome === 'SUCCESS') {
         this.pageA.length = res.rowCount;
          this.data = res.data; 
          console.log(this.data);
        } else {
         
          // error
        }
      },
      (msg) => {
  
      }
    );
  }

  rowEventA($event) {
    console.log($event);
    this.selectedA = $event.lineA;
    this.selectedB = $event.lineB;
    console.log($event);
    this.loadTopChild($event);
    this.loadBottomChild($event);
  }

  rowEventB($event) {
    console.log($event);
    this.selectedB = $event;
    this.actionTopChild($event);
    this.loadBottomChild($event);
    this.loadTopChild($event);
  }

  rowEventC($event) {
    console.log($event);
    this.selectedC = $event;
  }
  /****** END IMPORTS *******/
  // Top Right Table
  loadTopChild(id: number) {
    console.log(id);
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        captureJoinImportID: this.selectedA,
        rowStart: this.pageB.pageIndex * this.pageB.pageSize + 1,
        rowEnd: (this.pageB.pageIndex * this.pageB.pageSize) + this.pageB.pageSize
      },
      requestProcedure: `CompanyServiceClaimLineList${this.currentClaim.serviceName}`

    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ReadResponse) => {
        if(res.outcome.outcome === 'SUCCESS') {
          this.loading = false;
          this.dataLinesAssigned = res.data;
          this.pageB.length = res.rowCount;

        }
      }
    );
  }
  actionTopChild(id: number) {

  }
  // Bottom Right Table
  loadBottomChild(id: number) {
    console.log(id);
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        itemID: this.selectedB,
        rowStart: this.pageB.pageIndex * this.pageB.pageSize + 1,
        rowEnd: (this.pageB.pageIndex * this.pageB.pageSize) + this.pageB.pageSize
      },
      requestProcedure: `ExportsList${this.currentClaim.serviceName}`

    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ReadResponse) => {
        if(res.outcome.outcome === 'SUCCESS') {
          this.loading = false;
          this.dataLinesAvailable = res.data;
          this.pageB.length = res.rowCount;

        }
      }
    );
  }
  actionBottomChild() {

  }

  paginateA($event) {
    this.pageA = $event;
    this.loadMainDataSet();
  }
  paginateB($event) {
    this.pageB = $event;
    this.loadTopChild($event);
  }
  paginateC($event) {
    this.pageC = $event;
    this.loadBottomChild($event);
  }
}

export class UpdateResponse {
  outcome: Outcome
  createdID?: number;
}
export class ReadResponse {
  data: any[];
  outcome: Outcome;
  rowCount: number;
}
