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
import {
  ImageModalComponent,
  NgbdModalContent,
} from './components/image-modal/image-modal.component';
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
import { Sad500LinePreviewComponent } from './components/dialogs/sad500-line-preview/sad500-line-preview.component';
import { FocusDirective } from './directives/focus.directive';
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
import { ViewBOMLinesComponent } from './views/main/view-company-boms/view-bom-lines/view-bom-lines.component';
import { ContextMenuBomsComponent } from './components/menus/context-menu-boms/context-menu-boms.component';
import { ViewPermitsListComponent } from './views/main/view-permits-list/view-permits-list.component';
// tslint:disable-next-line: max-line-length
import { ViewPermitIMportTariffsListComponent } from './views/main/view-permit-import-tariffs-list/view-permit-import-tariffs-list.component';
import { ContextMenuPermitsComponent } from './components/menus/context-menu-permits/context-menu-permits.component';
import { ViewReportQueuesListComponent } from './views/main/view-reportQueues-list/view-reportQueues-list.component';
import { ReportsService } from './services/Reports.Service';
import { QuitDialogComponent } from './layouts/capture-layout/quit-dialog/quit-dialog.component';
import { SubmitDialogComponent } from './layouts/capture-layout/submit-dialog/submit-dialog.component';
import { ViewCompanyServiceClaimsComponent } from './views/main/view-company-service-claims/view-company-service-claims.component';
import { ContextMenuServiceClaimsComponent } from './components/menus/context-menu-service-claims/context-menu-service-claims.component';
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
// tslint:disable-next-line: max-line-length
import { ContextMenuCompanyContactsComponent } from './components/menus/context-menu-company-contacts/context-menu-company-contacts.component';
import { ChannelService } from './modules/chat/services/channel.service';
import { EscalateDialogComponent } from './layouts/capture-layout/escalate-dialog/escalate-dialog.component';
import { EscalateBottomSheetComponent } from './layouts/capture-layout/escalate-bottom-sheet/escalate-bottom-sheet.component';
// tslint:disable-next-line: max-line-length
import { ViewCaptureQueueOverviewComponent } from './views/main/view-capture-queue-overview/view-capture-queue-overview.component';
import { ContextMenuCaptureQueueComponent } from './components/menus/context-menu-capture-queue/context-menu-capture-queue.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyServiceClaimDataComponent } from './views/main/view-company-service-claims/view-company-service-claim-data/view-company-service-claim-data.component';
import { ErrorInterceptor } from './helpers/error.helper';
import { UploadProdatComponent } from './views/main/view-tariffs-list/upload-prodat/upload-prodat.component';
import { PreviewReportsComponent } from './views/reports/preview-reports/preview-reports.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ViewCompanyOemListComponent } from './views/main/view-company-list/view-company-oem-list/view-company-oem-list.component';
// tslint:disable-next-line: max-line-length
import { ViewOemQuarterListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-oem-quarter-list.component';
// tslint:disable-next-line: max-line-length
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
// tslint:disable-next-line: max-line-length
import { DialogEscalationReasonComponent } from './views/main/view-transaction-files/dialog-escalation-reason/dialog-escalation-reason.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyBomsItemsListComponent } from './views/main/view-company-boms/view-company-boms-items-list/view-company-boms-items-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyBomsItemgroupsListComponent } from './views/main/view-company-boms/view-company-boms-itemgroups-list/view-company-boms-itemgroups-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyBomsItemsErrorsListComponent } from './views/main/view-company-boms/view-company-boms-items-list/view-company-boms-items-errors-list/view-company-boms-items-errors-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyBomsItemgroupsErrorsListComponent } from './views/main/view-company-boms/view-company-boms-itemgroups-list/view-company-boms-itemgroups-errors-list/view-company-boms-itemgroups-errors-list.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyBomsLinesErrorListComponent } from './views/main/view-company-boms/view-company-boms-lines-error-list/view-company-boms-lines-error-list.component';
import { AutocompleteCPCComponent } from './components/forms/capture/autocompletes/autocomplete-cpc/autocomplete-cpc.component';
import { AutocompleteCooComponent } from './components/forms/capture/autocompletes/autocomplete-coo/autocomplete-coo.component';
import { AutocompleteTariffsComponent } from './components/forms/capture/autocompletes/autocomplete-tariffs/autocomplete-tariffs.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteUnitsOfMeasureComponent } from './components/forms/capture/autocompletes/autocomplete-units-of-measure/autocomplete-units-of-measure.component';
import { AutocompleteDutyComponent } from './components/forms/capture/autocompletes/autocomplete-duty/autocomplete-duty.component';
import { DialogOverrideComponent } from './components/forms/capture/dialog-override/dialog-override.component';
import { DialogGuard } from './guards/dialog.guard';
import { FormIciComponent } from './components/forms/capture/updates/form-ici/form-ici.component';
import { FormCrnComponent } from './components/forms/capture/updates/form-crn/form-crn.component';
import { FormWayComponent } from './components/forms/capture/updates/form-way/form-way.component';
import { FormCswComponent } from './components/forms/capture/updates/form-csw/form-csw.component';
import { FormInvComponent } from './components/forms/capture/updates/form-inv/form-inv.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteEdiStatusesComponent } from './components/forms/capture/autocompletes/autocomplete-edi-statuses/autocomplete-edi-statuses.component';
import { FormInvLinesComponent } from './components/forms/capture/updates/form-inv/form-inv-lines/form-inv-lines.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteCurrencyComponent } from './components/forms/capture/autocompletes/autocomplete-currency/autocomplete-currency.component';
import { AutocompleteIncoComponent } from './components/forms/capture/autocompletes/autocomplete-inco/autocomplete-inco.component';
import { AutocompleteItemsComponent } from './components/forms/capture/autocompletes/autocomplete-items/autocomplete-items.component';
import { FormSad500UpdatedComponent } from './components/forms/capture/updates/form-sad/form-sad500-updated.component';
// tslint:disable-next-line: max-line-length
import { FormSad500LineUpdatedComponent } from './components/forms/capture/updates/form-sad/form-sad500-line-updated/form-sad500-line-updated.component';
import { FormCswLinesComponent } from './components/forms/capture/updates/form-csw/form-csw-lines/form-csw-lines.component';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
// tslint:disable-next-line: max-line-length
import { ViewCompanySupplierListComponent } from './views/main/view-company-list/view-company-supplier-list/view-company-supplier-list.component';
// tslint:disable-next-line: max-line-length
import { CompanySupplierContextMenuComponent } from './components/menus/company-supplier-context-menu/company-supplier-context-menu.component';
// tslint:disable-next-line: max-line-length
import { ViewQuarterReceiptTransactionsComponent } from './views/main/view-company-list/view-company-supplier-list/view-quarter-receipt-transactions/view-quarter-receipt-transactions.component';
import { SpinningLoaderComponent } from './components/spinning-loader/spinning-loader.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuQuarterTransactionsComponent } from './components/menus/context-menu-quarter-transactions/context-menu-quarter-transactions.component';
import { FormC1Component } from './components/forms/capture/updates/form-c1/form-c1.component';
import { FormSmdComponent } from './components/forms/capture/updates/form-smd/form-smd.component';
import { FormC1LinesComponent } from './components/forms/capture/updates/form-c1/form-c1-lines/form-c1-lines.component';
import { FormSmdLinesComponent } from './components/forms/capture/updates/form-smd/form-smd-lines/form-smd-lines.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteCompaniesComponent } from './components/forms/capture/autocompletes/autocomplete-companies/autocomplete-companies.component';
// tslint:disable-next-line: max-line-length
import { DialogCreateItemsComponent } from './components/forms/capture/autocompletes/autocomplete-items/dialog-create-items/dialog-create-items.component';
// tslint:disable-next-line: max-line-length
import { ViewC1AttachmentsComponent } from './views/main/view-company-list/view-company-supplier-list/view-quarter-receipt-transactions/view-c1-attachments/view-c1-attachments.component';
// tslint:disable-next-line: max-line-length
import { ViewSmdAttachmentsComponent } from './views/main/view-company-list/view-company-supplier-list/view-quarter-receipt-transactions/view-smd-attachments/view-smd-attachments.component';
// tslint:disable-next-line: max-line-length
import { ContextMenuLocalAttachmentsComponent } from './components/menus/context-menu-local-attachments/context-menu-local-attachments.component';
import { AutocompleteQuarterComponent } from './components/forms/capture/autocompletes/autocomplete-quarter/autocomplete-quarter.component';
import { TabDirective } from './directives/tab.directive';
// tslint:disable-next-line: max-line-length
import { BottomSheetAssignDutyComponent } from './components/forms/capture/autocompletes/autocomplete-duty/bottom-sheet-assign-duty/bottom-sheet-assign-duty.component';
import { DocumentWindowPreviewComponent } from './components/document-window-preview/document-window-preview.component';
import { ContextMenuPermitTypesComponent } from './components/menus/context-menu-permit-types/context-menu-permit-types.component';
// tslint:disable-next-line: max-line-length
import { ViewCompanyPermitsListComponent } from './views/main/view-permits-list/view-company-permits-list/view-company-permits-list.component';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { EscalationQueueComponent } from './views/main/escalation-queue/escalation-queue.component';
import { MenuEscalationsComponent } from './views/main/escalation-queue/menu-escalations/menu-escalations.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { CaptureErrorsComponent } from './views/capture/capture-errors/capture-errors.component';
import { DateService } from './services/tools/date.service';
import { DatePipe } from '@angular/common';
import {NgxMaskModule} from 'ngx-mask';
import { CreateHelpComponent } from './views/main/view-help-glossary/create-help/create-help.component';
import { DeletelineDialogComponent } from './layouts/capture-layout/deleteline-dialog/deleteline-dialog.component';
import { HelpDirective } from './directives/help.directive';
import { DialogGotoLineComponent } from './components/forms/capture/dialog-goto-line/dialog-goto-line.component';
import { LinkingLinesComponent } from './views/main/view-transaction-files/linking-lines/linking-lines.component';
import { CheckingQueueComponent } from './views/main/checking-queue/checking-queue.component';
import { InvoiceLineLinkComponent } from './views/main/view-transaction-files/linking-lines/invoice-line-link/invoice-line-link.component';
import { CustomsLineLinkComponent } from './views/main/view-transaction-files/linking-lines/customs-line-link/customs-line-link.component';
import { MenuLinkingComponent } from './views/main/checking-queue/menu-linking/menu-linking.component';
import { DialogConfirmationComponent } from './views/main/view-transaction-files/linking-lines/dialog-confirmation/dialog-confirmation.component';
import { DialogReturnAttachmentComponent } from './views/main/view-transaction-files/linking-lines/dialog-return-attachment/dialog-return-attachment.component';
import { DialogRemoveAttachmentComponent } from './components/menus/context-menu-transaction-attachment/dialog-remove-attachment/dialog-remove-attachment.component';
import { DialogTransactionDeleteComponent } from './views/main/view-transactions/dialog-transaction-delete/dialog-transaction-delete.component';
import { ExchangeRateUploadComponent } from './views/main/exchange-rate-upload/exchange-rate-upload.component';
import { ContextMenuRoeComponent } from './components/menus/context-menu-roe/context-menu-roe.component';
import { ExchangeRateLinesComponent } from './views/main/exchange-rate-upload/exchange-rate-lines/exchange-rate-lines.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AddCompanyPermitComponent } from './views/main/view-permits-list/view-company-permits-list/add-company-permit/add-company-permit.component';
import { RemovePermitsDialogComponent } from './views/main/view-permits-list/view-company-permits-list/remove-permits-dialog/remove-permits-dialog.component';
import { EditPermitDialogComponent } from './views/main/view-permits-list/view-company-permits-list/edit-permit-dialog/edit-permit-dialog.component';
import { PermitTariffInfoComponent } from './views/main/view-permits-list/view-company-permits-list/add-company-permit/permit-tariff-info/permit-tariff-info.component';
import { ViewQuarterSalesListComponent } from './views/main/view-company-list/view-company-oem-list/view-oem-quarter-list/view-quarter-sales-list/view-quarter-sales-list.component';

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
    KeyHandlerDirective,
    ImageDirective,
    TabDirective,
    HelpDirective,
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
    Sad500LinePreviewComponent,
    FocusDirective,
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
    QuitDialogComponent,
    SubmitDialogComponent,
    ViewCompanyServiceclaimReportComponent,
    ContextMenuCompanyServiceclaimReportComponent,
    PreviewReportComponent,
    ContextMenuCompanyContactsComponent,
    ChatConversationComponent,
    ViewCheckingScreenComponent,
    SplitDocumentComponent,
    ViewCaptureLandingComponent,
    EscalateDialogComponent,
    EscalateBottomSheetComponent,
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
    DialogEscalationReasonComponent,
    ViewCompanyBomsItemsListComponent,
    ViewCompanyBomsItemgroupsListComponent,
    ViewCompanyBomsItemsErrorsListComponent,
    ViewCompanyBomsItemgroupsErrorsListComponent,
    ViewCompanyBomsLinesErrorListComponent,
    FormSad500UpdatedComponent,
    AutocompleteCPCComponent,
    AutocompleteCooComponent,
    FormSad500LineUpdatedComponent,
    AutocompleteTariffsComponent,
    AutocompleteUnitsOfMeasureComponent,
    AutocompleteDutyComponent,
    DialogOverrideComponent,
    FormIciComponent,
    FormCrnComponent,
    FormWayComponent,
    FormCswComponent,
    FormInvComponent,
    AutocompleteEdiStatusesComponent,
    FormInvLinesComponent,
    AutocompleteCurrencyComponent,
    AutocompleteIncoComponent,
    AutocompleteItemsComponent,
    FormCswLinesComponent,
    ViewCompanySupplierListComponent,
    CompanySupplierContextMenuComponent,
    ViewQuarterReceiptTransactionsComponent,
    SpinningLoaderComponent,
    ContextMenuQuarterTransactionsComponent,
    FormC1Component,
    FormSmdComponent,
    FormC1LinesComponent,
    FormSmdLinesComponent,
    AutocompleteCompaniesComponent,
    DialogCreateItemsComponent,
    ViewC1AttachmentsComponent,
    ViewSmdAttachmentsComponent,
    ContextMenuLocalAttachmentsComponent,
    AutocompleteQuarterComponent,
    BottomSheetAssignDutyComponent,
    DocumentWindowPreviewComponent,
    ContextMenuPermitTypesComponent,
    ViewCompanyPermitsListComponent,
    EscalationQueueComponent,
    MenuEscalationsComponent,
    CaptureErrorsComponent,
    CreateHelpComponent,
    DeletelineDialogComponent,
    DialogGotoLineComponent,
    LinkingLinesComponent,
    CheckingQueueComponent,
    InvoiceLineLinkComponent,
    CustomsLineLinkComponent,
    MenuLinkingComponent,
    DialogConfirmationComponent,
    DialogReturnAttachmentComponent,
    DialogRemoveAttachmentComponent,
    DialogTransactionDeleteComponent,
    ExchangeRateUploadComponent,
    ContextMenuRoeComponent,
    ExchangeRateLinesComponent,
    AddCompanyPermitComponent,
    RemovePermitsDialogComponent,
    EditPermitDialogComponent,
    PermitTariffInfoComponent,
    ViewQuarterSalesListComponent
  ],
  imports: [
    TextMaskModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgxCurrencyModule,
    UserIdleModule.forRoot({ idle: 900, timeout: 12, ping: 5 }),
    ToastrModule.forRoot({
      closeButton: false,
      progressBar: true,
      positionClass: 'toast-top-full-width',
      timeOut: 3000,
    }),
    NgbModule,
    NgxPaginationModule,
    MaterialModule,
    AngularDraggableModule,
    KeyboardShortcutsModule,
    FormsModule,
    NgxDocViewerModule,
    FirebaseModule,
    PdfJsViewerModule,
    NgxMaskModule.forRoot(),

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
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
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
    RightGuard,
    DialogGuard,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false },
    },
    DateService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NgbdModalContent,
    CapturePreviewComponent,
    Sad500LinePreviewComponent,
    ImagePreviewDialogComponent,
    AttachmentDialogComponent,
    PreviewReportComponent,
    QuitDialogComponent,
    SubmitDialogComponent,
    SplitDocumentComponent,
    EscalateDialogComponent,
    EscalateBottomSheetComponent,
    UploadProdatComponent,
    DialogEscalationReasonComponent,
    FormSad500UpdatedComponent,
    DialogOverrideComponent,
    FormIciComponent,
    FormCrnComponent,
    FormWayComponent,
    FormCswComponent,
    FormInvComponent,
    EscalateBottomSheetComponent,
    FormC1Component,
    FormSmdComponent,
    DialogCreateItemsComponent,
    BottomSheetAssignDutyComponent,
    CreateHelpComponent,
    DeletelineDialogComponent,
    DialogGotoLineComponent,
    InvoiceLineLinkComponent,
    CustomsLineLinkComponent,
    DialogConfirmationComponent,
    DialogReturnAttachmentComponent,
    DialogRemoveAttachmentComponent,
    DialogTransactionDeleteComponent,
    AddCompanyPermitComponent,
    RemovePermitsDialogComponent,
    EditPermitDialogComponent,
    PermitTariffInfoComponent
  ],
})
export class AppModule {}
