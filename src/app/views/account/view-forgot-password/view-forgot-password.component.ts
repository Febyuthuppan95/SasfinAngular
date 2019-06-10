import { Component, OnInit, ViewChild } from '@angular/core';
import { ForgotPassword } from './../../../models/HttpResponses/ForgotPassword.model';
import { UserService } from './../../../services/UserService';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-forgot-password',
  templateUrl: './view-forgot-password.component.html',
  styleUrls: ['./view-forgot-password.component.scss']
})
export class ViewForgotPasswordComponent implements OnInit {

  txtEmail: string;
  requestPending = false;

  constructor(private userService: UserService, private router: Router) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() {}

  onRequestOtpSubmit() {
    this.requestPending = true;
    this.userService.forgotPassword(this.txtEmail).then(
      (res: ForgotPassword) => {
        this.requestPending = false;

        if (res.status) {
          this.notify.successmsg('Success'.toString(), 'OTP sent. Please check your inbox.'.toString());
          this.router.navigateByUrl('/account/changepassword');
        } else {
          this.notify.errorsmsg('Failure', 'Email address is not accociated to an account.');
        }
      },
      (msg) => {
        this.requestPending = false;
        this.notify.errorsmsg('Failure', 'Something went wrong');
      });
  }
}
