import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../assets/config.json';
import { LoginResponse } from './../../models/LoginResponse';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss']
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;

  alertError = false;
  pendingRequest = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    this.pendingRequest = true;

    const requestModel = {
      _email: this.txtEmail,
      _pass: this.txtPassword
    };

    this.httpClient.post<LoginResponse>(`${dev.apiDomain}account/authenticate/`, requestModel)
      .subscribe(
        data => {
          console.log('POST Request is successful ', data);
          this.pendingRequest = false;

          if (data.authenticated) {
            alert('Status == true');
          } else {
            alert('Status == false');
          }
        },
        error => {
          console.log('Error', error);
          this.pendingRequest = false;
        });
  }
}
