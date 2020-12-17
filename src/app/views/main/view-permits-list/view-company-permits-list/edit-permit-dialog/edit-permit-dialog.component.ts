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
    importTariffs: new FormControl(null, [Validators.required]),
    exportTariff: new FormControl(null, [Validators.required])
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
    epcTariffs: new FormControl(null, [Validators.required])
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

    this.form.controls.importTariffs.valueChanges.subscribe(async (value) => {
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
                },
                width: '512px'
              }).afterClosed().subscribe((tariffObj) => {
                if (tariffObj) {

                  // Adds record from api
                  this.selectedImportTariffs.push(tariffObj);
                  this.form.controls.importTariffs.setValue(null, { emitEvent: false });
                }
              });
            }
          }
        );
      }
    });
    this.loadImportTariffs();

    this.form.controls.exportTariff.valueChanges.subscribe(async (value) => {
      console.log('value');
      console.log(value);

      if (value) {
        this.selectedExportTariff = +value;
      }
    });
  }

  ngAfterViewInit() {
    this.form.controls.PermitCode.setValue(this.Permit.permitCode);
    this.form.controls.permitDate.setValue(this.Permit.permitDate);
    this.form.controls.importdateStart.setValue(this.Permit.importdateStart);
    this.form.controls.importdateEnd.setValue(this.Permit.importdateEnd);
    this.form.controls.exportdateStart.setValue(this.Permit.exportdateStart);
    this.form.controls.exportdateEnd.setValue(this.Permit.exportdateEnd);
    this.form.controls.exportTariff.setValue(this.Permit.exportTariffID, { emitEvent: false });
    this.form.controls.exportTariff.updateValueAndValidity();
    this.selectedExportTariff = this.Permit.exportTariffID;

    this.prccForm.controls.prccNumber.setValue(this.Permit.prccNumber);
    this.prccForm.controls.prccCustomValue.setValue(this.Permit.customValue);
    this.prccForm.controls.prccRegNo.setValue(this.Permit.regNo);
    this.prccForm.controls.prccFileNo.setValue(this.Permit.fileNo);
    this.prccForm.controls.prccStartDate.setValue(new Date(this.Permit.startDate));
    this.prccForm.controls.prccEndDate.setValue(new Date(this.Permit.endDate));
    this.prccForm.controls.prccImportStartDate.setValue(new Date(this.Permit.importStartDate));
    this.prccForm.controls.prccImportEndDate.setValue(new Date(this.Permit.importEndDate));

    /* console.log('exportTariff');
    console.log(this.exportTariff.value);
    console.log(this.selectedExportTariff); */
  }

  loadImportTariffs() {
    const model = {
      requestParams: {
        userID: this.currentUser.userID,
        permitID: this.Permit.permitID
      },
      requestProcedure: 'PermitImportTafiffsList'
    };
    /* console.log('PermitImportTariffList');
    console.log(model); */
    this.api.post(`${environment.ApiEndpoint}/capture/read/list`, model)
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

   toDate(value, control) {
    control.setValue(new Date(value));
  }

  removeTariff(index: number) {
    this.selectedImportTariffs.splice(index, 1);
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
          tariffID: e.PermitImportTariffID,
          uomID: e.UnitOfMeasureID,
          quantity: e.Quantity,
          price: e.Price,
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
      companyID: this.companyID,
      epcCode: ''
      //procedure: this.SPName
    };
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
