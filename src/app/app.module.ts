import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewLoginComponent } from './views/view-login/view-login.component';
import { ViewForgotPasswordComponent } from './views/view-forgot-password/view-forgot-password.component';
import { ViewChangePasswordComponent } from './views/view-change-password/view-change-password.component';
import { ViewUserListComponent } from './views/view-user-list/view-user-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormForgotPasswordComponent } from './components/form-forgot-password/form-forgot-password.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './components/notification/notification.component';
import { LoaderComponent } from './components/loader/loader.component';

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
    LoaderComponent
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
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
