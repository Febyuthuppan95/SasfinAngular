import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User.Service';
import { Router } from '@angular/router';
import { User } from './../../models/User';
import { ThemeService } from 'src/app/services/Theme.Service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private themeService: ThemeService) { }

  currentUser: User = this.userService.getCurrentUser();
  currentTheme = 'light';

  ngOnInit() {
    const studentsObservable = this.themeService.getCurrentTheme();
    studentsObservable.subscribe((themeData: string) => {
        this.currentTheme = themeData;
    });
  }

  logout() {
    this.userService.logout();
  }

}
