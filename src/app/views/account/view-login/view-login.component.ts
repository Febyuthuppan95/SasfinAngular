import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from '../../../../assets/config.json';
import { LoginResponse } from '../../../models/LoginResponse';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;
  pendingRequest = false;

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private router: Router) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() { }

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

            this.cookieService.set('UserId', data.userID.toString(), 5);
            this.cookieService.set('Email', data.email, 5);
            this.cookieService.set('FirstName', data.firstName, 5);
            this.cookieService.set('Surname', data.surname, 5);
            this.cookieService.set('EmpNo', data.empNo, 5);
            this.cookieService.set('Designation', data.designation, 5);
            this.cookieService.set('Extension', data.extension, 5);
            this.cookieService.set('ProfileImage', data.profileImage, 5);
            this.cookieService.set('BackgroundImage', data.backgroundImage, 5);

            this.router.navigateByUrl('/users');
          } else {
            this.notify.errorsmsg(data.outcome.outcome, data.outcome.outcomeMessage);
          }
        },
        error => {
          console.log('Error', error);
          this.pendingRequest = false;
          this.notify.errorsmsg('Uh oh!', 'Something went wrong...');
        });
  }
}
