import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AllowIn, KeyboardShortcutsComponent } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-bottom-sheet-assign-duty',
  templateUrl: './bottom-sheet-assign-duty.component.html',
  styleUrls: ['./bottom-sheet-assign-duty.component.scss']
})
export class BottomSheetAssignDutyComponent implements OnInit, AfterViewInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetAssignDutyComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  @ViewChild('dutyInput', { static: false }) private duty: ElementRef;

  @ViewChild(KeyboardShortcutsComponent, { static: false })
  private keyboard: KeyboardShortcutsComponent;

  shortcuts: any[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.duty.nativeElement.focus();

    this.shortcuts.push(
        {
            key: 'alt + g',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.duty.nativeElement.focus()
        },
    );

    this.keyboard.select('cmd + f').subscribe(e => console.log(e));
    this.duty.nativeElement.focus();
    this.duty.nativeElement.focus();
  }

  close(data?) {
    this.bottomSheetRef.dismiss(data);
  }

}
