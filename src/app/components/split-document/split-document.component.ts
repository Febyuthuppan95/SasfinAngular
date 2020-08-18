import { Component, OnInit, Input, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CompanyService } from 'src/app/services/Company.Service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { CompService } from 'src/app/models/HttpResponses/CompanyServiceResponse';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { FormControl, Validators } from '@angular/forms';

@AutoUnsubscribe()
@Component({
  selector: 'app-split-document',
  templateUrl: './split-document.component.html',
  styleUrls: ['./split-document.component.scss']
})
export class SplitDocumentComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private captureService: CaptureService, private companyService: CompanyService,
              private dialogRef: MatDialogRef<SplitDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { userID: number, transactionID: number, transactionType: string },
              private apiService: ApiService,
              private snackbar: MatSnackBar) { }

  sections: SplitPDFRequest[] = [];
  requestData = {
    sections: this.sections
  };

  file: File[];
  displayPreview = false;
  filePreview: ArrayBuffer | string;
  companyName: string;
  pdfSRC: ArrayBuffer;
  displayPDF = false;
  page = 1;
  zoom_to = 0.8;
  rotation = 0;
  shortcuts: ShortcutInput[] = [];
  src: string;
  originalSize: boolean = true;

  pageSequenceRegex = new RegExp(/^\s*\d+(?:-\d+)?\s*(?:,\s*\d+(?:-\d+)?\s*)*$/g);

  processing = false;

  private fileReader = new FileReader();

  transactionTypes = [];

  ngOnInit() {
    this.companyService.observeCompany().subscribe((data) => {
        this.companyName = data.companyName;
    });

    this.initTypes();
  }
ngAfterViewInit() {
  this.shortcuts.push(
    {
        key: 'alt + right',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: e => this.page++
    },
    {
      key: 'alt + left',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: e => this.page--
    },
    {
      key: 'alt + up',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: e =>  {
        this.zoom_in();
      }
    },
    {
      key: 'alt + down',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: e => {
        this.zoom_out();
      }
    },
    {
      key: 'alt + r',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: e => {
        this.rotatePDF(this.rotation + 90);
      }
    },
  );
}
  initTypes() {

    const model = {
      requestParams: {
        userID: this.data.userID,
        transactionID: this.data.transactionID
      },
      requestProcedure: 'DoctypesList'
    };
    this.apiService.post(`${environment.ApiEndpoint}/capture/read/list`, model).then(
      (res: ListReadResponse) => {
        console.log(res);
        res.data.forEach(x => {
            this.transactionTypes.push({
              name: x.Name,
              description: x.Description,
              value: x.FileTypeID
            });
          });

        console.log(this.transactionTypes);
      }
    );
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
      companyName: this.companyName,
      control: new FormControl(null, [
        Validators.required,
        Validators.pattern(new RegExp(/^\s*\d+(?:-\d+)?\s*(?:,\s*\d+(?:-\d+)?\s*)*$/g))
      ]),
    });

    this.requestData.sections[this.requestData.sections.length - 1].control.setErrors(null);
    this.requestData.sections.sort((x, y) => y.position.toLocaleString().localeCompare(x.position.toLocaleString()));
  }

  removeSection(section): void {
    this.requestData.sections.splice(this.requestData.sections.indexOf(section), 1);

    this.requestData.sections.forEach((item, index) => {
      item.position = index + 1;
    });
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

  typeChange(index: number, value: number) {
    this.requestData.sections[index].attachmentType = this.transactionTypes[value].name;
    this.requestData.sections[index].name = this.transactionTypes[value].description;
  }

  formSubmit() {
    this.processing = true;

    let err = 0;

    if (this.sections.length === 0) {
      err++;
      console.log(this.sections.length);

    } else if (this.file === undefined) {
      err++;
      console.log(this.file);
    }

    this.requestData.sections.forEach((item) => {
      if (item.name === '' || item.name === null || !item.name) {
        err++;
        console.log('name');
      }

      if (item.attachmentType === '' || item.attachmentType === null || !item.attachmentType) {
        err++;
        console.log('attachmentType');
      }

      if (item.control.valid) {
        const segments = item.control.value.split(',');

        segments.forEach(element => {
          if (element.indexOf('-') === -1) {
            item.pages.push(+element.trim());
          } else {
            const range = element.split('-');

            if (range.length === 2) {
              if (range[0] < range[1]) {
                for (let i = +range[0]; i <= +range[1]; i++) {
                  item.pages.push(i);
                }
              } else {
                  item.control.setErrors({ format : true });
              }
            } else {
              item.control.setErrors({ format : true });
            }
          }
        });

        console.log(item.pages);
      } else {
        err++;
        this.snackbar.open('Page number format is incorrect', '', { duration: 5000 });
      }

      if (item.pages.length === 0) {
        err++;
        console.log('pages');
      }
    });

    if (err === 0) {
      const request = this.requestData;

      request.sections.forEach((item) => {
        delete item.control;
      });

      const formData = new FormData();
      request.sections.sort((x, y) => x.attachmentType.toLocaleString().localeCompare(y.attachmentType.toLocaleString()));
      formData.append('requestModel', JSON.stringify(request));

      for (let i = 0; i < this.file.length; i++) {
        formData.append('files', this.file[i]);
      }

      this.captureService.splitPDF(formData).then(
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

  dismiss() {
    this.dialogRef.close(false);
  }


  rotatePDF(deg: number) {
    this.rotation = deg;
  }

  zoomChange(variant: number) {
    this.zoom_to = this.zoom_to + variant;
  }

  zoom_in() {
    this.zoom_to = this.zoom_to + 0.2;
  }

  zoom_out() {
    if (this.zoom_to >= 0.4) {
       this.zoom_to = this.zoom_to - 0.2;
    }
  }

  ngOnDestroy() {}

}

export class Section {
  start: number;
  end: number;
  skip: number;
}

export class SplitPDFRequest {
    position: number;
    pages: number[];
    userID?: number;
    transactionID?: number;
    name?: string;
    attachmentType?: string;
    companyName: string;
    control: FormControl;
}
