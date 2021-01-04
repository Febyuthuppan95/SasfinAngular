import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-override',
  templateUrl: './dialog-override.component.html',
  styleUrls: ['./dialog-override.component.scss']
})
export class DialogOverrideComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogOverrideComponent>) { }

  reason = new FormControl(null, [Validators.required]);
  @ViewChild('cdkFocusInitial', { static: false })
  private cdkFocusInitial: ElementRef;

  ngOnInit() {
    this.cdkFocusInitial.nativeElement.focus();
  }

  submit(control: FormControl) {
    if (control.valid) {
      this.dialogRef.close(control.value);
    }
  }

}
