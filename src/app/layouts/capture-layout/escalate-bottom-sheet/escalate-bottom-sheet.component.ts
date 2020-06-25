import { EscalateDialogComponent } from './../escalate-dialog/escalate-dialog.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

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
    this.reason = this.data;
  }
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
