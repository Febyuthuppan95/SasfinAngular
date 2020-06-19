

// tslint:disable-next-line: max-line-length
import { ContextMenuUserComponent } from './components/menus/context-menu-user/context-menu-user.component';
import { DesignationService } from './services/Designation.service';
import { BrowserModule } from '@angular/platform-browser';
import { ChatConversationComponent } from './modules/chat/components/chat-conversation/chat-conversation.component';
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
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';


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
import { FormCustomReleaseComponent } from './components/forms/capture/form-custom-release/form-custom-release.component';
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
// tslint:disable-next-line: max-line-length
import { AttachmentCaptureStatusBlockComponent } from './components/attachment-capture-status-block/attachment-capture-status-block.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { ContextMenuServiceListComponent } from './views/main/view-service-list/view-service-list.component';
import { ChatOverlayComponent } from './modules/chat/components/chat-overlay/chat-overlay.component';
import { ChatUserTileComponent } from './modules/chat/components/chat-user-tile/chat-user-tile.component';
import { ChatBubbleComponent } from './modules/chat/components/chat-bubble/chat-bubble.component';
import { ContextCompanyServiceListComponent } from './views/main/view-company-service-list/view-company-service-list.component';
import { ContextTariffsListComponent } from './views/main/view-tariffs-list/view-tariffs-list.component';
import { ContextItemsListComponent } from './views/main/view-items-list/view-items-list.component';
import { ContextCompanyItemsListComponent } from './views/main/view-company-items-list/view-company-items-list.component';
import { ViewItemTypesListComponent } from './views/main/view-item-types-list/view-item-types-list.component';
// tslint:disable-next-line: max-line-length
import { FormImportClearingInstructionComponent } from './components/forms/capture/form-import-clearing-instruction/form-import-clearing-instruction.component';
import { FormSAD500Component } from './components/forms/capture/form-sad500/form-sad500.component';
import { ChatService } from './modules/chat/services/chat.service';
import { ChatConversationListComponent } from './modules/chat/components/chat-conversation-list/chat-conversation-list.component';
import { ChatContactListComponent } from './modules/chat/components/chat-contact-list/chat-contact-list.component';
import { ChatConversationTileComponent } from './modules/chat/components/chat-conversation-tile/chat-conversation-tile.component';
import { ContextMenuCompanyAddressComponent } from './components/menus/context-menu-company-address/context-menu-company-address.component';
import { ContextMenuCompanyServiceComponent } from './components/menus/context-menu-company-service/context-menu-company-service.component';
import { ViewContactTypesListComponent } from './views/main/view-contact-types-list/view-contact-types-list.component';
import { ContactTypesService } from './services/ContactTypes.Service';
import { ContextMenuContactTypesComponent } from './components/menus/context-menu-contact-types/context-menu-contact-types.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyAddInfoTypesListComponent } from './views/main/view-company-add-info-types-list/view-company-add-info-types-list.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuCompanyAddInfoTypesComponent } from './components/menus/context-menu-company-add-info-types/context-menu-company-add-info-types.component';
import { CompanyAddInfoTypesService } from './services/CompanyAddInfoTypes.Service';
import { ContextMenuCurrenciesComponent } from './components/menus/context-menu-currencies/context-menu-currencies.component';
import { ViewCurrenciesListComponent } from './views/main/view-currencies-list/view-currencies-list.component';
import { CurrenciesService } from './services/Currencies.Service';
import { ContextMenuCompanyItemsComponent } from './components/menus/context-menu-company-items/context-menu-company-items.component';
import { ViewAlternateItemsComponent } from './views/main/view-alternate-items/view-alternate-items.component';

