import { Component, Inject, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetTariffList } from 'src/app/models/HttpRequests/GetTariffList';
import { Tariff, TariffListResponse } from 'src/app/models/HttpResponses/TariffListResponse';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService, SelectedCompany } from 'src/app/services/Company.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { UserService } from 'src/app/services/user.Service';

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
    dateStart: new FormControl(null, [Validators.required]),
    dateEnd: new FormControl(null, [Validators.required]),
    importdateStart: new FormControl(null, [Validators.required]),
    importdateEnd: new FormControl(null, [Validators.required]),
    exportdateStart: new FormControl(null, [Validators.required]),
    exportdateEnd: new FormControl(null, [Validators.required]),
  });
   tarifflist: Tariff[] = [];
   selectedTariffs: Tariff[] = [];
   selected = false;
   @Input() helpSlug = 'default';
   removable = true;
   selectable = false;
   companyID: number;
   companyName: string;

   importTariffs = new FormControl(null, [Validators.required]);
   exportTariff = new FormControl(null, [Validators.required]);
   selectedImportTariffs = [];
   selectedExportTariff: number;

   private isRequired = false;

   private currentUser = this.userService.getCurrentUser();

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
              this.selectedImportTariffs.push(res.tariffList[0]);

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

  removeSection(section: any) {

  }

  dismiss() {
    this.dialogRef.close(false);
  }

  async formSubmit() {

    let err = 0;
    console.log(this.form.valid);

    if (!this.form.valid) {
        err++;
      }

    if (err === 0) {

       const requestParams: object = {
          userID: this.currentUser.userID,
          companyID: this.companyID,
          permitCode: this.form.controls.PermitCode.value,
          dateStart: this.form.controls.dateStart.value,
          dateEnd: this.form.controls.dateEnd.value,
          importDateStart: this.form.controls.importdateStart.value,
          importDateEnd: this.form.controls.importdateEnd.value,
          exportDateStart: this.form.controls.exportdateStart.value,
          exportDateEnd: this.form.controls.exportdateEnd.value,
          importTariffs: this.selectedImportTariffs,
          exportTariffs: this.selectedExportTariff,
        };

       // console.log(requestParams);

       const file: File[] = this.file;
       const formData = new FormData();

       formData.append('requestModel', JSON.stringify(requestParams));
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < this.file.length; i++) {
        formData.append('files', this.file[i]);
      }
       console.log(formData);

       await this.captureService.UploadPermit(formData).then(
        (res) => {
          console.log(res);
          this.processing = false;
          this.dialogRef.close({state: true});
        },
        (msg) => {
          console.log(msg);
          this.processing = false;
          this.snackbar.open(`There was an issue uploading documents with message: ${JSON.stringify(msg)}`, '', { duration: 3000 });
        }
      );
    } else {
      this.processing = false;
      this.snackbar.open('There are errors', '', { duration: 3000 });
    }
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

  async findTariff(id: number) {

  }
}
