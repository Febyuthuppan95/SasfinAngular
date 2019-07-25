import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { EditDashboardStyleComponent } from 'src/app/components/edit-dashboard-style/edit-dashboard-style.component';
import { FloatingButtonComponent } from 'src/app/components/floating-button/floating-button.component';
import { ThemeService } from 'src/app/services/theme.Service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { BackgroundResponse } from 'src/app/models/HttpResponses/BackgroundGet';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private cookieService: CookieService
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
  currentBackground = this.themeService.getBackground();
  toggleHelpValue: boolean;
  offcanvasToggle: boolean;
  sidebarCollapse: boolean = true;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    const themeObserver = this.themeService.getCurrentTheme();
    const backgroundObserver = this.themeService.getBackgroundUser();

    themeObserver.subscribe((themeData: string) => {
      this.currentTheme = themeData;
      this.updateChildrenComponents();
    });
    if (this.cookieService.get('currentUser') != null) {
      backgroundObserver.subscribe((result: BackgroundResponse) => {
        this.currentBackground = `${environment.ImageRoute}/backgrounds/${result.image}`;
      });
    }

    const toggleHelpObserver = this.themeService.toggleHelp();
    toggleHelpObserver.subscribe((toggle: boolean) => {
      this.toggleHelpValue = toggle;
      this.snackBar.allow = toggle;
    });
  }

  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (window.innerWidth <= 1200) {
      // this.sidebarCollapse = true;
    }
    console.log(this.innerWidth);
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
  }

  showSnackBar(options: string) {
    const optionsJson = JSON.parse(options);
    this.snackBar.content = optionsJson.content;
    this.snackBar.title = optionsJson.title;
    this.snackBar.display = true;
  }

  hideSnackBar() {
    // setTimeout(() => {
    //   this.snackBar.display = false;
    // }, 2000);
  }

  offCanvasSidebar(event: string) {
    this.offcanvasToggle = !this.offcanvasToggle;
  }

  updateBackground(event: string) {
    this.currentBackground = event;
    this.themeService.setBackground(event);
  }
  toggleHelp(event: boolean) {
    this.toggleHelpValue = event;
    this.themeService.setToggleValue(event);
  }
}
