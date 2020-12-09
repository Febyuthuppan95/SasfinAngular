import { environment } from 'src/environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tariff, TariffListResponse } from 'src/app/models/HttpResponses/TariffListResponse';
import { ApiService } from 'src/app/services/api.service';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { UserService } from 'src/app/services/user.Service';
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';

@Component({
  selector: 'app-edit-permit-dialog',
  templateUrl: './edit-permit-dialog.component.html',
  styleUrls: ['./edit-permit-dialog.component.scss']
})
export class EditPermitDialogComponent implements OnInit {

  constructor(private userService: UserService,
              private companyService: CompanyService,
              private api: ApiService,
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
    this.Permit = this.data.Permit;


    this.form.controls.PermitCode.setValue(this.Permit.permitCode);
    this.form.controls.dateStart.setValue(this.Permit.dateStart);
    this.form.controls.dateEnd.setValue(this.Permit.dateEnd);
    this.form.controls.importdateStart.setValue(this.Permit.importdateStart);
    this.form.controls.importdateEnd.setValue(this.Permit.importdateEnd);
    this.form.controls.exportdateStart.setValue(this.Permit.exportdateStart);
    this.form.controls.exportdateEnd.setValue(this.Permit.exportdateEnd);
    this.exportTariff.setValue(this.Permit.exportTariffID);
    this.selectedImportTariffs = this.Permit.tariff;

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

        await this.companyService
        .getTariffList(model)
        .then(
          (res: TariffListResponse) => {
            console.log(res);

            if (res.outcome.outcome === 'SUCCESS') {
              // Removes Tariff object if exists
              this.selectedImportTariffs = [...this.selectedImportTariffs.filter(x => +x.id !== +value)];

              // Adds record from api
              this.selectedImportTariffs.push(res.tariffList[0].id);

              this.importTariffs.setValue(null, { emitEvent: false });
            }
          }
        );
      }
    });

    this.exportTariff.valueChanges.subscribe(async (value) => {
      console.log(value);

      if (value) {
        this.selectedExportTariff = +value;
      }
    });
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
      const model: any = {
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
      };
      console.log('model');
      console.log(model);
      await this.api.post(`${environment.ApiEndpoint}/capture/post`,
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
      );
    }
  }


}
