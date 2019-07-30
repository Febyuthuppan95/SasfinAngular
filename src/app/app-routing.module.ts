import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ViewForgotPasswordComponent } from './views/account/view-forgot-password/view-forgot-password.component';
import { ViewLoginComponent } from './views/account/view-login/view-login.component';
import { ViewUserListComponent } from './views/main/view-user-list/view-user-list.component';
import { ViewChangePasswordComponent } from './views/account/view-change-password/view-change-password.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AnonGuard } from './guards/anon.guard';
import { ViewUnauthorizedComponent } from './views/errors/view-unauthorized/view-unauthorized.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ViewDesignationsListComponent } from './views/main/view-designations-list/view-designations-list.component';
import { ViewBackgroundsListComponent } from './views/main/view-backgrounds-list/view-backgrounds-list.component';
import { ViewRightsListComponent } from './views/main/view-rights-list/view-rights-list.component';
import { AccountComponent } from './layouts/account/account.component';
import { ViewDesignationsRightsListComponent } from './views/main/view-designations-rights-list/view-designations-rights-list.component';
import {ViewUserRightsListComponent} from './views/main/view-user-rights-list/view-user-rights-list.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'account', component: AccountComponent,
        canActivate: [AnonGuard],
        children: [
          { path: 'login', component: ViewLoginComponent },
          { path: 'forgotpassword', component: ViewForgotPasswordComponent },
          { path: 'changepassword', component: ViewChangePasswordComponent }
        ]
      },
      {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthenticationGuard],
        children: [
          { path: '', redirectTo: '/account/login', pathMatch: 'full' },
          { path: 'users', component: ViewUserListComponent },
          { path: 'designations', component: ViewDesignationsListComponent },
          { path: 'designation-rights/:name/:id', component: ViewDesignationsRightsListComponent },
          { path: 'backgrounds', component: ViewBackgroundsListComponent },
          { path: 'rights', component: ViewRightsListComponent },
          { path: 'UserRights', component: ViewUserRightsListComponent }
        ]
      },
      { path: 'unauthorized', component: ViewUnauthorizedComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
