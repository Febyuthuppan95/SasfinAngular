import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../../../assets/config.json';
import { LoginResponse } from '../../../models/HttpResponses/LoginResponse';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../services/user.Service';
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

  constructor(private router: Router, private userService: UserService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() { }

  onLoginSubmit() {
    if (this.txtEmail === '' || this.txtPassword === '') {
      this.notify.errorsmsg('Invalid Input', 'Please enter all fields.');
    } else {
      this.pendingRequest = true;
      this.userService.authenticate(this.txtEmail, this.txtPassword).then(
        (res: LoginResponse) => {
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);

          if (res.authenticated) {
            this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            this.userService.persistLogin(JSON.stringify(res));
            this.router.navigateByUrl('/users');
          } else {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
          this.pendingRequest = false;
        },
        (msg) => {
          this.pendingRequest = false;
          this.notify.errorsmsg('Uh oh!', 'Something went wrong...');
        });
    }

  }
}