import { CapturePreviewComponent } from './layouts/capture-layout/capture-preview/capture-preview.component';
import { ApiService } from './services/api.service';
import { CaptureService } from './services/capture.service';
import { Sad500LinesComponent } from './views/main/sad500-lines/sad500-lines.component';
import { FormSAD500LineComponent } from './components/forms/capture/form-sad500/form-sad500-line/form-sad500-line.component';
import { Sad500LinePreviewComponent } from './components/dialogs/sad500-line-preview/sad500-line-preview.component';
import { FocusDirective } from './directives/focus.directive';
import { FormInvoiceComponent } from './components/forms/capture/form-invoice/form-invoice.component';
import { FormVOCComponent } from './components/forms/capture/form-voc/form-voc.component';
import { ContextMenuSADLinesComponent } from './components/menus/context-menu-sadlines/context-menu-sadlines.component';
import { ContextMenuItemsGroupComponent } from './components/menus/context-menu-items-group/context-menu-items-group.component';
// tslint:disable-next-line: max-line-length
import { ViewImportClearingInstructionsComponent } from './views/main/view-transaction-files/view-import-clearing-instructions/view-import-clearing-instructions.component';
// tslint:disable-next-line: max-line-length
import { ViewCustomReleaseNotificationsComponent } from './views/main/view-transaction-files/view-custom-release-notifications/view-custom-release-notifications.component';
import { ViewSAD500Component } from './views/main/view-transaction-files/view-sad500/view-sad500.component';
import { ValidateService } from './services/Validation.Service';
import { ViewItemValuesComponent } from './views/main/view-item-values/view-item-values.component';
import { ContextMenuItemsValuesComponent } from './components/menus/context-menu-items-values/context-menu-items-values.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ContextMenuItemsComponent } from './components/menus/context-menu-items/context-menu-items.component';
import { ContextICIComponent } from './components/menus/context-ici/context-ici.component';
import { ContextSAD500Component } from './components/menus/context-sad500/context-sad500.component';
import { ImagePreviewDialogComponent } from './components/table/image-preview-dialog/image-preview-dialog.component';
import { ViewInvoicesComponent } from './views/main/view-transaction-files/view-invoices/view-invoices.component';
import { CaptureFormDirective } from './directives/capture-form.directive';
import { ComponentService } from './services/ComponentLoader.service';
import { ViewItemParentsComponent } from './views/main/view-item-parents/view-item-parents.component';
import { ContextMenuItemsParentsComponent } from './components/menus/context-menu-items-parents/context-menu-items-parents.component';
import { TariffService } from './services/Tariff.service';
import { ViewCompanyBOMsComponent } from './views/main/view-company-boms/view-company-boms.component';
import { ViewBOMLinesComponent } from './views/main/view-bom-lines/view-bom-lines.component';
import { ContextMenuBomsComponent } from './components/menus/context-menu-boms/context-menu-boms.component';
import { ViewPermitsListComponent } from './views/main/view-permits-list/view-permits-list.component';
// tslint:disable-next-line: max-line-length
import { ViewPermitIMportTariffsListComponent } from './views/main/view-permit-import-tariffs-list/view-permit-import-tariffs-list.component';
import { ContextMenuPermitsComponent } from './components/menus/context-menu-permits/context-menu-permits.component';
import { ViewReportQueuesListComponent } from './views/main/view-reportQueues-list/view-reportQueues-list.component';
import { ReportsService } from './services/Reports.Service';
import { FormInvoiceLinesComponent } from './components/forms/capture/form-invoice/form-invoice-lines/form-invoice-lines.component';
import { QuitDialogComponent } from './layouts/capture-layout/quit-dialog/quit-dialog.component';
import { SubmitDialogComponent } from './layouts/capture-layout/submit-dialog/submit-dialog.component';

import { ViewCompanyServiceClaimsComponent } from './views/main/view-company-service-claims/view-company-service-claims.component';
import { ContextMenuServiceClaimsComponent } from './components/menus/context-menu-service-claims/context-menu-service-claims.component';

import { FormWaybillComponent } from './components/forms/capture/form-waybill/form-waybill.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyServiceclaimReportComponent } from './views/main/view-company-serviceclaim-report/view-company-serviceclaim-report.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuCompanyServiceclaimReportComponent } from './components/menus/context-menu-company-serviceclaim-report/context-menu-company-serviceclaim-report.component';

