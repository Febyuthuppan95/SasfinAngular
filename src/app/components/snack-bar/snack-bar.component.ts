import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HelpSnackbar } from 'src/app/services/HelpSnackbar.service';
import { SnackbarModel } from 'src/app/models/StateModels/SnackbarModel';
import { ObjectHelpService } from 'src/app/services/ObjectHelp.service';
import { UserService } from 'src/app/services/user.Service';
import { User } from 'src/app/models/HttpResponses/User';
import { UpdateObjectHelpRequest } from 'src/app/models/HttpRequests/UpdateObjectHelpRequest';
import { UpdateObjectHelpResponse } from 'src/app/models/HttpResponses/UpdateObjectHelpResponse';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  constructor(private helpSnackbarService: HelpSnackbar, private objectHelpService: ObjectHelpService,
              private userService: UserService) {
    this.settings = new SnackbarModel();
  }


  @ViewChild('openModal', { static: true })
  openModal: ElementRef;

  @ViewChild('closeModal', { static: true })
  closeModal: ElementRef;

  settings: SnackbarModel;
  enabled: boolean;
  currentUser: User = this.userService.getCurrentUser();

  ngOnInit() {
    this.helpSnackbarService.observeHelpContext().subscribe((context: SnackbarModel) => {
      this.settings.title = context.title;
      this.settings.content = context.content;
      this.settings.display = context.display;
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
      this.helpSnackbarService.setHelpContext(this.settings);
  }

  edit() {
    this.openModal.nativeElement.click();
  }

  updateObjectHelp() {
    const request: UpdateObjectHelpRequest = {
      userID: 3,
      objectHelpID: 1,
      name: this.settings.title,
      rightName: 'ObjectHelp',
      description: this.settings.content
    };

    this.objectHelpService.update(request).then(
      (res: UpdateObjectHelpResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.closeModal.nativeElement.click();
        }
      },
      (msg) => {

      });
  }
}
