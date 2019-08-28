import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { UpdateObjectHelpRequest } from 'src/app/models/HttpRequests/UpdateObjectHelpRequest';
import { UpdateObjectHelpResponse } from 'src/app/models/HttpResponses/UpdateObjectHelpResponse';
import { GetObjectHelpRequest } from 'src/app/models/HttpRequests/GetObjectHelpRequest';
import { GetObjectHelpResponse } from 'src/app/models/HttpResponses/GetObjectHelpResponse';


@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  constructor(private helpSnackbarService: HelpSnackbar, private objectHelpService: ObjectHelpService,
              private userService: UserService) {
    this.settings = new SnackbarModel();
    this.focus = new SnackbarModel();
  }



  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;

  settings: SnackbarModel;
  focus: SnackbarModel;
  enabled: boolean;
  currentUser: User = this.userService.getCurrentUser();

  ngOnInit() {
    this.helpSnackbarService.observeHelpContext().subscribe((context: SnackbarModel) => {
      this.settings.display = context.display;

      if (context.slug !== undefined) {

        const request: GetObjectHelpRequest = {
          userID: 3,
          specificObjectHelpID: -1,
          slug: context.slug
        };

        this.objectHelpService.get(request).then(
          (res: GetObjectHelpResponse) => {
            this.settings.content = res.description;
            this.settings.title = res.name;
            this.settings.id = res.objectHelpID;
            this.focus.id = res.objectHelpID;
          },
          (msg) => {}
        );
      }
    });

    this.objectHelpService.observeAllow().subscribe((allow: boolean) => {
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
      userID: 3,
      objectHelpID: this.focus.id,
      name: this.settings.title,
      rightName: 'ObjectHelp',
      description: this.settings.content
    };

    this.objectHelpService.update(request).then(
      (res: UpdateObjectHelpResponse) => {
        console.log(res);
        if(res.outcome.outcome === "Access denied"){
          this.notify.errorsmsg(
            'Error',
            res.outcome.outcomeMessage
          );
        }
        else
        {
          this.notify.successmsg(
            res.outcome.outcome,
            res.outcome.outcomeMessage
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
}
