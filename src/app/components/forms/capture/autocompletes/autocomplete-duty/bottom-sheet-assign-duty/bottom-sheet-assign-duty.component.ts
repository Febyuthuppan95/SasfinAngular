import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet-assign-duty',
  templateUrl: './bottom-sheet-assign-duty.component.html',
  styleUrls: ['./bottom-sheet-assign-duty.component.scss']
})
export class BottomSheetAssignDutyComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetAssignDutyComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit() {
  }

  close(data?) {
    this.bottomSheetRef.dismiss(data);
  }

}
