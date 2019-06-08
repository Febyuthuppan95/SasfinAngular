import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../../../assets/config.json';
import { UserService } from './../../../services/UserService';
import { NotificationComponent } from './../../../components/notification/notification.component';

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
  otpEmail = 'ashton@lateral.solutions';

  constructor(private userService: UserService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() {
  }

  onRequestChangePassword() {
    this.requestPending = true;
    this.userService.changePassword(this.txtEmail, this.txtOTP, this.txtNewPass)
      .then(
        (res) => {
          this.requestPending = false;
        },
        (msg) => {
          this.requestPending = false;
        });
  }

}