import { ContextMenuTariffsComponent } from './views/main/view-tariffs-list/context-menu-tariffs/context-menu-tariffs.component';
import { ViewDutyTaxTypesComponent } from './views/main/view-tariffs-list/view-duty-tax-types/view-duty-tax-types.component';
import { AttachmentDialogComponent } from './layouts/capture-layout/attachment-dialog/attachment-dialog.component';
import { PDFViewerComponent } from './components/pdfviewer/pdfviewer.component';
import { EventService } from './services/event.service';
import { PreviewReportComponent } from './components/preview-report/preview-report.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { ViewCaptureLandingComponent } from './views/main/view-capture-landing/view-capture-landing.component';
import { SplitDocumentComponent } from './components/split-document/split-document.component';
import { ViewCheckingScreenComponent } from './views/main/view-checking-screen/view-checking-screen.component';
import { CheckListRequest } from './models/HttpRequests/CheckListRequest';
import { CheckListService } from './services/CheckList.Service';
import { FormCustomWorksheetComponent } from './components/forms/capture/form-custom-worksheet/form-custom-worksheet.component';
// tslint:disable-next-line: max-line-length
import { FormCustomWorksheetLinesComponent } from './components/forms/capture/form-custom-worksheet/form-custom-worksheet-lines/form-custom-worksheet-lines.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuCompanyContactsComponent } from './components/menus/context-menu-company-contacts/context-menu-company-contacts.component';
import { ChannelService } from './modules/chat/services/channel.service';
import { EscalateDialogComponent } from './layouts/capture-layout/escalate-dialog/escalate-dialog.component';
import { EscalateBottomSheetComponent } from './layouts/capture-layout/escalate-bottom-sheet/escalate-bottom-sheet.component';
import { DutyAssignDialogComponent } from './components/forms/capture/form-sad500/form-sad500-line/duty-assign-dialog/duty-assign-dialog.component';
import { FormVocLineComponent } from './components/forms/capture/form-voc/form-voc-line/form-voc-line.component';
import { ViewCaptureQueueOverviewComponent } from './views/main/view-capture-queue-overview/view-capture-queue-overview.component';
import { ContextMenuCaptureQueueComponent } from './components/menus/context-menu-capture-queue/context-menu-capture-queue.component';
import { ViewCompanyServiceClaimDataComponent } from './views/main/view-company-service-claims/view-company-service-claim-data/view-company-service-claim-data.component';
import { ErrorInterceptor } from './helpers/error.helper';
import { UploadProdatComponent } from './views/main/view-tariffs-list/upload-prodat/upload-prodat.component';
import { PreviewReportsComponent } from './views/reports/preview-reports/preview-reports.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ViewCompanyOemListComponent } from './views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';
import { ViewOemQuarterListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-oem-quarter-list.component';
import { ViewQuarterSupplyListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-quarter-supply-list/view-quarter-supply-list.component';
import { FormOemQuarterSupplyComponent } from './components/forms/company-oem/form-oem-quarter-supply/form-oem-quarter-supply.component';
import { CompanyOemContextMenuComponent } from './components/menus/company-oem-context-menu/company-oem-context-menu.component';
import { OemQuartersContextMenuComponent } from './components/menus/oem-quarters-context-menu/oem-quarters-context-menu.component';
import { QuartersSupplyContextMenuComponent } from './components/menus/quarters-supply-context-menu/quarters-supply-context-menu.component';
import { NestedTableComponent } from './components/nested-table/nested-table.component';
import { ClaimLayoutComponent } from './layouts/claim-layout/claim-layout.component';
import { ClickStopPropagation } from './directives/event-propagation.directive';
import { StorageService } from './services/storage.service';
import { RightGuard } from './guards/right.guard';
import { RedirectComponent } from './views/main/redirect/redirect.component';
import { ViewTransactionCheckingComponent } from './views/main/view-transaction-checking/view-transaction-checking.component';
import { DialogEscalationReasonComponent } from './views/main/view-transaction-files/dialog-escalation-reason/dialog-escalation-reason.component';

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
    ClickStopPropagation,
    ContextMenuAddressTypesComponent,
    ViewCaptureInfoComponent,
    ContextMenuCaptureInfoComponent,
    MenuComponent,
    TableComponent,
    AttachmentCaptureStatusBlockComponent,
    PaginationComponent,
    TableHeaderComponent,
    ContextMenuServiceListComponent,
    ChatOverlayComponent,
    ChatUserTileComponent,
    ChatBubbleComponent,
    ContextCompanyServiceListComponent,
    ContextTariffsListComponent,
    ContextItemsListComponent,
    ContextCompanyItemsListComponent,
    ViewItemTypesListComponent,
    FormImportClearingInstructionComponent,
    FormSAD500Component,
    ChatConversationListComponent,
    ChatContactListComponent,
    ChatConversationTileComponent,
    ContextMenuCompanyAddressComponent,
    ContextMenuCompanyServiceComponent,
    ViewContactTypesListComponent,
    ContextMenuContactTypesComponent,
    ViewCompanyAddInfoTypesListComponent,
    ContextMenuCompanyAddInfoTypesComponent,
    ContextMenuCurrenciesComponent,
    ViewCurrenciesListComponent,
    ContextMenuCompanyItemsComponent,
    ViewAlternateItemsComponent,
    CapturePreviewComponent,
    Sad500LinesComponent,
    FormSAD500LineComponent,
    Sad500LinePreviewComponent,
    FocusDirective,
    FormInvoiceComponent,
    FormVOCComponent,
    ContextMenuSADLinesComponent,
    ContextMenuItemsGroupComponent,
    ViewImportClearingInstructionsComponent,
    ViewCustomReleaseNotificationsComponent,
    ViewSAD500Component,
    ViewItemValuesComponent,
    ContextMenuItemsValuesComponent,
    ContextMenuItemsComponent,
    ContextICIComponent,
    ContextSAD500Component,
    ImagePreviewDialogComponent,
    ViewInvoicesComponent,
    CaptureFormDirective,
    ViewItemParentsComponent,
    ContextMenuItemsParentsComponent,
    ViewCompanyBOMsComponent,
    ViewBOMLinesComponent,
    ContextMenuBomsComponent,
    ViewPermitsListComponent,
    ViewPermitIMportTariffsListComponent,
    ContextMenuPermitsComponent,
    ViewReportQueuesListComponent,
    ViewCompanyServiceClaimsComponent,
    ContextMenuServiceClaimsComponent,
    ContextMenuTariffsComponent,
    ViewDutyTaxTypesComponent,
    AttachmentDialogComponent,
    PDFViewerComponent,
    FormInvoiceLinesComponent,
    QuitDialogComponent,
    SubmitDialogComponent,
    FormWaybillComponent,
    ViewCompanyServiceclaimReportComponent,
    ContextMenuCompanyServiceclaimReportComponent,
    PreviewReportComponent,
    ContextMenuCompanyContactsComponent,
    ChatConversationComponent,
    ViewCheckingScreenComponent,
    FormCustomWorksheetComponent,
    FormCustomWorksheetLinesComponent,
    SplitDocumentComponent,
    ViewCaptureLandingComponent,
    EscalateDialogComponent,
    EscalateBottomSheetComponent,
    DutyAssignDialogComponent,
    FormVocLineComponent,
    ViewCaptureQueueOverviewComponent,
    ContextMenuCaptureQueueComponent,
    ViewCompanyServiceClaimDataComponent,
    UploadProdatComponent,
    PreviewReportsComponent,
    ViewCompanyOemListComponent,
    ViewOemQuarterListComponent,
    ViewQuarterSupplyListComponent,
    FormOemQuarterSupplyComponent,
    CompanyOemContextMenuComponent,
    OemQuartersContextMenuComponent,
    QuartersSupplyContextMenuComponent,
    NestedTableComponent,
    ClaimLayoutComponent,
    RedirectComponent,
    ViewTransactionCheckingComponent,
    DialogEscalationReasonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgxCurrencyModule,
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
    MaterialModule,
    AngularDraggableModule,
    KeyboardShortcutsModule,
    FormsModule,
    NgxDocViewerModule,
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
    ContactTypesService,
    CompanyAddInfoTypesService,
    ApiService,
    CurrenciesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true

    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    ChatService,
    CaptureService,
    ValidateService,
    ComponentService,
    TariffService,
    ReportsService,
    EventService,
    CheckListService,
    ChannelService,
    StorageService,
    RightGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NgbdModalContent,
    CapturePreviewComponent,
    Sad500LinePreviewComponent,
    ImagePreviewDialogComponent,
    FormSAD500Component,
    FormImportClearingInstructionComponent,
    FormCustomReleaseComponent,
    AttachmentDialogComponent,
    PreviewReportComponent,
    FormInvoiceComponent,
    QuitDialogComponent,
    SubmitDialogComponent,
    FormVOCComponent,
    FormWaybillComponent,
    FormCustomWorksheetComponent,
    SplitDocumentComponent,
    EscalateDialogComponent,
    EscalateBottomSheetComponent,
    DutyAssignDialogComponent,
    UploadProdatComponent,
    DialogEscalationReasonComponent
  ]
})
export class AppModule { }
