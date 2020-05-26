import { ViewCaptureQueueOverviewComponent } from './views/main/view-capture-queue-overview/view-capture-queue-overview.component';
import { ChatRedirectComponent } from './modules/chat/components/chat-redirect/chat-redirect.component';
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
import { ContextMenuServiceListComponent } from './views/main/view-service-list/view-service-list.component';
import { ContextCompanyServiceListComponent } from './views/main/view-company-service-list/view-company-service-list.component';
import { ContextTariffsListComponent } from './views/main/view-tariffs-list/view-tariffs-list.component';
import { ContextItemsListComponent } from './views/main/view-items-list/view-items-list.component';
import { ContextCompanyItemsListComponent } from './views/main/view-company-items-list/view-company-items-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyAddInfoTypesListComponent } from './views/main/view-company-add-info-types-list/view-company-add-info-types-list.component';
import { ViewContactTypesListComponent } from './views/main/view-contact-types-list/view-contact-types-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCurrenciesListComponent } from './views/main/view-currencies-list/view-currencies-list.component';
import { ViewAlternateItemsComponent } from './views/main/view-alternate-items/view-alternate-items.component';
import { Sad500LinesComponent } from './views/main/sad500-lines/sad500-lines.component';
// tslint:disable-next-line: max-line-length
import { ViewImportClearingInstructionsComponent } from './views/main/view-transaction-files/view-import-clearing-instructions/view-import-clearing-instructions.component';
import { ViewItemValuesComponent } from './views/main/view-item-values/view-item-values.component';
import { ViewSAD500Component } from './views/main/view-transaction-files/view-sad500/view-sad500.component';
// tslint:disable-next-line: max-line-length
import { ViewCustomReleaseNotificationsComponent } from './views/main/view-transaction-files/view-custom-release-notifications/view-custom-release-notifications.component';
import { ViewInvoicesComponent } from './views/main/view-transaction-files/view-invoices/view-invoices.component';
import { ViewItemParentsComponent } from './views/main/view-item-parents/view-item-parents.component';
import { ViewCompanyBOMsComponent } from './views/main/view-company-boms/view-company-boms.component';
import { ViewBOMLinesComponent } from './views/main/view-bom-lines/view-bom-lines.component';
import { ViewPermitsListComponent } from './views/main/view-permits-list/view-permits-list.component';
// tslint:disable-next-line: max-line-length
import { ViewPermitIMportTariffsListComponent } from './views/main/view-permit-import-tariffs-list/view-permit-import-tariffs-list.component';
import { ViewReportQueuesListComponent } from './views/main/view-reportQueues-list/view-reportQueues-list.component';
import { ViewCompanyServiceClaimsComponent } from './views/main/view-company-service-claims/view-company-service-claims.component';
import { ViewDutyTaxTypesComponent } from './views/main/view-tariffs-list/view-duty-tax-types/view-duty-tax-types.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyServiceclaimReportComponent } from './views/main/view-company-serviceclaim-report/view-company-serviceclaim-report.component';
import { ViewCaptureLandingComponent } from './views/main/view-capture-landing/view-capture-landing.component';


