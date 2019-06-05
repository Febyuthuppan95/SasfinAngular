import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../assets/config.json';

import { AlertDangerComponent } from '../../components/alert-danger/alert-danger.component';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss']
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;

  alertError = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const requestModel = {
      _email: this.txtEmail,
      _pass: this.txtPassword
    };

    this.httpClient.post(`${dev.apiDomain}account/authenticate/`, requestModel)
      .subscribe(
        data => {
          console.log('POST Request is successful ', data);

        },
        error => {
          console.log('Error', error);
        });
  }
}
