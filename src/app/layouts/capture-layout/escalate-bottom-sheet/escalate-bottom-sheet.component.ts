import { EscalateDialogComponent } from './../escalate-dialog/escalate-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-escalate-bottom-sheet',
  templateUrl: './escalate-bottom-sheet.component.html',
  styleUrls: ['./escalate-bottom-sheet.component.scss']
})
export class EscalateBottomSheetComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<EscalateDialogComponent>) { }

  @Input() reason: string;
  ngOnInit() {
  }
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
