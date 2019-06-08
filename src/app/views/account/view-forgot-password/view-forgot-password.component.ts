import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from '../../../../assets/config.json';

@Component({
  selector: 'app-view-forgot-password',
  templateUrl: './view-forgot-password.component.html',
  styleUrls: ['./view-forgot-password.component.scss']
})
export class ViewForgotPasswordComponent implements OnInit {

  txtEmail: string;

  requestPending = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onRequestOtpSubmit() {
    this.requestPending = true;

    const requestModel = {
      _email: this.txtEmail,
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
