import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ViewForgotPasswordComponent } from './views/account/view-forgot-password/view-forgot-password.component';
import { ViewLoginComponent } from './views/account/view-login/view-login.component';
import { ViewUserListComponent } from './views/main/view-user-list/view-user-list.component';
import { ViewChangePasswordComponent } from './views/account/view-change-password/view-change-password.component';

import { AuthenticationGuard } from './middleware/AuthenticationGuard';
import { AnonGuard } from './middleware/AnonGuard';
import { ViewUnauthorizedComponent } from './views/errors/view-unauthorized/view-unauthorized.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';



const routes: Routes = [
  { path: '', component: ViewLoginComponent, canActivate: [AnonGuard] },
  { path: 'account/forgotpassword', component: ViewForgotPasswordComponent },
  { path: 'account/changepassword', component: ViewChangePasswordComponent },
  { path: 'users', component: MainLayoutComponent, canActivate: [AuthenticationGuard],
    children: [
      { path: '', component: ViewUserListComponent },
    ],
  },
  { path: 'unauthorized', component: ViewUnauthorizedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
