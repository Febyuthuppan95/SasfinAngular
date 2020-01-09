import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.Service';
import { UserService } from 'src/app/services/user.Service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Outcome } from 'src/app/models/HttpResponses/Outcome';
import { CaptureService } from 'src/app/services/capture.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICIListResponse } from 'src/app/models/HttpResponses/ICI';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material';
import { SubmitDialogComponent } from 'src/app/layouts/capture-layout/submit-dialog/submit-dialog.component';
import { WaybillListResponse } from 'src/app/models/HttpResponses/Waybill';

@Component({
  selector: 'app-form-waybill',
  templateUrl: './form-waybill.component.html',
  styleUrls: ['./form-waybill.component.scss']
})
export class FormWaybillComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private themeService: ThemeService, private userService: UserService, private transactionService: TransactionService,
              private router: Router, private captureService: CaptureService, private eventService: EventService, private dialog: MatDialog) { }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  private unsubscribe$ = new Subject<void>();
  shortcuts: ShortcutInput[] = [];

  currentUser = this.userService.getCurrentUser();
  attachmentID: number;
  transactionID: number;

  currentTheme: string;
    form = {
      waybillNo: {
        value: null,
        error: null
      },
  };
  dialogOpen = false;

  ngOnInit() {
    this.themeService.observeTheme()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => this.currentTheme = value);

    this.eventService.observeCaptureEvent()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => this.submit());

    this.transactionService.observerCurrentAttachment()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((curr: { transactionID: number, attachmentID: number }) => {
      if (curr !== null || curr !== undefined) {
        this.attachmentID = curr.attachmentID;
        this.transactionID = curr.transactionID;
        this.loadData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
        {
            key: 'alt + s',
            preventDefault: true,
            allowIn: [AllowIn.Textarea, AllowIn.Input],
            command: e => this.submit()
        },
    );
  }

  submit() {
    if (!this.dialogOpen) {
      this.dialogOpen = true;

      this.dialog.open(SubmitDialogComponent).afterClosed().subscribe((status: boolean) => {
        this.dialogOpen = false;

        if (status) {
          const requestModel = {
            userID: this.currentUser.userID,
            waybillID: this.attachmentID,
            waybillNo: this.form.waybillNo.value,
            isDeleted: 0,
            attachmentStatus: 2,
          };

          this.captureService.waybillUpdate(requestModel).then(
            (res: Outcome) => {
              if (res.outcome === 'SUCCESS') {
              this.notify.successmsg(res.outcome, res.outcomeMessage);
              this.router.navigate(['transaction/capturerlanding']);
            } else {
              this.notify.errorsmsg(res.outcome, res.outcomeMessage);
              }
            },
              (msg) => {
              this.notify.errorsmsg('Failure', 'Cannot reach server');
              }
            );
        }
      });
    }
  }

  loadData() {
    this.captureService.waybillList(
      {
        userID: this.currentUser.userID,
        waybillID: this.attachmentID,
        transactionID: this.transactionID,
        rowStart: 1,
        rowEnd: 15,
        orderBy: '',
        orderDirection: 'DESC',
        filter: ''

      }).then(
      (res: WaybillListResponse) => {
        this.form.waybillNo.value = res.waybills[0].waybillNo;
        this.form.waybillNo.error = res.waybills[0].waybillError;
      },
      (msg) => {
        console.log(msg);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
