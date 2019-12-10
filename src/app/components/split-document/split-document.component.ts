import { Component, OnInit, Input } from '@angular/core';
import { CaptureService } from 'src/app/services/capture.service';

@Component({
  selector: 'app-split-document',
  templateUrl: './split-document.component.html',
  styleUrls: ['./split-document.component.scss']
})
export class SplitDocumentComponent implements OnInit {

  constructor(private captureService: CaptureService) { }

  sections: SplitPDFRequest[];
  requestData = {
    sections: this.sections
  };

  file: File;

  @Input() userID: number;
  @Input() transactionID: number;

  transactionTypes = [
    { name: 'ICI', value: 1 },
    { name: 'SAD500', value: 2 },
    { name: 'PACKING', value: 3 },
    { name: 'CUSRELEASE', value: 4 },
    { name: 'VOC', value: 5 },
  ];

  ngOnInit() {}

  addSection() {
    this.requestData.sections.push({
      pages: {
        start: 1,
        end: 2,
      }
    });
  }

  inputFileChange(files: File[]) {
    this.file = files[0];
  }

  formSubmit() {
    let err = 0;

    if (this.sections.length === 0) {
      err++;
    } else if (this.file === undefined) {
      err++;
    }

    const formData = new FormData();
    formData.append('requestModel', JSON.stringify(this.sections));
    formData.append('file', this.file);

    this.captureService.splitPDF(formData).then(
      (res) => {
        console.log(res);
      },
      (msg) => {
        console.log(msg);
      }
    );
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
    type?: string;
}
