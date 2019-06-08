import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../../../assets/config.json';
import { UserService } from './../../../services/UserService';
import { NotificationComponent } from './../../../components/notification/notification.component';

@Component({
  selector: 'app-view-forgot-password',
  templateUrl: './view-forgot-password.component.html',
  styleUrls: ['./view-forgot-password.component.scss']
})
export class ViewForgotPasswordComponent implements OnInit {

  txtEmail: string;

  requestPending = false;

  constructor(private userService: UserService) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  ngOnInit() {
  }

  onRequestOtpSubmit() {
    this.requestPending = true;
    this.userService.forgotPassword(this.txtEmail).then(
      (res) => {
        this.requestPending = false;
      },
      (msg) => {
        this.requestPending = false;
      });
  }
}
