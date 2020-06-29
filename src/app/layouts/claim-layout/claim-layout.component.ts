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
import { PageEvent, MatSnackBar } from '@angular/material';
import { ServicesService, SelectedCompanyClaim } from 'src/app/services/Services.Service';
import { takeUntil, ignoreElements } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Outcome } from 'src/app/models/HttpResponses/DoctypeResponse';
import { Router } from '@angular/router';
import { ListReadResponse } from 'src/app/components/forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';

@Component({
  selector: 'app-claim-layout',
  templateUrl: './claim-layout.component.html',
  styleUrls: ['./claim-layout.component.scss']
})
export class ClaimLayoutComponent implements OnInit, OnDestroy {


  pageEvent: PageEvent;
  dataS: ClaimSAD500[] =[];
  data: any[] =[];
  showMain: boolean = false;
  headings: TableHeading[] =[];
  dataLinesAvailable: any[] = []
  headingsB: TableHeading[]=[];
  dataLinesAssigned: any[] = [];
  headingsC: TableHeading[]= [];
  headingsS: TableHeading[]= [];
  docPreview = false;
  claimRequestParams: FormGroup;

  // build Columns
  columnsA: MatTableColumn[] = [
    {
      name: 'rowNum',
      isSort: true,
      isFilter: false
    },
    {
      name: 'itemName',
      isSort: true,
      isFilter: false
    },
    {
      name: 'itemID',
      isSort: true,
      isFilter: false
    },
    {
      name: 'action',
      isSort: true,
      isFilter: false
    }
  ];

