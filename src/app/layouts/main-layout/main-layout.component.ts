import { Component, OnInit, ViewChild } from '@angular/core';
import { EditDashboardStyleComponent } from 'src/app/components/edit-dashboard-style/edit-dashboard-style.component';
import { FloatingButtonComponent } from 'src/app/components/floating-button/floating-button.component';
import { ThemeService } from 'src/app/services/theme.Service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

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

  ngOnInit() {
    const themeObserver = this.themeService.getCurrentTheme();
    themeObserver.subscribe((themeData: string) => {
      this.currentTheme = themeData;
      this.updateChildrenComponents();
    });

    const toggleHelpObserver = this.themeService.toggleHelp();
    toggleHelpObserver.subscribe((toggle: boolean) => {
      this.toggleHelpValue = toggle;
      this.snackBar.allow = toggle;
    });
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
}
