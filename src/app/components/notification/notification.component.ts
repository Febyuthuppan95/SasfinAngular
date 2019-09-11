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
  count = 0;

  public successmsg(title: string, message: string) {    
    this.toastr.success(message, title);

    if(this.toastr.currentlyActive >= 2)
    {
      this.toastr.remove(this.toastr.toasts[this.toastr.currentlyActive].toastId - 2); 
    }
  }
  public errorsmsg(title: string, message: string) {
    this.toastr.error(message, title);

    if(this.toastr.currentlyActive >= 2)
    {
      this.toastr.remove(this.toastr.toasts[this.toastr.currentlyActive].toastId - 2); 
    }
    
  }
  public infotoastr(title: string, message: string) {
    this.toastr.info(message, title);

    if(this.toastr.currentlyActive >= 2)
    {
      this.toastr.remove(this.toastr.toasts[this.toastr.currentlyActive].toastId - 2); 
    }
  }
  public toastrwarning(title: string, message: string) {
    this.toastr.warning(message, title);

    if(this.toastr.currentlyActive >= 2)
    {
      this.toastr.remove(this.toastr.toasts[this.toastr.currentlyActive].toastId - 2); 
    }
  }
}
