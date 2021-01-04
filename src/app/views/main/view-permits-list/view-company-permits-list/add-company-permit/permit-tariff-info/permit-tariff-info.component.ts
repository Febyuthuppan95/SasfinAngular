import { async } from '@angular/core/testing';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { CaptureService } from 'src/app/services/capture.service';
import { CompanyService } from 'src/app/services/Company.Service';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { UserService } from 'src/app/services/user.Service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-permit-tariff-info',
  templateUrl: './permit-tariff-info.component.html',
  styleUrls: ['./permit-tariff-info.component.scss']
})
export class PermitTariffInfoComponent implements OnInit {

  constructor(private snackbarService: HelpSnackbar,
              private userService: UserService,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public data: any/* { tariffID, subHeading, itemNumber } */,
              private dialogRef: MatDialogRef<PermitTariffInfoComponent>) { }

  form = new FormGroup({
    tariffID: new FormControl(null, [Validators.required]),
    unitOfMeasureID: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    subHeading: new FormControl(),
    itemNumber: new FormControl(),
  });
  epcForm = new FormGroup({
    ItemID: new FormControl(null, [Validators.required]),
    TariffID: new FormControl(null, [Validators.required]),
    SubHeading: new FormControl(),
    Name: new FormControl(),
    EPCTariffID: new FormControl(),
  });
  permitTypeID: number;
  item: any;
  private currentUser = this.userService.getCurrentUser();

  ngOnInit() {
    if (this.data) {
      this.permitTypeID = this.data.permitTypeID;
      console.log(this.data);
      if (this.permitTypeID === 1){
        const model = {
          tariffID: this.data.tariffID,
          subHeading: this.data.subHeading,
          itemNumber: this.data.itemNumber,
        }
        this.form.patchValue(model);
        this.form.updateValueAndValidity();
      } else if (this.permitTypeID === 3){
        const model = {
          TariffID: this.data.tariffID,
          SubHeading: this.data.subHeading,
        }
        this.epcForm.patchValue(model);
        this.epcForm.updateValueAndValidity();
        console.log(this.epcForm);
      }
    }

    this.epcForm.controls.ItemID.valueChanges.subscribe(async (value) => {
      console.log(value);
      const model = {
        request: {
          userID: this.currentUser.userID,
          itemsID: value,
          filter: '',
        },
        procedure: 'ItemsList'
      };
      console.log(model);
      await this.api.post(`${environment.ApiEndpoint}/capture/list`, model).then(
        (res: any) => {
          // console.log(res);
          this.item = res.data[0];
          console.log(this.item);
          this.epcForm.controls.Name.setValue(this.item.Name);

      });
    });
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
      console.log("tariff Form");
      console.log(form.value);
      this.dialogRef.close(form.value);
    }
  }

}
