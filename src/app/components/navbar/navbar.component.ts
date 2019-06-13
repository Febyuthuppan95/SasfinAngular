import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.Service';
import { User } from '../../models/HttpResponses/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService) { }

  currentUser: User = this.userService.getCurrentUser();

  @Input() currentTheme = 'light';

  ngOnInit() { }

  logout() {
    this.userService.logout();
  }

}
