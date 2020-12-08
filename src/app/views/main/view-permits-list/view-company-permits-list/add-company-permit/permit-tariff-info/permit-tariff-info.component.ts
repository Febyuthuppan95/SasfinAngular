import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-permit-tariff-info',
  templateUrl: './permit-tariff-info.component.html',
  styleUrls: ['./permit-tariff-info.component.scss']
})
export class PermitTariffInfoComponent implements OnInit {

  constructor(private snackbarService: HelpSnackbar,
              @Inject(MAT_DIALOG_DATA) public data: { tariffID, subHeading, itemNumber },
              private dialogRef: MatDialogRef<PermitTariffInfoComponent>) { }

  form = new FormGroup({
    tariffID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    subHeading: new FormControl(),
    itemNumber: new FormControl(),
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      this.form.updateValueAndValidity();
    }
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

  submit(form: FormGroup) {
    if (form.valid) {
      this.dialogRef.close(form.value);
    }
  }

}
