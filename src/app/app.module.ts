import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AnonGuard } from './guards/anon.guard';
import { UserService } from './services/user.Service';
import { ThemeService } from './services/theme.Service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewLoginComponent } from './views/account/view-login/view-login.component';
import { ViewForgotPasswordComponent } from './views/account/view-forgot-password/view-forgot-password.component';
import { ViewChangePasswordComponent } from './views/account/view-change-password/view-change-password.component';
import { ViewUserListComponent } from './views/main/view-user-list/view-user-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './components/notification/notification.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ViewNotFoundComponent } from './views/errors/view-not-found/view-not-found.component';
import { ViewUnauthorizedComponent } from './views/errors/view-unauthorized/view-unauthorized.component';
import { ImageModalComponent, NgbdModalContent } from './components/image-modal/image-modal.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FloatingButtonComponent } from './components/floating-button/floating-button.component';
import { EditDashboardStyleComponent } from './components/edit-dashboard-style/edit-dashboard-style.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { ViewRightsListComponent } from './views/main/view-rights-list/view-rights-list.component';
import { ViewDesignationsListComponent } from './views/main/view-designations-list/view-designations-list.component';
import { ViewBackgroundsListComponent } from './views/main/view-backgrounds-list/view-backgrounds-list.component';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ViewLoginComponent,
    ViewForgotPasswordComponent,
    ViewChangePasswordComponent,
    ViewUserListComponent,
    SidebarComponent,
    SearchbarComponent,
    LoaderComponent,
    ViewNotFoundComponent,
    ViewUnauthorizedComponent,
    ImageModalComponent,
    NgbdModalContent,
    NotificationComponent,
    FloatingButtonComponent,
    EditDashboardStyleComponent,
    MainLayoutComponent,
    DatatableComponent,
    ViewRightsListComponent,
    ViewDesignationsListComponent,
    ViewBackgroundsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        closeButton: false,
        progressBar: true,
        positionClass: 'toast-top-full-width',
        timeOut: 3000
      }
    ),
    NgbModule,
    NgxPaginationModule
  ],
  providers: [CookieService, AuthenticationGuard, UserService, AnonGuard, ThemeService],
  bootstrap: [AppComponent],
  entryComponents: [
    NgbdModalContent
  ]
})
export class AppModule { }
