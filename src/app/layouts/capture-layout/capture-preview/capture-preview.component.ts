import { Component, OnInit, ViewChild, Input, Inject, ElementRef } from '@angular/core';
import { DocumentService } from 'src/app/services/Document.Service';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserIdleService } from 'angular-user-idle';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.Service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-capture-preview',
  templateUrl: './capture-preview.component.html',
  styleUrls: ['./capture-preview.component.scss']
})
export class CapturePreviewComponent implements OnInit {

  constructor(private docService: DocumentService,
              public dialogRef: MatDialogRef<CapturePreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { src: string }) { }

  pdfSRC: string;
  displayPDF = false;
  failedToLoad = false;
  count = 0;

  ngOnInit() {
    this.failedToLoad = false;

    this.docService.get(this.data.src).then(
      (res: string) => {
        if (res === null) {
          this.failedToLoad = true;
        } else {
          this.failedToLoad = false;
        }

        this.pdfSRC = res;
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
