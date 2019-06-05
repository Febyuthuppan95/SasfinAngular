import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ViewForgotPasswordComponent } from './views/view-forgot-password/view-forgot-password.component';
import { ViewLoginComponent } from './views/view-login/view-login.component';
import { ViewUserListComponent } from './views/view-user-list/view-user-list.component';
import { ViewChangePasswordComponent } from './views/view-change-password/view-change-password.component';



const routes: Routes = [
  { path: '', component: ViewLoginComponent },
  { path: 'account/forgotpassword', component: ViewForgotPasswordComponent },
  { path: 'account/changepassword', component: ViewChangePasswordComponent },
  { path: 'users', component: ViewUserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
