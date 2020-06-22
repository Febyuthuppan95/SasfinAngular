import { Component, OnInit, ViewChild, ComponentFactoryResolver, Inject, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { FormSAD500Component } from 'src/app/components/forms/capture/form-sad500/form-sad500.component';
import { ComponentService } from 'src/app/services/ComponentLoader.service';
import { FormCustomReleaseComponent } from 'src/app/components/forms/capture/form-custom-release/form-custom-release.component';
// tslint:disable-next-line: max-line-length
import { FormImportClearingInstructionComponent } from 'src/app/components/forms/capture/form-import-clearing-instruction/form-import-clearing-instruction.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormInvoiceComponent } from 'src/app/components/forms/capture/form-invoice/form-invoice.component';
import { FormWaybillComponent } from 'src/app/components/forms/capture/form-waybill/form-waybill.component';
import { FormVOCComponent } from 'src/app/components/forms/capture/form-voc/form-voc.component';
import { FormCustomWorksheetComponent } from 'src/app/components/forms/capture/form-custom-worksheet/form-custom-worksheet.component';
import { ChatOverlayComponent } from 'src/app/modules/chat/components/chat-overlay/chat-overlay.component';
import { FormSad500UpdatedComponent } from 'src/app/components/forms/capture/form-sad500-updated/form-sad500-updated.component';


@Component({
  selector: 'app-view-capture-transaction',
  templateUrl: './view-capture-transaction.component.html',
  styleUrls: ['./view-capture-transaction.component.scss']
})
export class ViewCaptureTransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('captureForm', { read: ViewContainerRef, static: false })
  captureForm: ViewContainerRef;

  // tslint:disable-next-line: max-line-length
  constructor(private themeService: ThemeService, private transactionService: TransactionService, private componentService: ComponentService) { }

  currentTheme: string;
  currentDoctype: string;
  captureFormComponent: any = null;

  private unsubscribe$ = new Subject<void>();


  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.currentDoctype = data.docType;
      console.log(this.currentDoctype);
    });
  }

  ngAfterViewInit(): void {
    this.componentService.setContainer(this.captureForm);
    this.loadComponent();
  }

  loadComponent() {
    console.log(this.currentDoctype);
    switch (this.currentDoctype.toLocaleUpperCase()) {
      case 'SAD': {
        this.componentService.renderComponent(FormSAD500Component);
        // this.componentService.renderComponent(FormSad500UpdatedComponent);
        break;
      }
      case 'CRN' : {
        this.componentService.renderComponent(FormCustomReleaseComponent);
        break;
      }
      case 'CWS' : {
        this.componentService.renderComponent(FormCustomWorksheetComponent);
        break;
      }
      case 'ICI': {
        this.componentService.renderComponent(FormImportClearingInstructionComponent);
        break;
      }
      case 'ECI': {
        this.componentService.renderComponent(FormImportClearingInstructionComponent);
        break;
      }
      // case 'IMPORT CLEARING INSTRUCTION': {
      //   this.componentService.renderComponent(FormImportClearingInstructionComponent);
      //   break;
      // }
      case 'INV': {
        this.componentService.renderComponent(FormInvoiceComponent);
        break;
      }
      case 'VOC': {
        this.componentService.renderComponent(FormSAD500Component);
        // this.componentService.renderComponent(FormSad500UpdatedComponent);
        break;
      }
      case 'WAY': {
        this.componentService.renderComponent(FormWaybillComponent);
        break;
      }
      // case 'CUSWORK': {
      //   this.componentService.renderComponent(FormCustomWorksheetComponent);
      //   break;
      // }
      // case 'CUSTOMS WORKSHEET': {
      //   this.componentService.renderComponent(FormCustomWorksheetComponent);
      //   break;
      // }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
