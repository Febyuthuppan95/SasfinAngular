import { Component, OnInit, ViewChild, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { EditDashboardStyleComponent } from 'src/app/components/edit-dashboard-style/edit-dashboard-style.component';
import { FloatingButtonComponent } from 'src/app/components/floating-button/floating-button.component';
import { ThemeService } from 'src/app/services/theme.Service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from 'src/app/services/Menu.Service';
import { environment } from 'src/environments/environment';
import { UserIdleService } from 'angular-user-idle';
import { UserService } from 'src/app/services/user.Service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChannelService } from 'src/app/modules/chat/services/channel.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private themeService: ThemeService,
    private cookieService: CookieService,
    private IMenuService: MenuService,
    private userIdle: UserIdleService,
    private userService: UserService,
    private snackbarService: HelpSnackbar,
    private channelService: ChannelService,
    private snackBarMat: MatSnackBar
    ) {}

  @ViewChild(EditDashboardStyleComponent, { static: true })
  private editSidebar: EditDashboardStyleComponent;

  @ViewChild(FloatingButtonComponent, { static: true })
  private floatingButton: FloatingButtonComponent;

  @ViewChild(NavbarComponent, { static: true })
  private navbar: NavbarComponent;

  @ViewChild(SidebarComponent, { static: true })
  private sidebar: SidebarComponent;

  // @ViewChild(FooterComponent, { static: true })
  // private footer: FooterComponent;

  @ViewChild(SnackBarComponent, { static: true })
  private snackBar: SnackBarComponent;

  @ViewChild('opentimeoutModal', {static: true })
  opentimeoutModal: ElementRef;

  @ViewChild('closetimeoutModal', {static: true })
  closetimeoutModal: ElementRef;

  private unsubscribe$ = new Subject<void>();

  currentTheme = 'light';
  currentBackground: string;
  toggleHelpValue: boolean;
  offcanvasToggle: boolean;
  sidebarCollapse = true;
  innerWidth: any;
  tableContextMenu = false;
  count = 0;
  showChat = false;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    const toggleHelpObserver = this.themeService.toggleHelp();

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
      this.updateChildrenComponents();
    });
    localStorage.setItem('sidebar', 'true');
    this.themeService.observeBackground()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((result: string) => {
      if (result !== undefined) {
        this.currentBackground = `${environment.ApiBackgroundImages}/${result}`;
      }
    });

    toggleHelpObserver
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((toggle: boolean) => {
      this.toggleHelpValue = toggle;
    });

    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(count => {
      this.TriggerSessionTimeout(count);
    });

    // Start watch when time is up.
    this.userIdle.onTimeout()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.closetimeoutModal.nativeElement.click();
      this.userIdle.resetTimer();
      this.userIdle.stopTimer();
      this.userIdle.stopWatching();
      this.closeHelpContext();
      this.userService.logout();
    });

    this.userIdle.ping$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {});


    // this.channelService.observeUserConnection().subscribe((hub: signalR.HubConnection) => {
    //   if (hub !== null) {
    //     hub.on('userChatConnection', (msg: string) => {
    //       this.snackBarMat.open(msg, '', {
    //         duration: 2000
    //       });
    //     });
    //   }
    // });
  }

  closeHelpContext() {
    const newContext: SnackbarModel = {
      display: false,
      slug: '',
    };
    this.snackbarService.setHelpContext(newContext);
  }

  // Works
  onClick(event) {

    if (this.tableContextMenu) {
      this.themeService.toggleContextMenu(false);
    }
    this.themeService.isContextMenu()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((context: boolean) => this.tableContextMenu = context);
  }

  openEditTile() {
    this.editSidebar.show = true;
  }

  closeEditTile() {
    this.editSidebar.show = false;
  }

  updateChildrenComponents() {
    this.navbar.currentTheme = this.currentTheme;
    this.sidebar.currentTheme = this.currentTheme;
    // this.footer.currentTheme = this.currentTheme;
  }

  collapseSidebar() {
    this.sidebar.collapse = !this.sidebar.collapse;
    this.sidebarCollapse = this.sidebar.collapse;
    this.IMenuService.setSidebar(this.sidebarCollapse);
    localStorage.setItem('sidebar', this.sidebarCollapse ? 'true' : 'false');
  }

  offCanvasSidebar(event: string) {
    this.offcanvasToggle = !this.offcanvasToggle;
  }

  toggleHelp(event: boolean) {
    this.toggleHelpValue = event;
    this.themeService.setToggleValue(event);
  }
  updateBackground(event) {

  }

  ResetSessionTimer() {
    this.userIdle.stopTimer();
    this.userIdle.resetTimer();
  }

  TriggerSessionTimeout(count) {
   this.count = 11;
   this.count =  this.count - count;

   if (this.count === 10) {
    this.opentimeoutModal.nativeElement.click();

   }
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
