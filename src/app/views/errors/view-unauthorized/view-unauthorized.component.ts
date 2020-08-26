import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-view-unauthorized',
  templateUrl: './view-unauthorized.component.html',
  styleUrls: ['./view-unauthorized.component.scss']
})
export class ViewUnauthorizedComponent implements OnInit {

  constructor(private user: UserService) { }
  loggedIn = this.user.isLoggedIn();

  ngOnInit() {
  }


  logOut() {
    this.user.logout();
  }

}
