import { environment } from 'src/environments/environment';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tariff, TariffListResponse } from 'src/app/models/HttpResponses/TariffListResponse';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { PermitTariffInfoComponent } from '../add-company-permit/permit-tariff-info/permit-tariff-info.component';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';

@Component({
  selector: 'app-edit-permit-dialog',
  templateUrl: './edit-permit-dialog.component.html',
  styleUrls: ['./edit-permit-dialog.component.scss']
})
export class EditPermitDialogComponent implements OnInit, AfterViewInit {


  constructor(private userService: UserService,
              private companyService: CompanyService,
              private api: ApiService,
              private matDialog: MatDialog,
              private snackbarService: HelpSnackbar,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EditPermitDialogComponent>) { }
  form = new FormGroup({
    PermitCode: new FormControl(null, [Validators.required]),
    permitDate: new FormControl(null, [Validators.required]),
    importdateStart: new FormControl(null, [Validators.required]),
    importdateEnd: new FormControl(null, [Validators.required]),
    exportdateStart: new FormControl(null, [Validators.required]),
    exportdateEnd: new FormControl(null, [Validators.required]),
  });
  prccForm = new FormGroup({
    prccNumber: new FormControl(null, [Validators.required]),
    prccCustomValue: new FormControl(null, [Validators.required]),
    prccRegNo: new FormControl(null, [Validators.required]),
    prccFileNo: new FormControl(null, [Validators.required]),
    prccStartDate: new FormControl(null, [Validators.required]),
    prccEndDate: new FormControl(null, [Validators.required]),
    prccImportStartDate: new FormControl(null, [Validators.required]),
    prccImportEndDate: new FormControl(null, [Validators.required])
  });
  epcForm = new FormGroup({
    epcCode: new FormControl(null, [Validators.required]),
    epcTariffs: new FormControl(null)
  });

  selectedTariffs: Tariff[] = [];
  file: File[];
  filePreview: any;
  displayPreview: any;
  processing: any;
  selectedImportTariffs = [];
  selectedExportTariff: number;
  companyID: number;
  companyName: string;
  Permit: any;
  permitTypeID: number;
  importTariffs = new FormControl(null, [Validators.required]);
  exportTariff = new FormControl(null, [Validators.required]);

  public activeIndex = 0;
  public activeTariff: any = null;
  public paginationControl = new FormControl(1);
  public SPName = '';
  requestParams : object;

  private currentUser = this.userService.getCurrentUser();
  private dateErrOp ='';

