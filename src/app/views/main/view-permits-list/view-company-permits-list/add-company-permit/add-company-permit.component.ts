import { Component, Inject, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { Tariff, TariffListResponse } from 'src/app/models/HttpResponses/TariffListResponse';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ApiService } from 'src/app/services/api.service';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';
import { PermitTariffInfoComponent } from './permit-tariff-info/permit-tariff-info.component';

@Component({
  selector: 'app-add-company-permit',
  templateUrl: './add-company-permit.component.html',
  styleUrls: ['./add-company-permit.component.scss']
})
export class AddCompanyPermitComponent implements OnInit {

  constructor(private snackbar: MatSnackBar,
              private userService: UserService,
              private companyService: CompanyService,
              private snackbarService: HelpSnackbar,
              private captureService: CaptureService,
              private matDialog: MatDialog,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<AddCompanyPermitComponent>) { }

  file: File[];
  filePreview: any;
  displayPreview: any;
  requestData = new FormControl(null);
  transactionTypes: any;
  processing: any;
  fileReader: any;
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
   tarifflist: Tariff[] = [];
   selectedTariffs: Tariff[] = [];
   selected = false;
   @Input() helpSlug = 'default';
   removable = true;
   selectable = false;
   companyID: number;
   companyName: string;
   permitTypeID: number;

   importTariffs = new FormControl(null);
   exportTariff = new FormControl(null, [Validators.required]);
   public paginationControl = new FormControl(1);
   selectedImportTariffs = [];
   selectedExportTariff: number;
   requestParams: object;

   private isRequired = false;
   public activeIndex = 0;
   public activeTariff: any = null;
   public SPName = '';
   private currentUser = this.userService.getCurrentUser();
   private dateErrOp = '';

