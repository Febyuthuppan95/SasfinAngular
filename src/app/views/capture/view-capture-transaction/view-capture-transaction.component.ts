import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy, ComponentRef } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { ComponentService } from 'src/app/services/ComponentLoader.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormIciComponent } from 'src/app/components/forms/capture/updates/form-ici/form-ici.component';
import { FormCrnComponent } from 'src/app/components/forms/capture/updates/form-crn/form-crn.component';
import { FormWayComponent } from 'src/app/components/forms/capture/updates/form-way/form-way.component';
import { FormInvComponent } from 'src/app/components/forms/capture/updates/form-inv/form-inv.component';
import { FormSad500UpdatedComponent } from 'src/app/components/forms/capture/updates/form-sad/form-sad500-updated.component';
import { FormCswComponent } from 'src/app/components/forms/capture/updates/form-csw/form-csw.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EventService } from 'src/app/services/event.service';
import { FormC1Component } from 'src/app/components/forms/capture/updates/form-c1/form-c1.component';
import { FormSmdComponent } from 'src/app/components/forms/capture/updates/form-smd/form-smd.component';

@AutoUnsubscribe()
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
              private componentService: ComponentService,
              private eventService: EventService) { }

  currentTheme: string;
  currentDoctype: string;
  captureFormComponent: any = null;
  capture: any;
  componentRef: ComponentRef<any>;

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    // Testing
    // this.transactionService.setCurrentAttachment({
    //   transactionID: 2211,
    //   attachmentID: 14,
    //   docType: 'SC1', transactionType: 'Import', transactionName: 'Test'
    // });

    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.currentDoctype = data.docType;
      this.capture = data;
    });

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: { escalation?: boolean; saveProgress?: boolean; escalationResolved?: boolean}) =>
    this.submitComponent(data.escalation, data.saveProgress, data.escalationResolved));
  }

  ngAfterViewInit(): void {
    this.componentService.setContainer(this.captureForm);
    this.loadComponent();
  }

  submitComponent(escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) {
    this.componentRef.instance.submissionEvent(escalation, saveProgress, escalationResolved);
  }

  loadComponent() {
    this.captureForm.clear();

    switch (this.currentDoctype.toLocaleUpperCase()) {
      case 'SAD': {
        this.componentRef = this.componentService.generateComponent(FormSad500UpdatedComponent) as ComponentRef<FormSad500UpdatedComponent>;
        break;
      }
      case 'CRN' : {
        this.componentRef = this.componentService.generateComponent(FormCrnComponent) as ComponentRef<FormCrnComponent>;
        break;
      }
      case 'CWS' : {
        this.componentRef = this.componentService.generateComponent(FormCswComponent) as ComponentRef<FormCswComponent>;
        break;
      }
      case 'ICI': {
        this.componentRef = this.componentService.generateComponent(FormIciComponent) as ComponentRef<FormIciComponent>;
        break;
      }
      case 'ECI': {
        this.componentRef = this.componentService.generateComponent(FormIciComponent) as ComponentRef<FormIciComponent>;
        break;
      }
      case 'INV': {
        this.componentRef = this.componentService.generateComponent(FormInvComponent) as ComponentRef<FormInvComponent>;
        break;
      }
      case 'VOC': {
        this.componentRef = this.componentService.generateComponent(FormSad500UpdatedComponent) as ComponentRef<FormSad500UpdatedComponent>;
        break;
      }
      case 'WAY': {
        this.componentRef = this.componentService.generateComponent(FormWayComponent) as ComponentRef<FormWayComponent>;
        break;
      }
      case 'SC1': {
        this.componentRef = this.componentService.generateComponent(FormC1Component) as ComponentRef<FormC1Component>;
        break;
      }
      case 'SMD': {
        this.componentRef = this.componentService.generateComponent(FormSmdComponent) as ComponentRef<FormSmdComponent>;
        break;
      }
    }

    this.componentRef.instance.capture = this.capture;
    this.componentRef.instance.init();
    this.componentService.renderComponent(this.componentRef);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.captureForm.remove();
    this.componentService.destroyComponent();
  }

}
