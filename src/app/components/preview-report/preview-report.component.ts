import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PreviewReportOptions } from './preview-options';
import { DocumentService } from 'src/app/services/Document.Service';

@Component({
  selector: 'app-preview-report',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss']
})
export class PreviewReportComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PreviewReportComponent>,
              @Inject(MAT_DIALOG_DATA) private data: PreviewReportOptions,
              private docService: DocumentService) { }

  src: string;
  isReady: boolean;

  ngOnInit() {
    this.isReady = false;
    
    this.docService.get(this.data.src).then(
      (res: string) => {
        this.src = res;

        if (this.src === null) {
          this.isReady = false;
        } else {
          this.isReady = true;
        }
      },
      (msg) => {
        this.isReady = false;
      }
    );
  }

}
