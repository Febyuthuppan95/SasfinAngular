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
import { ViewHelpGlossaryComponent } from './views/main/view-help-glossary/view-help-glossary.component';
import { ViewUnitsOfMeasureComponent } from './views/main/view-units-of-measure/view-units-of-measure.component';
import { ViewUserRightsListComponent } from './views/main/view-user-rights-list/view-user-rights-list.component';
import { ViewPlacesComponent } from './views/main/view-places/view-places.component';
import { CaptureLayoutComponent } from './layouts/capture-layout/capture-layout.component';
import { ViewCompanyListComponent } from './views/main/view-company-list/view-company-list.component';
import { ViewTransactionsComponent } from './views/main/view-transactions/view-transactions.component';
import { ViewTransactionFilesComponent } from './views/main/view-transaction-files/view-transaction-files.component';
import { ViewCaptureTransactionComponent } from './views/capture/view-capture-transaction/view-capture-transaction.component';
import { ViewCompanyInfoComponent } from './views/main/view-company-info/view-company-info.component';
import { ViewCompanyAddressesComponent } from './views/main/view-company-addresses/view-company-addresses.component';
import { ViewCompanyContactsComponent } from './views/main/view-company-contacts/view-company-contacts.component';
import { ViewAddressTypesListComponent } from './views/main/view-address-types-list/view-address-types-list.component';
import { ViewCaptureInfoComponent } from './views/main/view-capture-info/view-capture-info.component';
import { ContextMenuServiceListComponent } from './views/main/context-menu-service-list/context-menu-service-list.component';
import { ContextCompanyServiceListComponent } from './views/main/context-company-service-list/context-company-service-list.component';
import { ContextTariffsListComponent } from './views/main/context-tariffs-list/context-tariffs-list.component';
import { ContextItemsListComponent } from './views/main/context-items-list/context-items-list.component';
import { ContextCompanyItemsListComponent } from './views/main/context-company-items-list/context-company-items-list.component';

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
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', component: ViewUserListComponent },
          { path: 'designations', component: ViewDesignationsListComponent },
          { path: 'designation-rights/:name/:id', component: ViewDesignationsRightsListComponent },
           {path: 'user-rights/:name/:id', component: ViewUserRightsListComponent},
          { path: 'backgrounds', component: ViewBackgroundsListComponent },
          { path: 'rights', component: ViewRightsListComponent },
          { path: 'helpglossary', component: ViewHelpGlossaryComponent },
          { path: 'unitsofmeasure', component: ViewUnitsOfMeasureComponent },
          { path: 'locations', component: ViewPlacesComponent },
          { path: 'companies', component: ViewCompanyListComponent },
          { path: 'services', component: ContextMenuServiceListComponent },
          { path: 'tariff', component: ContextTariffsListComponent },
          { path: 'item', component: ContextItemsListComponent },
          { path: 'addresstypes', component: ViewAddressTypesListComponent },
          { path: 'companies/info', component: ViewCompanyInfoComponent },
          { path: 'companies/addresses', component: ViewCompanyAddressesComponent },
          { path: 'companies/services', component: ContextCompanyServiceListComponent },
          { path: 'companies/items', component: ContextCompanyItemsListComponent },
          { path: 'companies/contacts', component: ViewCompanyContactsComponent },
          { path: 'companies/transactions', component: ViewTransactionsComponent },
          { path: 'transaction/attachments', component: ViewTransactionFilesComponent },
          { path: 'transactions/', component: ViewTransactionsComponent },
          { path: 'companies/capture/info', component: ViewCaptureInfoComponent },
        ]
      },
      { path: 'capture', component: CaptureLayoutComponent, children: [
        { path: 'transaction/attachment', component: ViewCaptureTransactionComponent }
      ]},
      { path: 'unauthorized', component: ViewUnauthorizedComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
