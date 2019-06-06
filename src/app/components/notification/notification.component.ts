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
  public successmsg(title: string, message: string) {
    this.toastr.success(message, title);
  }
  public errorsmsg(title: string, message: string) {
    this.toastr.error(message, title);
  }
  public infotoastr(title: string, message: string) {
    this.toastr.info(message, title);
  }
  public toastrwarning(title: string, message: string) {
    this.toastr.warning(message, title);
  }
}
