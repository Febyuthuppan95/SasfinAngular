import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CaptureService } from 'src/app/services/capture.service';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-add-company-permit',
  templateUrl: './add-company-permit.component.html',
  styleUrls: ['./add-company-permit.component.scss']
})
export class AddCompanyPermitComponent implements OnInit {

  constructor(private snackbar: MatSnackBar,
              private userService: UserService,
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
    exportdateEnd: new FormControl(null, [Validators.required])
   });

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

  ngOnInit() {

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
          permitCode: this.form.controls.PermitCode.value,
          dateStart: this.form.controls.dateStart.value,
          dateEnd: this.form.controls.dateEnd.value,
          importDateStart: this.form.controls.importdateStart.value,
          importDateEnd: this.form.controls.importdateEnd.value,
          exportDateStart: this.form.controls.exportdateStart.value,
          exportDateEnd: this.form.controls.exportdateEnd.value,
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
}
