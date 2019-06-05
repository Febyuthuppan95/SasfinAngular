import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertDangerComponent } from './components/alert-danger/alert-danger.component';
import { AlertWarningComponent } from './components/alert-warning/alert-warning.component';
import { AlertSuccessComponent } from './components/alert-success/alert-success.component';
import { ViewLoginComponent } from './views/view-login/view-login.component';
import { ViewForgotPasswordComponent } from './views/view-forgot-password/view-forgot-password.component';
import { ViewChangePasswordComponent } from './views/view-change-password/view-change-password.component';
import { ViewUserListComponent } from './views/view-user-list/view-user-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormForgotPasswordComponent } from './components/form-forgot-password/form-forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AlertDangerComponent,
    AlertWarningComponent,
    AlertSuccessComponent,
    ViewLoginComponent,
    ViewForgotPasswordComponent,
    ViewChangePasswordComponent,
    ViewUserListComponent,
    FormForgotPasswordComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
