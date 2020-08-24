import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.Service';
import { User } from '../../models/HttpResponses/User';
import { SnackbarModel } from '../../models/StateModels/SnackbarModel';
import { HelpSnackbar } from '../../services/HelpSnackbar.service';
import { UserIdleService } from 'angular-user-idle';
import { MessagingService } from 'src/app/modules/firebase/messaging.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService,
              private userIdle: UserIdleService,
              private snackbarService: HelpSnackbar,
              private messagingService: MessagingService) { }

  currentUser: User = this.userService.getCurrentUser();
  activateSidebar = false;

  notifications: any[] = [];
  newNotifications = false;

  @Input() currentTheme = 'light';

  @Output() collapseSidebar = new EventEmitter<string>();
  @Output() offcanvas = new EventEmitter<string>();

  ngOnInit() {
    console.log(localStorage.getItem('notify'));
    if (localStorage.getItem('notify') !== null) {
      this.notifications = JSON.parse(localStorage.getItem('notify'));

      const newNotify = this.notifications.filter(x => x.isRead === false);

      if (newNotify.length === 0) {
        this.newNotifications = false;
      }
    }

    this.messagingService.currentMessage.subscribe((msg) => {
      if (msg !== null) {
        this.notifications.push({
          id: UUID.UUID(),
          title: msg.notification.title,
          body: msg.notification.body,
          isRead: false,
        });

        this.newNotifications = true;
        localStorage.setItem('notify', JSON.stringify(this.notifications));
      }
    });
  }

  read(index: number) {
    const target = this.notifications[index];
    target.isRead = true;

    this.notifications.splice(index, 1, target);
    localStorage.setItem('notify', JSON.stringify(this.notifications));

    const newNotify = this.notifications.filter(x => x.isRead === false);

    if (newNotify.length === 0) {
      this.newNotifications = false;
    }
  }

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
