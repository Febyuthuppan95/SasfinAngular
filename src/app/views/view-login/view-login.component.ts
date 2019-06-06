import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../assets/config.json';
import { LoginResponse } from './../../models/LoginResponse';
import { NotificationComponent } from './../../components/notification/notification.component';

@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;
  pendingRequest = false;

  constructor(private httpClient: HttpClient) {}

  @ViewChild(NotificationComponent, {static: true})
    private notify: NotificationComponent;

  ngOnInit() {}

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
            this.notify.successmsg(data.outcome.outcome, data.outcome.outcomeMessage);
          } else {
            this.notify.errorsmsg(data.outcome.outcome, data.outcome.outcomeMessage);
          }
        },
        error => {
          console.log('Error', error);
          this.pendingRequest = false;
        });
  }
}