   public mask = {
    // guide: true,
    // showMask: true,
    // keepCharPositions : true,
     mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/] // i made changes here
   };

   toDate(value, control) {
    control.setValue(new Date(value));
  }

  async ngOnInit() {
    // this.loadTariffs();

    this.companyService.observeCompany().subscribe((obj: SelectedCompany) => {
      this.companyID = obj.companyID;
      this.companyName = obj.companyName;
    });

    this.permitTypeID = this.data.permitTypeID;

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

    this.epcForm.controls.epcTariffs.valueChanges.subscribe(async (value) => {
      if (value) {
        const model: GetTariffList = {
          filter: '',
          userID: this.currentUser.userID,
          specificTariffID: value,
          rowStart: 1,
          rowEnd: 100
        };

        await this.companyService.getTariffList(model).then(
          (res: TariffListResponse) => {
            if (res.outcome.outcome === 'SUCCESS') {
              console.log(res);
              this.selectedImportTariffs = [...this.selectedImportTariffs.filter(x => +x.id !== +value)];
              this.matDialog.open(PermitTariffInfoComponent, {
                data: {
                  tariffID: res.tariffList[0].id,
                  subHeading: res.tariffList[0].subHeading == null ? res.tariffList[0].heading : res.tariffList[0].subHeading,
                  permitTypeID: this.permitTypeID,
                },
                width: '512px'
              }).afterClosed().subscribe((tariffObj) => {
                if (tariffObj) {
                  this.selectedImportTariffs.push(tariffObj);
                  this.epcForm.controls.epcTariffs.setValue(null, { emitEvent: false });
                  console.log(this.selectedImportTariffs);
                }
              });
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



  removeTariff(index: number) {
    this.selectedImportTariffs.splice(index, 1);
  }

  inputFileChange(files: File[]) {

    this.file = files;

    this.fileReader = new FileReader();
    this.fileReader.readAsDataURL(this.file[0]);
    this.fileReader.onload = (e) => {
    this.filePreview = this.fileReader.result;
    };

    this.displayPreview = true;
  }

  // addSection() {
  //   const curLength = this.requestData.sections.length;

  //   this.requestData.sections.push({
  //     position: curLength,
  //     pages: [],
  //     name: '',
  //     userID: this.data.userID,
  //     transactionID: this.data.transactionID,
  //     attachmentType: '',
  //    // companyName: this.companyName,
  //     control: new FormControl(null, [
  //       Validators.required,
  //       // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  //      Validators.pattern(new RegExp(/^([1-9][0-9]{0,2}|[1-9][0-9]{0,2}-[1-9][0-9]{0,2})(,([1-9][0-9]{0,2}|[1-9][0-9]{0,2}-[1-9][0-9]{0,2}))*$/))
  //       // Validators.pattern(new RegExp(/^\d{1,}((-\d{1,})|(,\d{1,})?){1,}/g))
  //     ]),
  //     nameControl: new FormControl(null, [Validators.required]),
  //     selectControl: new FormControl(null, [Validators.required]),
  //   });

  //   this.requestData.sections[this.requestData.sections.length - 1].control.markAsUntouched();
  //   this.requestData.sections[this.requestData.sections.length - 1].nameControl.markAsUntouched();

  //   this.requestData.sections.sort((x, y) => y.position.toLocaleString().localeCompare(x.position.toLocaleString()));
  // }

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

  removeSection(section: any) {

  }

  dismiss() {
    this.dialogRef.close(false);
  }

  async formSubmit() {



    let err = 0;
    this.dateErrOp = 'There are errors';
    // console.log(this.form.valid);
    if (this.permitTypeID === 1) {
      this.SPName = 'PermitAdd';
      this.requestParams = this.PermitModel();
      if (!this.form.valid) {
        err++;
      }
      if (this.form.controls.importdateEnd.value < this.form.controls.importdateStart.value || this.form.controls.exportdateEnd.value < this.form.controls.exportdateStart.value) {
        this.dateErrOp = 'End date cannot be lower than start date ';
         err++;
     }
    } else if (this.permitTypeID === 2) {
      this.SPName = 'PRCCAdd';
      this.requestParams = this.PRCCModel();
      if (!this.prccForm.valid) {
        err++;
      }
    } else if (this.permitTypeID === 3) {
      this.SPName = 'EPCAdd';
      this.requestParams = this.EPCModel();
      if (!this.epcForm.valid || this.selectedImportTariffs.length == 0) {
        err++;
      }
    }

    // if (this.form.controls.importdateEnd.value < this.form.controls.importdateStart.value || this.form.controls.exportdateEnd.value < this.form.controls.exportdateStart.value) {
    //     this.dateErrOp = 'End date cannot be lower than start date ';
    //      err++;
    //  }

    if (err === 0) {

       console.log(this.requestParams);

       const file: File[] = this.file;
       const formData = new FormData();

       formData.append('requestModel', JSON.stringify(this.requestParams));
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < this.file.length; i++) {
        formData.append('files', this.file[i]);
      }
       console.log(formData);

       await this.captureService.UploadPermit(formData).then(
        (res: any) => {
          console.log(res);

          this.snackbar.open(res.outcomeMessage, '', { duration: 2000 });

          if (res.outcome) {
            this.processing = false;
            this.dialogRef.close({state: true});
          }

        },
        (msg) => {
          console.log('111');
          console.log(msg);
          this.processing = false;
          this.snackbar.open(`There was an issue uploading documents with message: ${JSON.stringify(msg)}`, '', { duration: 3000 });
        }
      );
    } else {
      console.log(this.epcForm);
      this.processing = false;
      this.snackbar.open(this.dateErrOp, '', { duration: 3000 });
    }
  }

  PermitModel(): object {
    const obj = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      permitCode: this.form.controls.PermitCode.value,
      permitDate: this.form.controls.permitDate.value,
      importDateStart: this.form.controls.importdateStart.value,
      importDateEnd: this.form.controls.importdateEnd.value,
      exportDateStart: this.form.controls.exportdateStart.value,
      exportDateEnd: this.form.controls.exportdateEnd.value,
      importTariffs: this.selectedImportTariffs.map((e) => {
        return {
          tariffID: e.tariffID,
          uOMID: e.unitOfMeasureID,
          quantity: e.quantity,
          price: e.price,
        };
      }),
      exportTariffs: this.selectedExportTariff,
      procedure: this.SPName
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
      importEndDate: this.prccForm.controls.prccImportEndDate.value,
      procedure: this.SPName
    };
    return obj;
  }

  EPCModel(): object {
    const obj = {
      userID: this.currentUser.userID,
      companyID: this.companyID,
      epcCode: this.epcForm.controls.epcCode.value,
      procedure: this.SPName,
      EPCTariffs: this.selectedImportTariffs.map((e) => {
        return {
          TariffID: e.TariffID,
          ItemID: e.ItemID
        };
      }),
    };
    console.log(obj);
    return obj;
  }

  // loadTariffs(setDefault?: boolean, getSpecific?: boolean) {

  //   let filter = '';

  //   if (this.importTariffs.value && this.importTariffs.value !== null) {
  //     filter = this.importTariffs.value;
  //   }

  //   const model: GetTariffList = {
  //     filter,
  //     userID: this.currentUser.userID,
  //     specificTariffID: -1,
  //     rowStart: 1,
  //     rowEnd: 10
  //   };

  //   this.companyService
  //   .getTariffList(model)// model
  //   .then(
  //     (res: TariffListResponse) => {

  //         this.tarifflist = res.tariffList;
  //         console.log('tarifflist');
  //         console.log(this.tarifflist);
  //     },
  //     msg => {

  //     }
  //   );
  // }

  public displayFn(item: any): string {
    // tslint:disable-next-line: max-line-length
    return item ? `${item.subHeading == null ? item.itemNumber : item.subHeading}${item.subHeading ? item.subHeading.length < 8 && item.subHeading != null ? '.00' : '' : ''}` : '';
  }

  focusOut(trigger) {
    if (this.tarifflist.length > 0 && !this.selected) {
      this.importTariffs.setValue(this.tarifflist[0]);
      trigger.closePanel();
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  remove($event) {

  }

  // refresh() {
  //   this.displayLines = false;
  //   this.loader = true;
  //   setTimeout(() => {
  //     this.displayLines = true;
  //     this.loader = false;
  //   }, 500);
  // }

  async findTariff(id: number) {

  }


}
