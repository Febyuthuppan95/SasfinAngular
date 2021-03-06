import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.Service';
import { NotificationComponent } from './../../../components/notification/notification.component';
import { ChangePassword } from 'src/app/models/HttpResponses/ChangePassword.model.js';

@Component({
  selector: 'app-view-change-password',
  templateUrl: './view-change-password.component.html',
  styleUrls: ['./view-change-password.component.scss']
})
export class ViewChangePasswordComponent implements OnInit {

  txtEmail: string;
  txtOTP: string;
  txtNewPass: string;
  txtConfirmNewPass: string;

  requestPending = false;

  constructor(private userService: UserService, private router: Router) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() {
  }

  onRequestChangePassword() {
    if (this.txtEmail === undefined || this.txtConfirmNewPass === undefined || this.txtNewPass === undefined || this.txtOTP === undefined) {
      this.notify.errorsmsg('Invalid Input', 'Please enter all fields.');
    } else {
      if (this.txtConfirmNewPass !== this.txtNewPass) {
        this.notify.errorsmsg('Invalid Input', 'Passwords do not match');
      } else {
        this.requestPending = true;

        this.userService.changePassword(this.txtEmail, this.txtOTP, this.txtNewPass)
          .then(
            (res: ChangePassword) => {
              this.requestPending = false;

              if (res.status) {
                this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
                this.router.navigateByUrl('/');
              } else {
                this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
              }
            },
            (msg) => {
              this.requestPending = false;
            });
      }
    }
  }

}
