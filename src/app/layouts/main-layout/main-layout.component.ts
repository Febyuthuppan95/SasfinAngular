import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private cookieService: CookieService,
    private IMenuService: MenuService
    ) {}

  @ViewChild(EditDashboardStyleComponent, { static: true })
  private editSidebar: EditDashboardStyleComponent;

  @ViewChild(FloatingButtonComponent, { static: true })
  private floatingButton: FloatingButtonComponent;

  @ViewChild(NavbarComponent, { static: true })
  private navbar: NavbarComponent;

  @ViewChild(SidebarComponent, { static: true })
  private sidebar: SidebarComponent;

  @ViewChild(FooterComponent, { static: true })
  private footer: FooterComponent;

  @ViewChild(SnackBarComponent, { static: true })
  private snackBar: SnackBarComponent;


  currentTheme = 'light';
  currentBackground: string;
  toggleHelpValue: boolean;
  offcanvasToggle: boolean;
  sidebarCollapse = true;
  innerWidth: any;
  tableContextMenu = false;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    const toggleHelpObserver = this.themeService.toggleHelp();

    this.themeService.observeTheme().subscribe((theme) => {
      this.currentTheme = theme;
      this.updateChildrenComponents();
    });

    this.cookieService.set('sidebar', 'true');

    this.themeService.observeBackground().subscribe((result: string) => {
      console.log(result);

      if (result !== undefined) {
        this.currentBackground = `${environment.ApiBackgroundImages}/${result}`;
      }
    });

    toggleHelpObserver.subscribe((toggle: boolean) => {
      this.toggleHelpValue = toggle;
    });
  }

  // Works
  onClick(event) {

    if (this.tableContextMenu) {
      this.themeService.toggleContextMenu(false);
    }
    this.themeService.isContextMenu().subscribe((context: boolean) => this.tableContextMenu = context);
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
    this.footer.currentTheme = this.currentTheme;
  }

  collapseSidebar() {
    this.sidebar.collapse = !this.sidebar.collapse;
    this.sidebarCollapse = this.sidebar.collapse;
    this.IMenuService.setSidebar(this.sidebarCollapse);
    this.cookieService.set('sidebar', this.sidebarCollapse ? 'true' : 'false');
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
}
