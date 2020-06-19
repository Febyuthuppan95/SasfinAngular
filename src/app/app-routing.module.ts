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
import { RightGuard } from './guards/right.guard';
import { RedirectComponent } from './views/main/redirect/redirect.component';
import {ViewCompanyBomsLinesErrorListComponent} from './views/main/view-company-boms/view-company-boms-lines-error-list/view-company-boms-lines-error-list.component';
import {ViewCompanyBomsItemsListComponent} from './views/main/view-company-boms/view-company-boms-items-list/view-company-boms-items-list.component';
import {ViewCompanyBomsItemsErrorsListComponent} from './views/main/view-company-boms/view-company-boms-items-list/view-company-boms-items-errors-list/view-company-boms-items-errors-list.component';
import {ViewCompanyBomsItemgroupsListComponent} from './views/main/view-company-boms/view-company-boms-itemgroups-list/view-company-boms-itemgroups-list.component';
import {ViewCompanyBomsItemgroupsErrorsListComponent} from './views/main/view-company-boms/view-company-boms-itemgroups-list/view-company-boms-itemgroups-errors-list/view-company-boms-itemgroups-errors-list.component';
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
          { path: '', component: RedirectComponent },
          { path: 'users', component: ViewUserListComponent, data: { right: 'Users' }, canActivate: [RightGuard] },
          { path: 'designations', component: ViewDesignationsListComponent, data: { right: 'Designations' }, canActivate: [RightGuard] },
          { path: 'designation-rights/:name/:id', component: ViewDesignationsRightsListComponent, data: { right: 'Designations' }, canActivate: [RightGuard] },
          { path: 'user-rights/:name/:id', component: ViewUserRightsListComponent, data: { right: 'Rights' }, canActivate: [RightGuard] },
          { path: 'backgrounds', component: ViewBackgroundsListComponent, data: { right: 'Backgrounds' }, canActivate: [RightGuard] },
          { path: 'rights', component: ViewRightsListComponent, data: { right: 'Rights' }, canActivate: [RightGuard] },
          { path: 'helpglossary', component: ViewHelpGlossaryComponent, data: { right: 'HelpGlossary' }, canActivate: [RightGuard] },
          { path: 'unitsofmeasure', component: ViewUnitsOfMeasureComponent, data: { right: 'UnitOfMeasures' }, canActivate: [RightGuard] },
          { path: 'locations', component: ViewPlacesComponent, data: { right: 'Countries' }, canActivate: [RightGuard] },
          { path: 'companies', component: ViewCompanyListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'services', component: ContextMenuServiceListComponent, data: { right: 'Services' }, canActivate: [RightGuard] },
          { path: 'tariffs', component: ContextTariffsListComponent, data: { right: 'Tariffs' }, canActivate: [RightGuard] },
          { path: 'items', component: ContextItemsListComponent, data: { right: 'Items' }, canActivate: [RightGuard] },
          { path: 'capture-queue', component: ViewCaptureQueueOverviewComponent },
          { path: 'reportsqueues', component: ViewReportQueuesListComponent, data: { right: 'ReportQueues' }, canActivate: [RightGuard] },
          { path: 'addresstypes', component: ViewAddressTypesListComponent, data: { right: 'AddressTypes' }, canActivate: [RightGuard] },
          { path: 'companies/info', component: ViewCompanyInfoComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/addresses', component: ViewCompanyAddressesComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/services', component: ContextCompanyServiceListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/items', component: ContextCompanyItemsListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms', component: ViewCompanyBOMsComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/serviceclaims', component: ViewCompanyServiceClaimsComponent, data: { right: 'Services' }, canActivate: [RightGuard] },
          // { path: 'companies/serviceclaims/data', component: ViewCompanyServiceClaimDataComponent },
          { path: 'companies/serviceclaims/reports', component: ViewCompanyServiceclaimReportComponent, data: { right: 'Services' }, canActivate: [RightGuard] },
          { path: 'companies/permits', component: ViewPermitsListComponent, data: { right: 'Services' }, canActivate: [RightGuard] },
          { path: 'companies/permits/permitimporttariffs', component: ViewPermitIMportTariffsListComponent, data: { right: 'Services' }, canActivate: [RightGuard] },
          { path: 'companies/boms/bomlines', component: ViewBOMLinesComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms/bomline-errors', component: ViewCompanyBomsLinesErrorListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms/items', component: ViewCompanyBomsItemsListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms/item-errors', component: ViewCompanyBomsItemsErrorsListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms/itemgroups', component: ViewCompanyBomsItemgroupsListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/boms/itemgroup-errors', component: ViewCompanyBomsItemgroupsErrorsListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/items/alternates', component: ViewAlternateItemsComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/items/itemvalues', component: ViewItemValuesComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/items/itemparents', component: ViewItemParentsComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/contacts', component: ViewCompanyContactsComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/transactions', component: ViewTransactionsComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'companies/oems', component: ViewCompanyOemListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/oem/quarters', component: ViewOemQuarterListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'companies/oem/quarter/supply', component: ViewQuarterSupplyListComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'transaction/attachments', component: ViewTransactionFilesComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/capturerlanding', component: ViewCaptureLandingComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transactions/', component: ViewTransactionsComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'companies/capture/info', component: ViewCaptureInfoComponent, data: { right: 'Companies' }, canActivate: [RightGuard] },
          { path: 'contacttypes', component: ViewContactTypesListComponent , data: { right: 'Transactions' }, canActivate: [RightGuard]},
          { path: 'companyaddinfotypes', component: ViewCompanyAddInfoTypesListComponent, data: { right: 'ContactTypes' }, canActivate: [RightGuard]  },
          { path: 'currencies', component: ViewCurrenciesListComponent, data: { right: 'Currencies' }, canActivate: [RightGuard]},
          { path: 'sad500/lines', component: Sad500LinesComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/import-clearing-instruction', component: ViewImportClearingInstructionsComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/sad500s', component: ViewSAD500Component, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/custom-release-notification', component: ViewCustomReleaseNotificationsComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/invoices', component: ViewInvoicesComponent, data: { right: 'Transactions' }, canActivate: [RightGuard] },
          { path: 'transaction/checklist/:id', component: ViewCheckingScreenComponent, data: { right: 'Transactions' }, canActivate: [RightGuard]},
          { path: 'refreshComponent', component: ChatRedirectComponent},
          { path: 'claim/reports', component: PreviewReportsComponent, data: { right: 'Transactions' }, canActivate: [RightGuard]},
          { path: 'tariff/duties', component: ViewDutyTaxTypesComponent, data: { right: 'Tariffs' }, canActivate: [RightGuard] }
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
