import { ContextMenuUserComponent } from './components/menus/context-menu-user/context-menu-user.component';
import { DesignationService } from './services/Designation.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AnonGuard } from './guards/anon.guard';
import { UserService } from './services/user.Service';
import { ThemeService } from './services/theme.Service';
import { MenuService } from './services/Menu.service';
import { BackgroundService } from './services/Background.service';
import { AuthenticationService } from './services/Authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { MaterialModule } from './modules/material.module';

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
import { ViewRightsListComponent } from './views/main/view-rights-list/view-rights-list.component';
import { ViewDesignationsListComponent } from './views/main/view-designations-list/view-designations-list.component';
import { ViewBackgroundsListComponent } from './views/main/view-backgrounds-list/view-backgrounds-list.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { AccountComponent } from './layouts/account/account.component';
import { RightService } from './services/Right.Service';
import { ViewDesignationsRightsListComponent } from './views/main/view-designations-rights-list/view-designations-rights-list.component';
import { ContextMenuComponent } from './components/menus/context-menu/context-menu.component';
import { UserRightService } from './services/UserRight.service';
import { ViewHelpGlossaryComponent } from './views/main/view-help-glossary/view-help-glossary.component';
import { HelpGlossaryService } from './services/HelpGlossary.Service';
import { HelpGlossaryContextMenuComponent } from './components/menus/help-glossary-context-menu/help-glossary-context-menu.component';
import { HelpSnackbar } from './services/HelpSnackbar.service';
import { ViewUnitsOfMeasureComponent } from './views/main/view-units-of-measure/view-units-of-measure.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuUnitsOfMeasureComponent } from './components/menus/context-menu-units-of-measure/context-menu-units-of-measure.component';
import { ModalStandardComponent } from './components/modal-standard/modal-standard.component';
import { ViewUserRightsListComponent } from './views/main/view-user-rights-list/view-user-rights-list.component';
import { ViewPlacesComponent } from './views/main/view-places/view-places.component';
import { PlaceService } from './services/Place.Service';
import { ContextMenuLocationComponent } from './components/menus/context-menu-location/context-menu-location.component';
import { CaptureLayoutComponent } from './layouts/capture-layout/capture-layout.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { DocumentService } from './services/Document.Service';
import { ViewCompanyListComponent } from './views/main/view-company-list/view-company-list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CompaniesContextMenuComponent } from './components/menus/companies-context-menu/companies-context-menu.component';
import { ViewTransactionsComponent } from './views/main/view-transactions/view-transactions.component';
import { ViewTransactionFilesComponent } from './views/main/view-transaction-files/view-transaction-files.component';
import { TransactionService } from './services/Transaction.Service';
import { ContextMenuTransactionComponent } from './components/menus/context-menu-transaction/context-menu-transaction.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuTransactionFileComponent } from './components/menus/context-menu-transaction-file/context-menu-transaction-file.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuTransactionAttachmentComponent } from './components/menus/context-menu-transaction-attachment/context-menu-transaction-attachment.component';
import { ViewCaptureTransactionComponent } from './views/capture/view-capture-transaction/view-capture-transaction.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ContextMenuUserrightsComponent } from './components/menus/context-menu-userrights/context-menu-userrights.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuDesignationrightsComponent } from './components/menus/context-menu-designationrights/context-menu-designationrights.component';
import { ViewAddressTypesListComponent } from './views/main/view-address-types-list/view-address-types-list.component';
import { ViewCompanyInfoComponent } from './views/main/view-company-info/view-company-info.component';
import { ViewCompanyAddressesComponent } from './views/main/view-company-addresses/view-company-addresses.component';
import { ViewCompanyContactsComponent } from './views/main/view-company-contacts/view-company-contacts.component';
import { ContextMenuCompanyInfoComponent } from './components/menus/context-menu-company-info/context-menu-company-info.component';
import { UserIdleModule } from 'angular-user-idle';
import { CompanyService } from './services/Company.Service';
import { FormCustomReleaseComponent } from './components/forms/form-custom-release/form-custom-release.component';
import { AddressTypesService } from './services/AddressTypes.Service';
import { ContextMenuAddressTypesComponent } from './components/menus/context-menu-address-types/context-menu-address-types.component';
import { KeyHandlerDirective } from './directives/key-handler.directive';
import { ImageDirective } from './directives/image.directive';
import { ViewCaptureInfoComponent } from './views/main/view-capture-info/view-capture-info.component';
import { ContextMenuCaptureInfoComponent } from './components/menus/context-menu-capture-info/context-menu-capture-info.component';
import { MenuComponent } from './components/menus/menu/menu.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CitiesService } from './services/Cities.Service';
import { TableComponent } from './components/table/table.component';
import { AttachmentCaptureStatusBlockComponent } from './components/attachment-capture-status-block/attachment-capture-status-block.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { ContextMenuServiceListComponent } from './views/main/context-menu-service-list/context-menu-service-list.component';
import { ContextCompanyServiceListComponent } from './views/main/context-company-service-list/context-company-service-list.component';
import { ContextTariffsListComponent } from './views/main/context-tariffs-list/context-tariffs-list.component';
import { ContextItemsListComponent } from './views/main/context-items-list/context-items-list.component';
import { ContextCompanyItemsListComponent } from './views/main/context-company-items-list/context-company-items-list.component';

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
    ViewRightsListComponent,
    ViewDesignationsListComponent,
    ViewBackgroundsListComponent,
    SnackBarComponent,
    AccountComponent,
    ViewDesignationsRightsListComponent,
    ContextMenuComponent,
    ViewHelpGlossaryComponent,
    HelpGlossaryContextMenuComponent,
    ViewUnitsOfMeasureComponent,
    ContextMenuUserComponent,
    ContextMenuUnitsOfMeasureComponent,
    ModalStandardComponent,
    ViewUserRightsListComponent,
    ViewPlacesComponent,
    ContextMenuLocationComponent,
    CaptureLayoutComponent,
    DocumentViewerComponent,
    ViewCompanyListComponent,
    CompaniesContextMenuComponent,
    ViewTransactionsComponent,
    ViewTransactionFilesComponent,
    ContextMenuTransactionComponent,
    ContextMenuTransactionFileComponent,
    ContextMenuTransactionAttachmentComponent,
    ViewCaptureTransactionComponent,
    ContextMenuUserrightsComponent,
    ContextMenuDesignationrightsComponent,
    ViewAddressTypesListComponent,
    ViewCompanyInfoComponent,
    ViewCompanyAddressesComponent,
    ViewCompanyContactsComponent,
    ContextMenuCompanyInfoComponent,
    FormCustomReleaseComponent,
    KeyHandlerDirective,
    ImageDirective,
    ContextMenuAddressTypesComponent,
    ViewCaptureInfoComponent,
    ContextMenuCaptureInfoComponent,
    MenuComponent,
    TableComponent,
    AttachmentCaptureStatusBlockComponent,
    PaginationComponent,
    TableHeaderComponent,
    ContextMenuServiceListComponent,
    ContextCompanyServiceListComponent,
    ContextTariffsListComponent,
    ContextItemsListComponent,
    ContextCompanyItemsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    UserIdleModule.forRoot({idle: 900, timeout: 12, ping: 5}),
    ToastrModule.forRoot(
      {
        closeButton: false,
        progressBar: true,
        positionClass: 'toast-top-full-width',
        timeOut: 3000
      }
    ),
    NgbModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    MaterialModule,
    AngularDraggableModule
  ],
  providers: [
    CookieService,
    AuthenticationGuard,
    UserService,
    AnonGuard,
    ThemeService,
    AddressTypesService,
    DesignationService,
    RightService,
    MenuService,
    BackgroundService,
    UserRightService,
    HelpGlossaryService,
    PlaceService,
    TransactionService,
    HelpSnackbar,
    DocumentService,
    AuthenticationService,
    CitiesService,
    CompanyService,
    AddressTypesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NgbdModalContent,
  ]
})
export class AppModule { }
