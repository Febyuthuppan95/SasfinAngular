import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.Service';
import { Router } from '@angular/router';
import { User } from '../../models/HttpResponses/User';
import { ThemeService } from 'src/app/services/theme.Service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private themeService: ThemeService) { }

  currentUser: User = this.userService.getCurrentUser();

  @Input() currentTheme = 'light';

  ngOnInit() { }

  logout() {
    this.userService.logout();
  }

}
