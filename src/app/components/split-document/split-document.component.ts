import { Component, OnInit, Input, Inject } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-split-document',
  templateUrl: './split-document.component.html',
  styleUrls: ['./split-document.component.scss']
})
export class SplitDocumentComponent implements OnInit {

  constructor(private captureService: CaptureService, private dialogRef: MatDialogRef<SplitDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) private data: { userID: number, transactionID: number}) { }

  sections: SplitPDFRequest[] = [];
  requestData = {
    sections: this.sections
  };

  file: File;
  displayPreview = false;
  filePreview: string;
  private fileReader = new FileReader();

  transactionTypes = [
    { name: 'ICI', value: 1 },
    { name: 'SAD500', value: 2 },
    { name: 'PACKING', value: 3 },
    { name: 'CUSRELEASE', value: 4 },
    { name: 'VOC', value: 5 },
  ];

  ngOnInit() {

  }

  addSection() {
    this.requestData.sections.push({
      pages: {
        start: 1,
        end: 2,
      },
      name: '',
      userID: this.data.userID,
      transactionID: this.data.transactionID
    });
  }

  inputFileChange(files: File[]) {
    this.file = files[0];

    this.fileReader = new FileReader();
    this.fileReader.readAsDataURL(this.file);
    this.fileReader.onload = (e) => {
      this.filePreview = this.fileReader.result.toString();
    };

    this.displayPreview = true;
  }

  typeChange(index: number, value: number) {
    this.requestData.sections[index].attachmentType = this.transactionTypes[value - 1].name;
  }

  formSubmit() {
    let err = 0;

    if (this.sections.length === 0) {
      err++;
    } else if (this.file === undefined) {
      err++;
    }

    const formData = new FormData();
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

  dismiss() {
    this.dialogRef.close(false);
  }

}

export class Section {
  start: number;
  end: number;
}

export class SplitPDFRequest {
    pages: Section;
    userID?: number;
    transactionID?: number;
    name?: string;
    attachmentType?: string;
}