  public mask = {
    // guide: true,
    // showMask: true,
    // keepCharPositions : true,
     mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] // i made changes here
   };

  ngOnInit() {
    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });
    this.permitTypeID = this.data.permitTypeID;
    this.Permit = this.data.permit;
    console.log('Permit');
    console.log(this.Permit);

    this.importTariffs.valueChanges.subscribe(async (value) => {
      console.log(value);

      if (value) {

        const model: GetTariffList = {
          filter: '',
          userID: this.currentUser.userID,
          specificTariffID: value,
          rowStart: 1,
          rowEnd: 10
        };

        await this.companyService.getTariffList(model).then(
          (res: TariffListResponse) => {
            console.log(res);

            if (res.outcome.outcome === 'SUCCESS') {
              // Removes Tariff object if exists
              this.selectedImportTariffs = [...this.selectedImportTariffs.filter(x => +x.id !== +value)];

              this.matDialog.open(PermitTariffInfoComponent, {
                data: {
                  tariffID: res.tariffList[0].id,
                  subHeading: res.tariffList[0].subHeading,
                  itemNumber: res.tariffList[0].itemNumber,
                  permitTypeID: this.permitTypeID,
                },
                width: '512px'
              }).afterClosed().subscribe((tariffObj) => {
                if (tariffObj) {
                  console.log(tariffObj);
                  // Adds record from api
                  this.selectedImportTariffs.push(tariffObj);
                  this.importTariffs.setValue(null, { emitEvent: false });
                }
              });
            }
          }
        );
      }
    });

    this.epcForm.controls.epcTariffs.valueChanges.subscribe(async (value) =>{
      if (value) {
        const model: GetTariffList = {
          filter: '',
          userID: this.currentUser.userID,
          specificTariffID: value,
          rowStart: 1,
          rowEnd: 10
        };

        await this.companyService.getTariffList(model).then(
          (res: TariffListResponse) => {
            if (res.outcome.outcome === 'SUCCESS') {
              this.selectedImportTariffs = [...this.selectedImportTariffs.filter(x => +x.id !== +value)];
              this.matDialog.open(PermitTariffInfoComponent, {
                data: {
                  tariffID: res.tariffList[0].id,
                  subHeading: res.tariffList[0].subHeading == null ? res.tariffList[0].heading: res.tariffList[0].subHeading,
                  permitTypeID: this.permitTypeID,
                },
                width: '512px'
              }).afterClosed().subscribe((tariffObj) => {
                if (tariffObj) {
                  this.selectedImportTariffs.push(tariffObj);
                  this.epcForm.controls.epcTariffs.setValue(null, { emitEvent: false })
                }
              });
            }
          }
        );
      }
    });

    if (this.permitTypeID === 1) {
      this.loadImportTariffs();
    } else if (this.permitTypeID === 3) {
      this.loadTariffItems()
    }


    this.exportTariff.valueChanges.subscribe(async (value) => {
      console.log('value');
      console.log(value);

      if (value) {
        this.selectedExportTariff = +value;
      }
    });
  }

  ngAfterViewInit() {
    this.form.controls.PermitCode.setValue(this.Permit.permitCode);
    this.form.controls.permitDate.setValue(new Date(this.Permit.permitDate));
    this.form.controls.importdateStart.setValue(new Date(this.Permit.importdateStart));
    this.form.controls.importdateEnd.setValue(new Date(this.Permit.importdateEnd));
    this.form.controls.exportdateStart.setValue(new Date(this.Permit.exportdateStart));
    this.form.controls.exportdateEnd.setValue(new Date(this.Permit.exportdateEnd));
    this.exportTariff.setValue(this.Permit.exportTariffID, { emitEvent: false });
    this.exportTariff.updateValueAndValidity();
    this.selectedExportTariff = this.Permit.exportTariffID;

    this.prccForm.controls.prccNumber.setValue(this.Permit.prccNumber);
    const custom = new String(this.Permit.customValue).replace(/,/gi,'.');
    console.log(custom);
    this.prccForm.controls.prccCustomValue.setValue(new Number(custom));
    this.prccForm.controls.prccRegNo.setValue(this.Permit.regNo);
    this.prccForm.controls.prccFileNo.setValue(this.Permit.fileNo);
    this.prccForm.controls.prccStartDate.setValue(new Date(this.Permit.startDate));
    this.prccForm.controls.prccEndDate.setValue(new Date(this.Permit.endDate));
    this.prccForm.controls.prccImportStartDate.setValue(new Date(this.Permit.importStartDate));
    this.prccForm.controls.prccImportEndDate.setValue(new Date(this.Permit.importEndDate));

    this.epcForm.controls.epcCode.setValue(this.Permit.epcCode)
    this.selectedImportTariffs = [];
    /* console.log('exportTariff');
    console.log(this.exportTariff.value);
    console.log(this.selectedExportTariff); */
  }

  inputFileChange(){

  }

  loadImportTariffs() {
    const model = {
      request: {
        userID: this.currentUser.userID,
        permitID: this.Permit.permitID
      },
      procedure: 'PermitImportTafiffsList'
    };
    /* console.log('PermitImportTariffList');
    console.log(model); */
    this.api.post(`${environment.ApiEndpoint}/capture/list`, model)
    .then(
      (res: any) => {
        for (let item of res.data){
          this.selectedImportTariffs.push(item);
        }
        // this.selectedImportTariffs = res.data;
        console.log(this.selectedImportTariffs);
      }
    );
  }

  loadTariffItems() {
    const model = {
      request: {
        userID: this.currentUser.userID,
        ePCID: this.Permit.epcID,
      },
      procedure: 'EPCTariffsList'
    };
    /* console.log('EPCTariffList');
    console.log(model); */
    this.api.post(`${environment.ApiEndpoint}/capture/list`, model)
    .then(
      (res: any) => {
        console.log(res);
        for (let item of res.data) {
          if (item.isDeleted !== true) {
            item.isLocal = true;
            item.isDeleted = false;
            this.selectedImportTariffs.push(item);
          }
        }
        console.log(this.selectedImportTariffs)
      }
    );
  }

   toDate(value, control) {
    control.setValue(new Date(value));
  }

  removeTariff(index: number) {
    if (this.permitTypeID === 1) {
      this.selectedImportTariffs.splice(index, 1);
    } else if (this.permitTypeID === 3) {
      this.selectedImportTariffs[index].isDeleted = true;
    }
  }

  prevTarrif() {
    if (this.activeIndex >= 1) {
      this.activeIndex--;
      this.activeTariff = this.selectedImportTariffs[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });

      // this.refresh();
    }
  }

  nextTarrif() {
    this.activeIndex++;

    if (this.activeIndex < (this.selectedImportTariffs ? this.selectedImportTariffs.length : 0)) {
      this.activeTariff = this.selectedImportTariffs[this.activeIndex];
      this.paginationControl.setValue(this.activeIndex + 1, { emitEvent: false });
      // this.refresh();
    } else {
      this.activeIndex--;
    }
  }

  async deleteTariffPrompt() {
    const targetLine = this.selectedImportTariffs[this.activeIndex];

    if (this.selectedImportTariffs.length === 1) {
      this.selectedImportTariffs = [];
      this.activeTariff = null;
      this.activeIndex = -1;
      this.paginationControl.setValue(1, { emitEvent: false });
    } else {
      this.selectedImportTariffs.splice(this.selectedImportTariffs.indexOf(targetLine), 1);
      this.activeIndex = 0;
      this.activeTariff = this.selectedImportTariffs[this.activeIndex];
      this.paginationControl.setValue(1, { emitEvent: false });
    }

    // this.refresh();
  }

  dismiss() {
    this.dialogRef.close(false);
  }

  async formSubmit() {
    let err = 0;

    if (this.permitTypeID === 1) {
      this.SPName = 'PermitUpdate';
      this.requestParams = this.PermitModel();
      if (!this.form.valid) {
        err++;
        this.dateErrOp = 'There are errors';
      }
      if (this.form.controls.importdateEnd.value < this.form.controls.importdateStart.value || this.form.controls.exportdateEnd.value < this.form.controls.exportdateStart.value) {
        this.dateErrOp = 'End date cannot be lower than start date ';
         err++;
     }
    } else if (this.permitTypeID === 2) {
      this.SPName = 'PRCCUpdate';
      this.requestParams = this.PRCCModel();
      //console.log(this.prccForm);
      if (!this.prccForm.valid) {
        err++;
      }
    } else if (this.permitTypeID === 3) {
      this.SPName = 'EPCUpdate';
      this.requestParams = this.EPCModel();
      if (!this.epcForm.valid || this.selectedImportTariffs.length == 0){
        err++;
      }
    }
    if (err === 0) {
      /* const model: any = {
        request: {
          permitID: this.data.permitID,
          userID: this.currentUser.userID,
          companyID: this.companyID,
          permitCode: this.form.controls.PermitCode.value,
          dateStart: this.form.controls.dateStart.value,
          dateEnd: this.form.controls.dateEnd.value,
          importDateStart: this.form.controls.importdateStart.value,
          importDateEnd: this.form.controls.importdateEnd.value,
          exportDateStart: this.form.controls.exportdateStart.value,
          exportDateEnd: this.form.controls.exportdateEnd.value,
          tariff: this.selectedImportTariffs,
          exportTariffID: this.selectedExportTariff,
        },
        procedure: 'PermitUpdate'
      }; */
      console.log('model');
      console.log(this.requestParams);
      this.dialogRef.close(this.requestParams);
      /* await this.api.post(`${environment.ApiEndpoint}/capture/post`,
      model).then(
        (res: any) => {
          console.log('res');
          console.log(res);
          if  (res.outcome) {
            console.log(res);
          } else {
            // no outcome
          }
        }
      ); */
    }
    else{
      this.snackbar.open(this.dateErrOp, '', { duration: 3000 });
    }
  }

  PermitModel(): object {
    console.log(this.selectedImportTariffs);
    const obj = {
      permitID: this.Permit.permitID,
      userID: this.currentUser.userID,
      companyID: this.companyID,
      permitCode: this.form.controls.PermitCode.value,
      permitDate: this.form.controls.permitDate.value,
      importDateStart: this.form.controls.importdateStart.value,
      importDateEnd: this.form.controls.importdateEnd.value,
      exportDateStart: this.form.controls.exportdateStart.value,
      exportDateEnd: this.form.controls.exportdateEnd.value,
      tariff: this.selectedImportTariffs.map((e) => {
        return {
          tariffID: e.PermitImportTariffID === undefined ? e.tariffID : e.PermitImportTariffID,
          uomID: e.UnitOfMeasureID === undefined ? e.unitOfMeasureID : e.UnitOfMeasureID,
          quantity: e.Quantity === undefined ? e.quantity : e.Quantity,
          price: e.Price === undefined ? e.price : e.Price,
        };
      }),
      exportTariffID: this.selectedExportTariff
      //procedure: this.SPName
    };
    return obj;
  }

  PRCCModel(): object {
    const obj = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      prccID: this.Permit.prccID,
      prccNumber: this.prccForm.controls.prccNumber.value,
      customValue: this.prccForm.controls.prccCustomValue.value,
      regNo: this.prccForm.controls.prccRegNo.value,
      fileNo: this.prccForm.controls.prccFileNo.value,
      startDate: this.prccForm.controls.prccStartDate.value,
      endDate: this.prccForm.controls.prccEndDate.value,
      importStartDate: this.prccForm.controls.prccImportStartDate.value,
      importEndDate: this.prccForm.controls.prccImportEndDate.value
      //procedure: this.SPName
    };
    console.log(obj);
    return obj;
  }

  EPCModel(): object {
    const obj = {
      userID: this.currentUser.userID,
      epcID: this.Permit.epcID,
      epcCode: this.epcForm.controls.epcCode.value,
      EPCTariffs: this.selectedImportTariffs.map((e) => {
        return {
          EPCTariffID: e.EPCTariffID,
          TariffID: e.TariffID,
          ItemID: e.ItemID,
          isLocal: e.isLocal,
          isDeleted: e.isDeleted
        };
      }),
      //procedure: this.SPName
    };
    console.log(obj);
    return obj
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

}
