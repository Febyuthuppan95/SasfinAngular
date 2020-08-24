import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionFile } from 'src/app/models/HttpResponses/TransactionFileListModel';

@Component({
  selector: 'app-attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.scss']
})
export class AttachmentDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AttachmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TransactionFile[]) { }

  ngOnInit() {}

  preview(obj: TransactionFile) {
    this.dialogRef.close(obj);
  }

}
