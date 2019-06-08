import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../../../assets/config.json';
import { LoginResponse } from '../../../models/LoginResponse';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../../services/UserService';
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

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private router: Router,
    // tslint:disable-next-line:align
    private userService: UserService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() { }

  onLoginSubmit() {
    this.pendingRequest = true;
    this.userService.authenticate(this.txtEmail, this.txtPassword).then(
      (res: LoginResponse) => {
        if (res.authenticated) {
          this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          this.cookieService.set('UserId', res.userID.toString());
          this.cookieService.set('Email', res.email);
          this.cookieService.set('FirstName', res.firstName);
          this.cookieService.set('Surname', res.surname);
          this.cookieService.set('EmpNo', res.empNo);
          this.cookieService.set('Designation', res.designation);
          this.cookieService.set('Extension', res.extension);
          this.cookieService.set('ProfileImage', res.profileImage);
          this.cookieService.set('BackgroundImage', res.backgroundImage);
          this.router.navigateByUrl('/users');
        } else {
          this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
        }
        this.pendingRequest = false;
      },
      (msg) => {
        this.notify.errorsmsg('Uh oh!', 'Something went wrong...');
        this.pendingRequest = false;
      });
  }
}
