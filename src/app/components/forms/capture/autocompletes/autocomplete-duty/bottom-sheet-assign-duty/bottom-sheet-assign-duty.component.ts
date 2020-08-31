import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet-assign-duty',
  templateUrl: './bottom-sheet-assign-duty.component.html',
  styleUrls: ['./bottom-sheet-assign-duty.component.scss']
})
export class BottomSheetAssignDutyComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetAssignDutyComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  @ViewChild('dutyInput', { static: false }) private duty: ElementRef;

  ngOnInit(): void {
    setTimeout(() => this.duty.nativeElement.focus(), 500);
  }

  close(data?) {
    this.bottomSheetRef.dismiss(data);
  }

}
