import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/UserService';
import { Router } from '@angular/router';
import { User } from './../../models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  currentUser: User = this.userService.getCurrentUser();

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }

}
