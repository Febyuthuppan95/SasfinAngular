import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CaptureService } from 'src/app/services/capture.service';

@Component({
  selector: 'app-add-company-permit',
  templateUrl: './add-company-permit.component.html',
  styleUrls: ['./add-company-permit.component.scss']
})
export class AddCompanyPermitComponent implements OnInit {

  constructor(private snackbar: MatSnackBar,
              private captureService: CaptureService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<AddCompanyPermitComponent>) { }

  file: any;
  filePreview: any;
  displayPreview: any;
  requestData: any;
  transactionTypes: any;
  processing: any;
  fileReader: any;
  sections: any;

  ngOnInit() {

  }

  inputFileChange(files: any) {
    this.file = files;

    this.fileReader = new FileReader();
    this.fileReader.readAsDataURL(this.file[0]);
    this.fileReader.onload = (e) => {
      this.filePreview = this.fileReader.result;
    };

    this.displayPreview = true;
  }

  addSection() {
    const curLength = this.requestData.sections.length;

    this.requestData.sections.push({
      position: curLength,
      pages: [],
      name: '',
      userID: this.data.userID,
      transactionID: this.data.transactionID,
      attachmentType: '',
     // companyName: this.companyName,
      control: new FormControl(null, [
        Validators.required,
        // tslint:disable-next-line: max-line-length
        Validators.pattern(new RegExp(/^([1-9][0-9]{0,2}|[1-9][0-9]{0,2}-[1-9][0-9]{0,2})(,([1-9][0-9]{0,2}|[1-9][0-9]{0,2}-[1-9][0-9]{0,2}))*$/))
        // Validators.pattern(new RegExp(/^\d{1,}((-\d{1,})|(,\d{1,})?){1,}/g))
      ]),
      nameControl: new FormControl(null, [Validators.required]),
      selectControl: new FormControl(null, [Validators.required]),
    });

    this.requestData.sections[this.requestData.sections.length - 1].control.markAsUntouched();
    this.requestData.sections[this.requestData.sections.length - 1].nameControl.markAsUntouched();

    this.requestData.sections.sort((x, y) => y.position.toLocaleString().localeCompare(x.position.toLocaleString()));
  }

  removeSection(section: any) {

  }

  dismiss() {
    this.dialogRef.close(false);
  }

  async formSubmit() {
    this.processing = true;

    let err = 0;

    if (this.sections.length === 0) {
      err++;
    } else if (this.file === undefined) {
      err++;
    }


    this.requestData.sections.forEach((item) => {
      if (item.control.valid) {
        item.pages = [];
        const segments = item.control.value.split(',');

        segments.forEach((element) => {
          if (element.indexOf('-') !== -1) {
            const ranges = element.split('-');

            if (ranges[0] < ranges[1]) {
              for (let i = +ranges[0]; i <= +ranges[1]; i++) {
                item.pages.push(i);
              }
            }
          } else {
            item.pages.push(+element);
          }
        });

        console.log(item.pages);

      } else {
        err++;
        this.snackbar.open('Page number format is incorrect', '', { duration: 5000 });
      }

      if (item.nameControl.valid) {
        item.name = item.nameControl.value;
      } else {
        err++;
      }

      console.log('selectControl');
      console.log(item.selectControl.value);

      if (item.selectControl.valid) {
        item.attachmentType = item.selectControl.value;
      } else {
        item.selectControl.setErrors({ required: true });
        item.selectControl.updateValueAndValidity();
        err++;
      }
      console.log('attachmentType');
      console.log(item.attachmentType);

      if (item.name === '' || item.name === null || !item.name) {
        console.log('err: Name');
        this.snackbar.open('err: Attachment Name', '', { duration: 5000 });
        err++;
      }

      if (item.pages.length === 0) {
        err++;
      }
    });

    if (err === 0) {
      const request = this.requestData;

      request.sections.forEach((item) => {
        delete item.control;
        delete item.nameControl;
        delete item.selectControl;
      });

      const formData = new FormData();
      request.sections.sort((x, y) => x.attachmentType.toLocaleString().localeCompare(y.attachmentType.toLocaleString()));
      formData.append('requestModel', JSON.stringify(request));

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.file.length; i++) {
        formData.append('files', this.file[i]);
      }

      console.log(request);

      await this.captureService.splitPDF(formData).then(
        (res) => {
          this.processing = false;
          this.dialogRef.close({state: true});
        },
        (msg) => {
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
