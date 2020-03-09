import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-escalate-dialog',
  templateUrl: './escalate-dialog.component.html',
  styleUrls: ['./escalate-dialog.component.scss']
})
export class EscalateDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EscalateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ''
    ) { }
  reason = '';
  onNoClick(): void {
    this.dialogRef.close();
  }
}
