import { Duty } from './../../../../../../models/HttpRequests/SAD500Line';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-duty-assign-dialog',
  templateUrl: './duty-assign-dialog.component.html',
  styleUrls: ['./duty-assign-dialog.component.scss']
})
export class DutyAssignDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DutyAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Duty
    ) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
