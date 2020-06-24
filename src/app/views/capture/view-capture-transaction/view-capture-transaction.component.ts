import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { ComponentService } from 'src/app/services/ComponentLoader.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormInvoiceComponent } from 'src/app/components/forms/capture/form-invoice/form-invoice.component';
import { FormCustomWorksheetComponent } from 'src/app/components/forms/capture/form-custom-worksheet/form-custom-worksheet.component';
import { FormIciComponent } from 'src/app/components/forms/capture/updates/form-ici/form-ici.component';
import { FormCrnComponent } from 'src/app/components/forms/capture/updates/form-crn/form-crn.component';
import { FormWayComponent } from 'src/app/components/forms/capture/updates/form-way/form-way.component';
import { FormInvComponent } from 'src/app/components/forms/capture/updates/form-inv/form-inv.component';
import { FormSad500UpdatedComponent } from 'src/app/components/forms/capture/updates/form-sad/form-sad500-updated.component';
import { FormCswComponent } from 'src/app/components/forms/capture/updates/form-csw/form-csw.component';


@Component({
  selector: 'app-view-capture-transaction',
  templateUrl: './view-capture-transaction.component.html',
  styleUrls: ['./view-capture-transaction.component.scss']
})
export class ViewCaptureTransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('captureForm', { read: ViewContainerRef, static: false })
  captureForm: ViewContainerRef;

  constructor(private themeService: ThemeService,
              private transactionService: TransactionService,
              private componentService: ComponentService) { }

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
    });
  }

  ngAfterViewInit(): void {
    this.componentService.setContainer(this.captureForm);
    this.loadComponent();
  }

  loadComponent() {
    switch (this.currentDoctype.toLocaleUpperCase()) {
      case 'SAD': {
        this.componentService.renderComponent(FormSad500UpdatedComponent);
        break;
      }
      case 'CRN' : {
        this.componentService.renderComponent(FormCrnComponent);
        break;
      }
      case 'CWS' : {
        this.componentService.renderComponent(FormCswComponent);
        // this.componentService.renderComponent(FormCustomWorksheetComponent);
        break;
      }
      case 'ICI': {
        this.componentService.renderComponent(FormIciComponent);
        break;
      }
      case 'ECI': {
        this.componentService.renderComponent(FormIciComponent);
        break;
      }
      case 'INV': {
        this.componentService.renderComponent(FormInvComponent);
        // this.componentService.renderComponent(FormInvoiceComponent);
        break;
      }
      case 'VOC': {
        this.componentService.renderComponent(FormSad500UpdatedComponent);
        break;
      }
      case 'WAY': {
        this.componentService.renderComponent(FormWayComponent);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