  columnsB: MatTableColumn[] = [
    {
      name: 'rowNum',
      isSort: true,
      isFilter: false
    },
    {
      name: 'itemName',
      isSort: true,
      isFilter: false
    },
    {
      name: 'itemID',
      isSort: true,
      isFilter: false
    },
    {
      name: 'action',
      isSort: true,
      isFilter: false
    }
  ];
  ///
  selectedA: number;
  selectedB: number;
  selectedC: number;
  selectedD: number;
  company: SelectedCompany;
  filterA = true;
  filterS = true;
  filterB = false;
  loading = false;
  importLabel = "Available Imports";
  // User
  currentUser: User;
  currentClaim: SelectedCompanyClaim;
  extensionDays = [];
  dutyPercentages = [];
  lookBackDays = [];
  pageS: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };
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
              private userService: UserService,
              private claimService: ServicesService,
              private companyService: CompanyService,
              private snackbar: MatSnackBar,
              private router: Router) {
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
      this.dutyPercentages.push(
          {value: 20},
        {value: 21},
        {value: 22},
        {value: 23},
        {value: 24},
        {value: 25}
        )
     }

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.claimService.observeCompany()
    .pipe(takeUntil(this.unsubscribe$)).subscribe((res)=> {
      this.currentClaim = res;
      this.currentUser = this.userService.getCurrentUser();
      this.showMain = false;
      this.init();
    });
  }

  async init() {
    // INIT FORM DATA
    this.initClaimForm();
    // Table Headers
    this.initTableHeaders();
    // Check main
    this.initService();
    // INIT data
    // await this.loadMainDataSet();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
  back() {
    this.router.navigate(['companies', 'serviceclaims']);
  }
  reset() {
    this.loading = true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID
      },
      requestProcedure: `CompanyServiceClaimLineReset${this.currentClaim.serviceName}`
    };
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/update`, model).then(
      (res: Outcome) => {
        if(res.outcome === 'SUCCESS') {
          this.snackbar.open('Successfully Reset Claim', res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });

          this.loadDataSets();
        } else {
          this.snackbar.open(res.outcomeMessage, res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });
        }
        this.loading = false;
      },
      msg => {
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  initService() {
    this.showMain = true;
    console.log(this.currentClaim);
    if (this.currentClaim.serviceName === '538' && this.currentClaim.sad500ID < 1) {
      this.showMain = false;
    } 
    
  }
  async loadDataSets() {
    this.loading = true;
    await this.loadMainDataSet();
    await this.loadTopChild();
    await this.loadBottomChild();
    this.loading = false;
  }

  /****** PARAMS *******/
  initClaimForm() {
    switch(this.currentClaim.serviceName) {
      case '521': {
        this.claimRequestParams = this.formBuilder.group({
          LookBackDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ExtensionDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ExportStartDate: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ExportEndDate: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          selectedPermits: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ClaimDate: ['', { validators: [Validators.required] , updateOn: 'blur'}]
        });
        break;
      }
      case '536': {
        this.claimRequestParams = this.formBuilder.group({
          LookBackDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ExtensionDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ClaimDate: ['', { validators: [Validators.required] , updateOn: 'blur'}]
        });
        break;
      }
      case '538': {
        this.claimRequestParams = this.formBuilder.group({
          LookBackDays: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          ClaimDate: ['', { validators: [Validators.required] , updateOn: 'blur'}],
          DutyPercentage: ['', { validators: [Validators.required] , updateOn: 'blur'}]
        });
        break;
      }
      case '522': {
        this.claimRequestParams = this.formBuilder.group({
          LookBackDays: ['', { validators: [Validators.required] , updateOn: 'blur'}]
        });
        break;
      }
    }
    this.pageEvent = {
      pageIndex: 0,
      pageSize: 10,
      length: 0
    };
    this.initClaimFormData();
  }
  initTableHeaders() {
    switch(this.currentClaim.serviceName) {
      case '521': {
        this.headings = [
          {
            title: '',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst', // Selected A
            propertyName: 'cjid',
            order: {
              enable: true,
              tag: 'cjid'
            },
            position: 1
          },
          {
            title: 'IDsecond', // Selected B
            propertyName: 'itemID',
            order: {
              enable: true,
              tag: 'itemID'
            },
            position: 2
          },
          {
            title: 'Component Code',
            propertyName: 'itemName',
            order: {
              enable: true,
              tag: 'ItemName'
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
            title: 'Available HS Quantity',
            propertyName: 'availHSQuantity',
            order: {
              enable: true,
              tag: 'availHSQuantity'
            },
            position: 5
          },
          {
            title: 'Available Duty',
            propertyName: 'availDuty',
            order: {
              enable: true,
              tag: 'availDuty'
            },
            position: 6
          },
          {
            title: 'Total Duty',
            propertyName: 'totDuty',
            order: {
              enable: true,
              tag: 'totDuty'
            },
            position: 7
          },
          {
            title: 'Import Date',
            propertyName: 'importDate',
            order: {
              enable: true,
              tag: 'importDate'
            },
            position: 8
          }
        ];
        this.headingsB = [
          {
            title: '',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'capturejoinimportid',
            order: {
              enable: true,
              tag: 'capturejoinimportid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'companyServiceClaimLineID',
            order: {
              enable: true,
              tag: 'companyServiceClaimLineID'
            },
            position: 2
          },
          {
            title: 'Product Code',
            propertyName: 'prodname',
            order: {
              enable: true,
              tag: 'prodname'
            },
            position: 3
          },
          {
            title: 'Quantity',
            propertyName: 'quantity',
            order: {
              enable: true,
              tag: 'quantity'
            },
            position: 4
          },
          {
            title: 'Supply Unit',
            propertyName: 'supplyunit',
            order: {
              enable: true,
              tag: 'supplyunit'
            },
            position: 5
          },
          {
            title: 'Total Export Units',
            propertyName: 'totalexportunits',
            order: {
              enable: true,
              tag: 'totalexportunits'
            },
            position: 6
          }
        ];
        this.headingsC = [
          {
            title: '',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'cjid',
            order: {
              enable: true,
              tag: 'cjid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemid',
            order: {
              enable: true,
              tag: 'itemid'
            },
            position: 2
          },
          {
            title: 'Product Code',
            propertyName: 'prodname',
            order: {
              enable: true,
              tag: 'prodname'
            },
            position: 3
          },
          {
            title: 'Quantity Per',
            propertyName: 'quantityper',
            order: {
              enable: true,
              tag: 'quantityper'
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
          },
          {
            title: 'Export Quantity',
            propertyName: 'expquantity',
            order: {
              enable: true,
              tag: 'expquantity'
            },
            position: 6
          },
          {
            title: 'Total Quantity',
            propertyName: 'totquantity',
            order: {
              enable: true,
              tag: 'totquantity'
            },
            position: 7
          },
          {
            title: 'Export Date',
            propertyName: 'exportDate',
            order: {
              enable: true,
              tag: 'exportDate'
            },
            position: 8
          }
        ];
        this.importLabel = "Available Imports";
        break;
      }
      case '536': {
        this.headings = [
          {
            title: '#',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'cjid',
            order: {
              enable: true,
              tag: 'cjid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemID',
            order: {
              enable: true,
              tag: 'itemID'
            },
            position: 2
          },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
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
            title: 'Available HS Quantity',
            propertyName: 'availHSQuantity',
            order: {
              enable: true,
              tag: 'availHSQuantity'
            },
            position: 5
          },
          {
            title: 'Component Code',
            propertyName: 'itemName',
            order: {
              enable: true,
              tag: 'ItemName'
            },
            position: 6
          },
          {
            title: 'Available Duty',
            propertyName: 'availDuty',
            order: {
              enable: true,
              tag: 'availDuty'
            },
            position: 7
          },
          {
            title: 'Total Duty',
            propertyName: 'totDuty',
            order: {
              enable: true,
              tag: 'totDuty'
            },
            position: 8
          },
          // {
          //   title: 'Import Date',
          //   propertyName: 'importDate',
          //   order: {
          //     enable: true,
          //     tag: 'importDate'
          //   },
          //   position: 9
          // }
        ];
        this.headingsB = [
          {
            title: '',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'capturejoinimportid',
            order: {
              enable: true,
              tag: 'capturejoinimportid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'companyserviceclaimlineid',
            order: {
              enable: true,
              tag: 'companyserviceclaimlineid'
            },
            position: 2
          },
          // {
          //   title: 'MRN',
          //   propertyName: 'mrn',
          //   order: {
          //     enable: true,
          //     tag: 'mrn'
          //   },
          //   position: 3
          // },
          // {
          //   title: 'PRCC Number',
          //   propertyName: 'prccnumber',
          //   order: {
          //     enable: true,
          //     tag: 'prccnumber'
          //   },
          //   position: 3
          // },
          // {
          //   title: 'Customs Value',
          //   propertyName: 'customsvalue',
          //   order: {
          //     enable: true,
          //     tag: 'customsvalue'
          //   },
          //   position: 4
          // },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
            },
            position: 3
          },
          {
            title: 'Item',
            propertyName: 'name',
            order: {
              enable: true,
              tag: 'name'
            },
            position: 4
          },
          {
            title: 'Import HS Quantity',
            propertyName: 'importhsquantity',
            order: {
              enable: true,
              tag: 'importhsquantity'
            },
            position: 5
          },
          // {
          //   title: 'Avail Exp Quantity',
          //   propertyName: 'availexpquantity',
          //   order: {
          //     enable: true,
          //     tag: 'availexpquantity'
          //   },
          //   position: 5
          // },
          // {
          //   title: 'Export Quantity',
          //   propertyName: 'expquantity',
          //   order: {
          //     enable: true,
          //     tag: 'expquantity'
          //   },
          //   position: 6
          // },
          // {
          //   title: 'Total Quantity',
          //   propertyName: 'totquantity',
          //   order: {
          //     enable: true,
          //     tag: 'totquantity'
          //   },
          //   position: 7
          // },
          // {
          //   title: 'Export Date',
          //   propertyName: 'exportdate',
          //   order: {
          //     enable: true,
          //     tag: 'exportdate'
          //   },
          //   position: 8
          // }
        ];
        this.headingsC = [
          {
            title: '',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'oemsupplyid',
            order: {
              enable: true,
              tag: 'oemsupplyid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemid',
            order: {
              enable: true,
              tag: 'itemid'
            },
            position: 2
          },
          {
            title: 'Product Code',
            propertyName: 'prodname',
            order: {
              enable: true,
              tag: 'prodname'
            },
            position: 3
          },
          {
            title: 'Quantity Per',
            propertyName: 'quantityper',
            order: {
              enable: true,
              tag: 'quantityper'
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
          },
          {
            title: 'Export Quantity',
            propertyName: 'expquantity',
            order: {
              enable: true,
              tag: 'expquantity'
            },
            position: 6
          },
          {
            title: 'Total Quantity',
            propertyName: 'totquantity',
            order: {
              enable: true,
              tag: 'totquantity'
            },
            position: 7
          }
        ];
        break;
      }
      case '538': {
        this.headingsS = [
          {
            title: '#',
            propertyName: 'rowNum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'sad500id',
            order: {
              enable: true,
              tag: 'sad500id'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: null,
            order: {
              enable: true,
              tag: null
            },
            position: 2
          },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
            },
            position: 3
          }
        ];
        this.headings = [
          {
            title: '#',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'sadlineid',
            order: {
              enable: true,
              tag: 'sadlineid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemid',
            order: {
              enable: true,
              tag: 'itemid'
            },
            position: 2
          },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
            },
            position: 3
          },
          {
            title: 'Quantity',
            propertyName: 'quantity',
            order: {
              enable: true,
              tag: 'quantity'
            },
            position: 4
          },
          {
            title: 'Available Customs Value',
            propertyName: 'availcustomval',
            order: {
              enable: true,
              tag: 'availcustomval'
            },
            position: 5
          },
          {
            title: 'Component Code',
            propertyName: 'item',
            order: {
              enable: true,
              tag: 'item'
            },
            position: 6
          },
          {
            title: 'Duty',
            propertyName: 'duty',
            order: {
              enable: true,
              tag: 'duty'
            },
            position: 7
          },
          {
            title: 'Customs Value',
            propertyName: 'customval',
            order: {
              enable: true,
              tag: 'customval'
            },
            position: 8
          },
          // {
          //   title: 'Import Date',
          //   propertyName: 'importDate',
          //   order: {
          //     enable: true,
          //     tag: 'importDate'
          //   },
          //   position: 9
          // }
        ];
        this.headingsB = [
          {
            title: '',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'capturejoinimportid',
            order: {
              enable: true,
              tag: 'capturejoinimportid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'companyserviceclaimlineid',
            order: {
              enable: true,
              tag: 'companyserviceclaimlineid'
            },
            position: 2
          },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
            },
            position: 3
          },
          {
            title: 'Customs Value',
            propertyName: 'customsvalue',
            order: {
              enable: true,
              tag: 'customsvalue'
            },
            position: 4
          },
          {
            title: 'PRCC Number',
            propertyName: 'prccnumber',
            order: {
              enable: true,
              tag: 'prccnumber'
            },
            position: 5
          }
        ];
        this.headingsC = [
          {
            title: '',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'sad500lineid',
            order: {
              enable: true,
              tag: 'sad500lineid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'prccid',
            order: {
              enable: true,
              tag: 'prccid'
            },
            position: 2
          },
          {
            title: 'File No',
            propertyName: 'fileno',
            order: {
              enable: true,
              tag: 'fileno'
            },
            position: 3
          },
          {
            title: 'PRCC Number',
            propertyName: 'prccno',
            order: {
              enable: true,
              tag: 'prccno'
            },
            position: 4
          },
          {
            title: 'Reg Number',
            propertyName: 'regno',
            order: {
              enable: true,
              tag: 'regno'
            },
            position: 5
          },
          {
            title: 'Available Customs Value',
            propertyName: 'availcustval',
            order: {
              enable: true,
              tag: 'availcustval'
            },
            position: 6
          },
          {
            title: 'Total Customs Value',
            propertyName: 'totalcustval',
            order: {
              enable: true,
              tag: 'totalcustval'
            },
            position: 7
          }
        ];
        this.importLabel = "Available SAD500 Lines";
        break;
      }
      case '522': {
        this.headings = [
          {
            title: '#',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'cjid',
            order: {
              enable: true,
              tag: 'cjid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemID',
            order: {
              enable: true,
              tag: 'itemID'
            },
            position: 2
          },
          {
            title: 'MRN',
            propertyName: 'mrn',
            order: {
              enable: true,
              tag: 'mrn'
            },
            position: 3
          },
          {
            title: 'Item Code',
            propertyName: 'name',
            order: {
              enable: true,
              tag: 'name'
            },
            position: 4
          },
          {
            title: 'Available Quantity',
            propertyName: 'availquantity',
            order: {
              enable: true,
              tag: 'availquantity'
            },
            position: 5
          },
          {
            title: 'Available Duty',
            propertyName: 'availduty',
            order: {
              enable: true,
              tag: 'availduty'
            },
            position: 6
          }
        ];
        this.headingsB = [
          {
            title: '',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'capturejoinimportid',
            order: {
              enable: true,
              tag: 'capturejoinimportid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'companyServiceClaimLineID',
            order: {
              enable: true,
              tag: 'companyServiceClaimLineID'
            },
            position: 2
          },
          {
            title: 'Product Code',
            propertyName: 'name',
            order: {
              enable: true,
              tag: 'name'
            },
            position: 3
          },
          {
            title: 'Quantity',
            propertyName: 'quantity',
            order: {
              enable: true,
              tag: 'quantity'
            },
            position: 4
          }
        ];
        this.headingsC = [
          {
            title: '#',
            propertyName: 'rownum',
            order: {
              enable: false,
            },
            position: 0
          },
          {
            title: 'IDfirst',
            propertyName: 'invoicelineid',
            order: {
              enable: true,
              tag: 'invoicelineid'
            },
            position: 1
          },
          {
            title: 'IDsecond',
            propertyName: 'itemid',
            order: {
              enable: true,
              tag: 'itemid'
            },
            position: 2
          },
          {
            title: 'Item Code',
            propertyName: 'name',
            order: {
              enable: true,
              tag: 'name'
            },
            position: 3
          },
          {
            title: 'Total HS Quantity',
            propertyName: 'quantity',
            order: {
              enable: true,
              tag: 'quantity'
            },
            position: 4
          },
          {
            title: 'Available HS Quantity',
            propertyName: 'availquantity',
            order: {
              enable: true,
              tag: 'availquantity'
            },
            position: 5
          }
        ];
        break;
      }
    }

  }
  async initClaimFormData() {
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

    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ListReadResponse) => {
        console.log(res);
        let objectKeys: string[];
        let objectValues: string[];
        res.data.forEach(obj => {

          objectKeys = Object.keys(obj);
          objectValues = Object.values(obj);

          objectKeys.forEach((element: string, i:number) => {
            if (this.claimRequestParams.get(element) !== null
            && this.claimRequestParams.get(element) !== undefined) {
                if (element === 'ClaimDate') {
                  this.claimRequestParams.get(element).setValue(new Date(objectValues[i]));
                } else {
                  this.claimRequestParams.get(element).setValue(objectValues[i]);
                }
            }

          });
        });
        this.loading =false;
        if(this.currentClaim.serviceName !== '521') {
          this.loadClaimParams();
        } else {
          this.loadMainDataSet();
          this.showMain = true;
        }
        // Get objects and values from res

      },
      msg => {
        this.loading =false;
        //snackbaa
      }
    );
  }
  async loadClaimParams() {
    this.loading =true;
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        rowStart: 1,
        rowEnd: 5
      },
      requestProcedure: `CompanyServiceClaimParametersList`
    };

    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ListReadResponse) => {
       console.log(res);
       if(res.rowCount > 0) {
        if(res.data[0].SAD500ID === 0) {
          this.showMain = false; // Show SAD0500's
         
          // this.loadSADLineSet();
         } else {
          this.currentClaim.sad500ID = res.data[0].SAD500ID;
          let objectKeys: string[];
        let objectValues: string[];
        res.data.forEach(obj => {

          objectKeys = Object.keys(obj);
          objectValues = Object.values(obj);

          objectKeys.forEach((element: string, i:number) => {
            if (this.claimRequestParams.get(element) !== null
            && this.claimRequestParams.get(element) !== undefined) {
              this.claimRequestParams.get(element).setValue(objectValues[i]);
            }

          });
        });
          console.log(this.currentClaim);
          this.showMain = true; // Show SAD500 Lines
         }
       }
       this.loadMainDataSet();


        // Get objects and values from res
        this.loading = false;
      },
      msg => {
        this.loading =false;
        //snackbaa
      }
    );
  }
  updateClaimParams() {
    console.log('Updating claim params..');

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        lookbackDays: this.claimRequestParams.get('LookBackDays') ? this.claimRequestParams.get('LookBackDays').value : null,
        extensionDays: this.claimRequestParams.get('ExtensionDays') ? this.claimRequestParams.get('ExtensionDays').value: null,
        exportStartDate: this.claimRequestParams.get('ExportStartDate') ? this.claimRequestParams.get('ExportStartDate').value: null,
        exportEndDate: this.claimRequestParams.get('ExportEndDate') ? this.claimRequestParams.get('ExportEndDate').value : null,
        claimDate: this.claimRequestParams.get('ClaimDate') ? this.claimRequestParams.get('ClaimDate').value : null,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        companyID: this.currentClaim.companyID
      },
      requestProcedure: `CompanyServiceClaimsUpdate`
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/claim`,model).then(
      (res : UpdateResponse ) => {
        if(this.currentClaim.serviceName === '538') {
          this.update538Params();
        }
        console.log(res);
        this.loadMainDataSet();
      },
      msg => {
        console.log('error');
      }
    );

  }
  update538Params() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        dutyPercentage:this.claimRequestParams.get('Duty') ? this.claimRequestParams.get('Duty').value : null,
        sad500ID: this.currentClaim.sad500ID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        companyID: this.currentClaim.companyID
      },
      requestProcedure: `CompanyServiceClaimsParametersUpdate`
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/538/update`,model).then(
      (res : UpdateResponse ) => {
        this.snackbar.open('Successfully assigned SAD500', res.outcome.outcome, {
          duration: 3000,
          panelClass: 'claim-snackbar-success',
          horizontalPosition: 'center',
        });
        if(this.currentClaim.sad500ID > 0) {
          this.loadSADLineSet();
        } else {
          this.loadMainDataSet();
        }


        console.log(res);

      },
      msg => {
        console.log('error');
      }
    );
  }

  /****** END PARAMS *******/

  /****** IMPORTS *******/
  // Main Left Table
  async loadSADLineSet() {
    const reqP = {
      userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID ,
        sad500ID: this.currentClaim.sad500ID,
        rowStart: this.pageA.pageIndex * this.pageA.pageSize + 1,
        rowEnd: (this.pageA.pageIndex * this.pageA.pageSize) + this.pageA.pageSize
    };
    const model = {
      requestParams: reqP,
      requestProcedure: `ImportsListSADLine538`
    };
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: any) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.pageA.length = res.rowCount;
          this.data = res.data;
          this.showMain = true;
        } else {

          // error
        }
      },
      msg => {
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  async loadMainDataSet() {
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
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      async (res: any) => {
        if (res.outcome.outcome === 'SUCCESS') {
          if(this.selectedA === null || this.selectedA === undefined) {
            if(this.currentClaim.serviceName === '538') {
              console.log(this.showMain);
              if(this.showMain) {
                await this.loadSADLineSet(); // there is an SAD500ID
              } else {
                // No ID, still need to selected
                this.dataS = [];
                this.dataS = res.data;
                this.pageS.length = res.rowCount;
              }
           } else {
             this.data = [];
              this.data = res.data;
              this.pageA.length = res.rowCount;
              this.snackbar.open('Successfully Retrieved Imports', res.outcome.outcome, {
                duration: 3000,
                panelClass: 'claim-snackbar-success',
                horizontalPosition: 'center',
              });
           }

          }

        } else {

          // error
        }
      },
      msg => {
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  rowEventS($event) { // Assign SAD500ID
    const lineData = JSON.parse($event);
    this.selectedA = lineData.lineA;
    this.currentClaim.sad500ID = lineData.lineA;
    this.update538Params();
  }
  rowEventA($event) {
    const lineData = JSON.parse($event)
    this.selectedA = lineData.lineA; // cjid
    this.selectedB = lineData.lineB; // itemID
    this.selectedC = lineData.lineD; // Import Avail Quatity
    this.loadTopChild();
    this.loadBottomChild();
  }

  /**
   *
   * @param $event
   * 521, 536 - Assigned Lines Row Event
   */
  rowEventB($event) {
    const lineData = JSON.parse($event);
    
    this.selectedB = lineData.lineB; // Export cjid

    this.selectedC = lineData.lineC;
    this.updateTopChild();
  }

  rowEventC($event) {
    const lineData = JSON.parse($event)
    console.log(lineData);
    this.selectedB = lineData.lineA; // Export List CJID
    this.selectedD = lineData.lineD; // Export Line Quantity
    this.updateBottomChild();
  }
  /****** END IMPORTS *******/
  // Top Right Table
  async loadTopChild() {
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
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ReadResponse) => {
        console.log(res);
        if(res.outcome.outcome === 'SUCCESS') {
          this.dataLinesAssigned = [];
          this.loading = false;
          this.dataLinesAssigned = res.data;
          this.pageB.length = res.rowCount;
        }
      },
      msg => {
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  updateTopChild() {
    this.loading = true;

    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimLineID: this.selectedB,
        isDeleted: 1
      },
      requestProcedure: `CompanyServiceClaimLineUpdate${this.currentClaim.serviceName}`
    };
    console.log(model);
    this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/line`, model).then(
      (res: Outcome) => {
        if(res.outcome === 'SUCCESS') {
          this.snackbar.open('Successfully Unassigned', res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });
          this.loading = false;
          this.loadDataSets();
        }
      },
      msg => {
        this.loading = false;
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  // Bottom Right Table
  async loadBottomChild() {

    this.loading = true;
    let model = {};
    if(this.currentClaim.serviceName === '538') {
      model = {
        requestParams: {
          userID: this.currentUser.userID,
          companyServiceClaimID: this.currentClaim.companyServiceClaimID,
          sad500LineID: this.selectedA,
          rowStart: this.pageB.pageIndex * this.pageB.pageSize + 1,
          rowEnd: (this.pageB.pageIndex * this.pageB.pageSize) + this.pageB.pageSize
        },
        requestProcedure: `ExportsList${this.currentClaim.serviceName}`
      };
    } else {
      model = {
        requestParams: {
          userID: this.currentUser.userID,
          companyServiceClaimID: this.currentClaim.companyServiceClaimID,
          itemID: this.selectedB,
          rowStart: this.pageB.pageIndex * this.pageB.pageSize + 1,
          rowEnd: (this.pageB.pageIndex * this.pageB.pageSize) + this.pageB.pageSize
        },
        requestProcedure: `ExportsList${this.currentClaim.serviceName}`
      };
    }
   console.log(model);
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/read`, model).then(
      (res: ReadResponse) => {
        console.log(res);
        if(res.outcome.outcome === 'SUCCESS') {
          this.loading = false;
          this.dataLinesAvailable = [];
          this.dataLinesAvailable = res.data;
          console.log(this.dataLinesAvailable);
          this.pageC.length = res.rowCount;
        }
      },
      msg => {
        this.loading = false;
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }

  async updateBottomChild() {
    this.loading = true;
    let model = null;
    console.log(this.currentClaim.serviceName);
    switch(this.currentClaim.serviceName) {
      case '521': {
        model = {
          requestParams: {
            userID: this.currentUser.userID,
            companyServiceClaimID: this.currentClaim.companyServiceClaimID,
            captureJoinImportID: this.selectedA,
            captureJoinExportID: this.selectedB,
            importHSQuantity: this.selectedC,
            exportHSQuantity: this.selectedD
          },
          requestProcedure: `CompanyServiceClaimLineAdd${this.currentClaim.serviceName}`

        };
        break;
      }
      case '536': {
        model = {
          requestParams: {
            userID: this.currentUser.userID,
            companyServiceClaimID: this.currentClaim.companyServiceClaimID,
            captureJoinImportID: this.selectedA,
            oemSupplyID: this.selectedB,
            importHSQuantity: this.selectedC,
            supplyHSQuantity: this.selectedD
          },
          requestProcedure: `CompanyServiceClaimLineAdd${this.currentClaim.serviceName}`
        };

        break;
      }
      case '538': {
        model = {
          requestParams: {
            userID: this.currentUser.userID,
            companyServiceClaimID: this.currentClaim.companyServiceClaimID,
            captureJoinImportID: this.selectedA,
            prccID: this.selectedB,
            importAvailValue: this.selectedC,
            prccAvailValue: this.selectedD
          },
          requestProcedure: `CompanyServiceClaimLineAdd${this.currentClaim.serviceName}`
        };

        break;
      }
      case '522': {
        model = {
          requestParams: {
            userID: this.currentUser.userID,
            companyServiceClaimID: this.currentClaim.companyServiceClaimID,
            captureJoinImportID: this.selectedA,
            exportInvoiceLineID: this.selectedB,
            importHSQuantity: this.selectedC,
            exportHSQuantity: this.selectedD
          },
          requestProcedure: `CompanyServiceClaimLineAdd${this.currentClaim.serviceName}`
        };

        break;
      }
    }
    console.log(model);
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/create`, model).then(
      (res: Outcome) => {
        console.log(res);
        if(res.outcome === 'SUCCESS') {
          this.snackbar.open('Successfully Assigned', res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });
          this.loading = false;
          this.loadDataSets();
        }
      },
      msg => {
        this.loading = false;
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }
    );
  }
  async updateClaimLines() {
let model = {};
    if(this.currentClaim.serviceName === '521') {
      model = {
        requestParams: {
          userID: this.currentUser.userID,
          companyServiceClaimID: this.currentClaim.companyServiceClaimID,
          usageTypeID: 1
        },
        requestProcedure: 'UsageAdd'
      };
    } else {
      model = {
        requestParams: {
          userID: this.currentUser.userID,
          companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        },
        requestProcedure: `CompanyServiceClaimLineUsed${this.currentClaim.serviceName}`
      };
    }
    this.loading = true;
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/536/update`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.snackbar.open('Claim Submitted and sent for reporting. Please wait to be redirected..', res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          }).afterDismissed().subscribe(() =>{
            this.companyService.setClaimReport({
              companyID: this.currentClaim.companyID, 
              companyName: this.currentClaim.companyName, 
              companyServiceID: this.currentClaim.serviceID, 
              claimNumber: this.currentClaim.companyServiceClaimID, 
              serviceName: this.currentClaim.serviceName});
            this.router.navigate(['claim','reports']);
          });
        } else {
          this.snackbar.open(res.outcomeMessage, res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });
        }
      },
      msg => {

      });
  }
  async updateClaimStatus() {
    this.loading = true;
    const model ={
      requestParams: {
        userID: this.currentUser.userID,
        companyServiceClaimID: this.currentClaim.companyServiceClaimID,
        statusID: 2
      },
      requestProcedure: 'UpdateCompanyServiceClaimStatus'
    };
    await this.apiService.post(`${environment.ApiEndpoint}/serviceclaims/update/status`, model).then(
      (res: Outcome) => {
        if (res.outcome === 'SUCCESS') {
          this.snackbar.open('Claim Submitted and sent for reporting. Please wait to be redirected.', res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          }).afterDismissed().subscribe( () =>{
            this.router.navigate(['claim','reports']);
          });
        } else {
          this.snackbar.open(res.outcomeMessage, res.outcome, {
            duration: 3000,
            panelClass: ['claim-snackbar-success'],
            horizontalPosition: 'center',
          });
        }
        this.loading = false;
      },
      msg => {
        this.snackbar.open('An error occurred while performing action', 'FAILURE', {
          duration: 3000,
          panelClass: ['capture-snackbar-error'],
          horizontalPosition: 'center',
        });
      }

    );
  }
  paginateS($event) {
    this.pageS = $event;
    this.loadMainDataSet();
  }
  paginateA($event) {
    console.log($event);
    this.pageA = $event;
    this.loadMainDataSet();
  }
  paginateB($event) {
    this.pageB = $event;
    this.loadTopChild();
  }
  paginateC($event) {
    this.pageC = $event;
    this.loadBottomChild();
  }
}

export class UpdateResponse {
  outcome: Outcome;
  createdID?: number;
}
export class ReadResponse {
  data: any[];
  outcome: Outcome;
  rowCount: number;
}
export class LineData {
  lineA: number;
  lineB: number;
}

export class ClaimSAD500 {
  RowNum: number;
  SADID: number;
  SADLineID: number;
  Item: string;
  Quantity: number;
  CustomVal: number;
  Duty: number;
  AvailCustomVal: number;
}
