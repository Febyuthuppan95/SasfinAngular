import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  activateSidebar = false;

  @Input() currentTheme = 'light';

  @Output() collapseSidebar = new EventEmitter<string>();
  @Output() offcanvas = new EventEmitter<string>();

  ngOnInit() {}

  logout() {
    this.userService.logout();
  }

  public collapseSidebarEvent() {
    this.collapseSidebar.emit('collapseSidebar');
  }

  public offcanvasSidebar() {
    this.offcanvas.emit('offcanvas');
    // console.log('event emmited from navbar');
  }

}
