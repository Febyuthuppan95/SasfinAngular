import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }
  successmsg() {
    this.toastr.success('Toastr Success message', 'Success');
}
  errorsmsg() {
    this.toastr.error('Toastr Error Notification', 'Error');
  }
  infotoastr() {
    this.toastr.info('Important News', 'Information');
  }
  toastrwarning() {
    this.toastr.warning('Battery about to Die', 'Warning');
  }
}
