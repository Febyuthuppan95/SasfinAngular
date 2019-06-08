import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationGuard } from './middleware/AuthenticationGuard';
import { AnonGuard } from './middleware/AnonGuard';
import { UserService } from './services/UserService';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewLoginComponent } from './views/account/view-login/view-login.component';
import { ViewForgotPasswordComponent } from './views/account/view-forgot-password/view-forgot-password.component';
import { ViewChangePasswordComponent } from './views/account/view-change-password/view-change-password.component';
import { ViewUserListComponent } from './views/main/view-user-list/view-user-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormForgotPasswordComponent } from './components/form-forgot-password/form-forgot-password.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './components/notification/notification.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ViewNotFoundComponent } from './views/errors/view-not-found/view-not-found.component';
import { ViewUnauthorizedComponent } from './views/errors/view-unauthorized/view-unauthorized.component';

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
    FormForgotPasswordComponent,
    SidebarComponent,
    SearchbarComponent,
    NotificationComponent,
    LoaderComponent,
    ViewNotFoundComponent,
    ViewUnauthorizedComponent,
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
    )
  ],
  providers: [CookieService, AuthenticationGuard, UserService, AnonGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
