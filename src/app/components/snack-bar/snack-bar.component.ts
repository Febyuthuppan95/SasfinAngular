import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { UpdateObjectHelpRequest } from 'src/app/models/HttpRequests/UpdateObjectHelpRequest';
import { UpdateObjectHelpResponse } from 'src/app/models/HttpResponses/UpdateObjectHelpResponse';
import { GetObjectHelpRequest } from 'src/app/models/HttpRequests/GetObjectHelpRequest';
import {GetObjectHelpResponse, GetObjectHelpListResponse} from 'src/app/models/HttpResponses/GetObjectHelpResponse';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {log} from 'util';


@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit, OnDestroy {
  constructor(
    private helpSnackbarService: HelpSnackbar,
    private objectHelpService: ObjectHelpService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
   this.settings = new SnackbarModel();

  // this.settings = 'test';
    this.focus = new SnackbarModel();
  }

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;


  private unsubscribe$ = new Subject<void>();
  settings: SnackbarModel;
  focus: SnackbarModel;
  enabled: boolean;
  currentUser: User = this.userService.getCurrentUser();
  // objectHelpList: GetObjectHelpResponse[];
  objectHelpDictionary: Map<string, string>;

  ngOnInit() {
    this.helpSnackbarService.observeHelpContext()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((context: SnackbarModel) => {
      this.settings.display = context.display;

      if (context.slug !== undefined) {
        const request: GetObjectHelpRequest = {
          userID: 3,
          specificObjectHelpID: -1,
          slug: context.slug,
          viewSelector: ''
        };

        this.objectHelpService.get(request).then(
          (res: GetObjectHelpListResponse) => {
            // console.log(res.objectHelpList);
            // this.objectHelpList = res.objectHelpList;
            // console.log(this.objectHelpList);
            // console.log(res);
            if (res.objectHelpList !== undefined) {
              if (res.objectHelpList.length > 0) {
                this.settings.title = res.objectHelpList[0].name;
                this.settings.content = res.objectHelpList[0].description;
                this.settings.id = res.objectHelpList[0].objectHelpID;
                this.focus.id = res.objectHelpList[0].objectHelpID;
              }
            }

          },
          (msg) => {}
        );
      }
    });

    this.objectHelpService.observeAllow()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((allow: boolean) => {
      if (allow) {
        this.settings.display = false;
      }

      this.enabled = allow;
    });
  }

  close() {
      this.settings.display = false;
      this.settings.id = -1;
      this.helpSnackbarService.setHelpContext(this.settings);
  }

  edit() {
    this.openModal.nativeElement.click();
  }

  updateObjectHelp() {
    const request: UpdateObjectHelpRequest = {
      userID: this.currentUser.userID,
      objectHelpID: this.focus.id,
      name: this.settings.title,
      description: this.settings.content
    };

    this.objectHelpService
    .update(request)
    .then(
      (res: UpdateObjectHelpResponse) => {
        if (res.outcome.outcome === 'Access denied') {
          this.notify.errorsmsg(
            'Error',
            res.outcome.outcome
          );
        } else {
          this.notify.successmsg(
            'Success',
            res.outcome.outcome
          );
          this.closeModal.nativeElement.click();
        }
      },
      msg => {
        this.notify.errorsmsg(
          'Server Error',
          'Something went wrong while trying to access the server.'
        );
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
