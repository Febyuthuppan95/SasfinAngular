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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EditPermitDialogComponent>) { }
  form = new FormGroup({
    PermitCode: new FormControl(null, [Validators.required]),
    dateStart: new FormControl(null, [Validators.required]),
    dateEnd: new FormControl(null, [Validators.required]),
    importdateStart: new FormControl(null, [Validators.required]),
    importdateEnd: new FormControl(null, [Validators.required]),
    exportdateStart: new FormControl(null, [Validators.required]),
    exportdateEnd: new FormControl(null, [Validators.required]),
  });
  importTariffs = new FormControl(null, [Validators.required]);
  exportTariff = new FormControl(null, [Validators.required]);
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

  public activeIndex = 0;
  public activeTariff: any = null;
  public paginationControl = new FormControl(1);

  private currentUser = this.userService.getCurrentUser();

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
                },
                width: '512px'
              }).afterClosed().subscribe((tariffObj) => {
                if (tariffObj) {

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
    this.loadImportTariffs();

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
    this.form.controls.dateStart.setValue(this.Permit.dateStart);
    this.form.controls.dateEnd.setValue(this.Permit.dateEnd);
    this.form.controls.importdateStart.setValue(this.Permit.importdateStart);
    this.form.controls.importdateEnd.setValue(this.Permit.importdateEnd);
    this.form.controls.exportdateStart.setValue(this.Permit.exportdateStart);
    this.form.controls.exportdateEnd.setValue(this.Permit.exportdateEnd);
    this.exportTariff.setValue(this.Permit.exportTariffID, { emitEvent: false });
    this.exportTariff.updateValueAndValidity();
    this.selectedExportTariff = this.Permit.exportTariffID;

    console.log('exportTariff');
    console.log(this.exportTariff.value);
    console.log(this.selectedExportTariff);
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

    if (!this.form.valid) {
      err++;
    }
    if (err === 0) {
      const model = {
          permitID: this.Permit.permitID,
          userID: this.currentUser.userID,
          companyID: this.companyID,
          permitCode: this.form.controls.PermitCode.value,
          dateStart: this.form.controls.dateStart.value,
          dateEnd: this.form.controls.dateEnd.value,
          importDateStart: this.form.controls.importdateStart.value,
          importDateEnd: this.form.controls.importdateEnd.value,
          exportDateStart: this.form.controls.exportdateStart.value,
          exportDateEnd: this.form.controls.exportdateEnd.value,
          tariff: this.selectedImportTariffs.map((e)=> {
            return {
              tariffID: e.PermitImportTariffID,
              uomID: e.UnitOfMeasureID,
              quantity: e.Quantity,
              price: e.Price,
            };
          }),
          exportTariffID: this.selectedExportTariff
      };

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
      console.log(model);
     // this.dialogRef.close(model);
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
  }


}
