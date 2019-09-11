import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { NotificationComponent } from '../../notification/notification.component';

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
    },
    LRN: {
      value: null,
    },
    importersCode: {
      value: null,
    },
    PCC: {
      value: null,
    },
    FOB: {
      value: null,
    },
    waybillNo: {
      value: null,
      error: null
    },
    supplierRef: {
      value: null,
    },
    MRN: {
      value: null,
    },
  };

  ngOnInit() {
    this.themeService.observeTheme().subscribe(value => this.currentTheme = value);
  }

  submit($event) {
    $event.preventDefault();
  }
}
