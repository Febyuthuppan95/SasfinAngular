import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-form-custom-release',
  templateUrl: './form-custom-release.component.html',
  styleUrls: ['./form-custom-release.component.scss']
})
export class FormCustomReleaseComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  currentTheme: string;
  form = {
    serialNo: {
      value: null,
      error: null
    },
    LRN: {
      value: null,
      error: null
    },
    importersCode: {
      value: null,
      error: null
    },
    PCC: {
      value: null,
      error: null
    },
    FOB: {
      value: null,
      error: null
    },
    waybillNo: {
      value: null,
      error: null
    },
    supplierRef: {
      value: null,
      error: null
    },
    MRN: {
      value: null,
      error: null
    },
  };

  ngOnInit() {
    this.themeService.observeTheme().subscribe(value => this.currentTheme = value);
  }

  submit($event) {
    $event.preventDefault();
    const invalid = this.validation();

    if (invalid === 0) {
      this.notify.infotoastr('Info', 'Validation Passed');
    } else {
      this.notify.toastrwarning('Warning', 'All fields are required');
    }
  }

  validation(): number {
    let errors = 0;

    if (this.form.serialNo.value === null || this.form.serialNo.value === undefined) {
      errors++;
      this.form.serialNo.error = 'Serial No is required';
    }

    if (this.form.LRN.value === null || this.form.LRN.value === undefined) {
      errors++;
      this.form.LRN.error = 'LRN is required';
    }

    if (this.form.MRN.value === null || this.form.MRN.value === undefined) {
      errors++;
      this.form.MRN.error = 'MRN is required';
    }

    if (this.form.FOB.value === null || this.form.FOB.value === undefined) {
      errors++;
      this.form.FOB.error = 'FOB is required';
    }

    if (this.form.PCC.value === null || this.form.PCC.value === undefined) {
      errors++;
      this.form.PCC.error = 'PCC is required';
    }

    if (this.form.waybillNo.value === null || this.form.waybillNo.value === undefined) {
      errors++;
      this.form.waybillNo.error = 'Waybill No is required';
    }

    if (this.form.importersCode.value === null || this.form.importersCode.value === undefined) {
      errors++;
      this.form.importersCode.error = 'Importer\'s Code is required';
    }

    if (this.form.supplierRef.value === null || this.form.supplierRef.value === undefined) {
      errors++;
      this.form.supplierRef.error = 'Supplier Ref is required';
    }

    return errors;
  }

}