import { ViewCheckingScreenComponent } from './views/main/view-checking-screen/view-checking-screen.component';
import { PreviewReportsComponent } from './views/reports/preview-reports/preview-reports.component';
import { ViewCompanyOemListComponent } from './views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';
import { ViewOemQuarterListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-oem-quarter-list.component';
import { ViewQuarterSupplyListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-quarter-supply-list/view-quarter-supply-list.component';
import { ViewCompanyServiceClaimDataComponent } from './views/main/view-company-service-claims/view-company-service-claim-data/view-company-service-claim-data.component';
import { ClaimLayoutComponent } from './layouts/claim-layout/claim-layout.component';
// import { ViewReportsListComponent } from './views/main/view-reports-list/view-reports-list.component';
// import { ViewDutyTaxTypesComponent } from './views/main/view-tariffs-list/view-duty-tax-types/view-duty-tax-types.component';
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
          { path: 'user-rights/:name/:id', component: ViewUserRightsListComponent },
          { path: 'backgrounds', component: ViewBackgroundsListComponent },
          { path: 'rights', component: ViewRightsListComponent },
          { path: 'helpglossary', component: ViewHelpGlossaryComponent },
          { path: 'unitsofmeasure', component: ViewUnitsOfMeasureComponent },
          { path: 'locations', component: ViewPlacesComponent },
          { path: 'companies', component: ViewCompanyListComponent },
          { path: 'services', component: ContextMenuServiceListComponent },
          { path: 'tariffs', component: ContextTariffsListComponent },
          { path: 'items', component: ContextItemsListComponent },
          { path: 'capture-queue', component: ViewCaptureQueueOverviewComponent },
          { path: 'reportsqueues', component: ViewReportQueuesListComponent },
          { path: 'addresstypes', component: ViewAddressTypesListComponent },
          { path: 'companies/info', component: ViewCompanyInfoComponent },
          { path: 'companies/addresses', component: ViewCompanyAddressesComponent },
          { path: 'companies/services', component: ContextCompanyServiceListComponent },
          { path: 'companies/items', component: ContextCompanyItemsListComponent },
          { path: 'companies/boms', component: ViewCompanyBOMsComponent },
          { path: 'companies/serviceclaims', component: ViewCompanyServiceClaimsComponent },
          // { path: 'companies/serviceclaims/data', component: ViewCompanyServiceClaimDataComponent },
          { path: 'companies/serviceclaims/reports', component: ViewCompanyServiceclaimReportComponent },
          { path: 'companies/permits', component: ViewPermitsListComponent },
          { path: 'companies/permits/permitimporttariffs', component: ViewPermitIMportTariffsListComponent },
          { path: 'companies/boms/bomlines', component: ViewBOMLinesComponent },
          { path: 'companies/items/alternates', component: ViewAlternateItemsComponent },
          { path: 'companies/items/itemvalues', component: ViewItemValuesComponent },
          { path: 'companies/items/itemparents', component: ViewItemParentsComponent },
          { path: 'companies/contacts', component: ViewCompanyContactsComponent },
          { path: 'companies/transactions', component: ViewTransactionsComponent },
          { path: 'companies/oems', component: ViewCompanyOemListComponent },
          { path: 'companies/oem/quarters', component: ViewOemQuarterListComponent },
          { path: 'companies/oem/quarter/supply', component: ViewQuarterSupplyListComponent },
          { path: 'transaction/attachments', component: ViewTransactionFilesComponent },
          { path: 'transaction/capturerlanding', component: ViewCaptureLandingComponent },
          { path: 'transactions/', component: ViewTransactionsComponent },
          { path: 'companies/capture/info', component: ViewCaptureInfoComponent },
          { path: 'contacttypes', component: ViewContactTypesListComponent },
          { path: 'companyaddinfotypes', component: ViewCompanyAddInfoTypesListComponent },
          { path: 'currencies', component: ViewCurrenciesListComponent},
          { path: 'sad500/lines', component: Sad500LinesComponent },
          { path: 'transaction/import-clearing-instruction', component: ViewImportClearingInstructionsComponent },
          { path: 'transaction/sad500s', component: ViewSAD500Component },
          { path: 'transaction/custom-release-notification', component: ViewCustomReleaseNotificationsComponent },
          { path: 'transaction/invoices', component: ViewInvoicesComponent },
          { path: 'transaction/checklist/:id', component: ViewCheckingScreenComponent},
          { path: 'refreshComponent', component: ChatRedirectComponent},
          { path: 'claim/reports', component: PreviewReportsComponent},
          { path: 'tariff/duties', component: ViewDutyTaxTypesComponent }
        ]
      },
      { path: 'capture', component: CaptureLayoutComponent, children: [
        { path: 'transaction/attachment', component: ViewCaptureTransactionComponent },
        { path: 'transaction/attachment/:transactionId/:attachmentId/:docType/:transactionName',
         component: ViewCaptureTransactionComponent }
      ]},
      { path: 'claim', component: ClaimLayoutComponent, children: [
        {path: 'capture', component: ViewCompanyServiceClaimDataComponent}
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
