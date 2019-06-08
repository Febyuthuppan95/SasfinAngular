import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../../assets/config.json';

@Component({
  selector: 'app-view-change-password',
  templateUrl: './view-change-password.component.html',
  styleUrls: ['./view-change-password.component.scss']
})
export class ViewChangePasswordComponent implements OnInit {

  txtOTP: string;
  txtNewPass: string;
  txtConfirmNewPass: string;

  requestPending = false;
  otpEmail = 'ashton@lateral.solutions';

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onRequestChangePassword() {
    this.requestPending = true;

    const requestModel = {
      _otp: this.txtOTP,
      _newPass: this.txtNewPass
    };

    this.httpClient.post(`${dev.apiDomain}account/request/otp`, requestModel)
      .subscribe(
        data => {
          console.log('POST Request is successful ', data);
          this.requestPending = false;
        },
        error => {
          console.log('Error', error);
          this.requestPending = false;
        });
  }

}
