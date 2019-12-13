import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.Service';
import { User } from '../../models/HttpResponses/User';
import {SnackbarModel} from '../../models/StateModels/SnackbarModel';
import {HelpSnackbar} from '../../services/HelpSnackbar.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService,
              private userIdle: UserIdleService,
              private snackbarService: HelpSnackbar) { }

  currentUser: User = this.userService.getCurrentUser();
  activateSidebar = false;

  @Input() currentTheme = 'light';

  @Output() collapseSidebar = new EventEmitter<string>();
  @Output() offcanvas = new EventEmitter<string>();

  ngOnInit() {}

  logout() {
    this.userIdle.resetTimer();
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    this.closeHelpContext();
    this.userService.logout();
  }

  public collapseSidebarEvent() {
    this.collapseSidebar.emit('collapseSidebar');
  }

  public offcanvasSidebar() {
    this.offcanvas.emit('offcanvas');
  }

  closeHelpContext() {
    const newContext: SnackbarModel = {
      display: false,
      slug: '',
    };
    this.snackbarService.setHelpContext(newContext);
  }

  updateHelpContext(slug: string) {
    const newContext: SnackbarModel = {
      display: true,
      slug
    };

    this.snackbarService.setHelpContext(newContext);
  }

}
