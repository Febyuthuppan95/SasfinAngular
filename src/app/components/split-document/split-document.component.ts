import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompanyService } from 'src/app/services/Company.Service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ListReadResponse } from '../forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { CompService } from 'src/app/models/HttpResponses/CompanyServiceResponse';

@AutoUnsubscribe()
@Component({
  selector: 'app-split-document',
  templateUrl: './split-document.component.html',
  styleUrls: ['./split-document.component.scss']
})
export class SplitDocumentComponent implements OnInit, OnDestroy {

  constructor(private captureService: CaptureService, private companyService: CompanyService,
              private dialogRef: MatDialogRef<SplitDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { userID: number, transactionID: number, transactionType: string },
              private apiService: ApiService) { }

  sections: SplitPDFRequest[] = [];
  requestData = {
    sections: this.sections
  };

  file: File;
  displayPreview = false;
  filePreview: ArrayBuffer | string;
  companyName: string;
  private fileReader = new FileReader();

  transactionTypes = [];

  ngOnInit() {
    this.companyService.observeCompany().subscribe((data) => {
        this.companyName = data.companyName;
    });
    console.log(this.data.transactionType);

    this.initTypes();
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
              description:x.Description,
              value: x.FileTypeID
            })
          });
          console.log(this.transactionTypes);
       
      }
    );
  }
  addSection() {
    console.log(this.requestData.sections.length);
    const curLength = this.requestData.sections.length;
    this.requestData.sections.push({
      position: curLength,
      pages: {
        start: 1,
        end: 2,
      },
      name: '',
      userID: this.data.userID,
      transactionID: this.data.transactionID,
      attachmentType: '',
      companyName: this.companyName
    });

    this.requestData.sections.sort((x,y)=> y.position.toLocaleString().localeCompare(x.position.toLocaleString()));
  }

  inputFileChange(files: File[]) {
    this.file = files[0];

    this.fileReader = new FileReader();
    this.fileReader.readAsDataURL(this.file);
    this.fileReader.onload = (e) => {
      this.filePreview = this.fileReader.result;
    };

    this.displayPreview = true;
  }

  typeChange(index: number, value: number) {
    console.log(value);
    this.requestData.sections[index].attachmentType = this.transactionTypes[value].name;
    this.requestData.sections[index].name = this.transactionTypes[value].description;
    console.log(this.requestData.sections[index]);
  }

  formSubmit() {
    let err = 0;

    if (this.sections.length === 0) {
      err++;
    } else if (this.file === undefined) {
      err++;
    }


    console.log(this.requestData);

    if (err === 0) {
    const formData = new FormData();
    this.requestData.sections.sort((x,y)=> x.attachmentType.toLocaleString().localeCompare(y.attachmentType.toLocaleString()));
    console.log(this.requestData);
    formData.append('requestModel', JSON.stringify(this.requestData));
    formData.append('file', this.file);

    this.captureService.splitPDF(formData).then(
      (res) => {
        this.dialogRef.close({state: true});
      },
      (msg) => {
        this.dialogRef.close({state: false});
      }
    );
    }
  }

  dismiss() {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {}

}

export class Section {
  start: number;
  end: number;
}

export class SplitPDFRequest {
    position: number;
    pages: Section;
    userID?: number;
    transactionID?: number;
    name?: string;
    attachmentType?: string;
    companyName: string;
}
