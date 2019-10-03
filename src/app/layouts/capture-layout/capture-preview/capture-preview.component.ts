import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-capture-preview',
  templateUrl: './capture-preview.component.html',
  styleUrls: ['./capture-preview.component.scss']
})
export class CapturePreviewComponent implements OnInit {

  constructor(private docService: DocumentService,
              public dialogRef: MatDialogRef<CapturePreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { src: string }) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  pdfSRC: Blob;
  displayPDF = false;
  failedToLoad = false;

  ngOnInit() {
    this.failedToLoad = false;

    this.docService.get(this.data.src).then(
      (res: string) => {
        if (res === null) {
          this.failedToLoad = true;
        } else {
          this.failedToLoad = false;
        }

        this.pdfSRC = new File([res], 'file.pdf', {type: 'application/pdf'});
        this.displayPDF = true;
      },
      (msg) => {
        this.failedToLoad = true;
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
