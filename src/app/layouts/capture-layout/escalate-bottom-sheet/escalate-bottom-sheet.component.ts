import { EscalateDialogComponent } from './../escalate-dialog/escalate-dialog.component';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_DIALOG_DATA, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-escalate-bottom-sheet',
  templateUrl: './escalate-bottom-sheet.component.html',
  styleUrls: ['./escalate-bottom-sheet.component.scss']
})
export class EscalateBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<EscalateDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: string) { }

  reason = '';
  ngOnInit() {
    console.log(this.data);
    this.reason = this.data;
  }
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
