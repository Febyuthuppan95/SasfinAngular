
import { Invoice } from './../../../models/HttpResponses/Invoices';
import { User } from './../../../models/HttpResponses/User';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { LoginResponse } from '../../../models/HttpResponses/LoginResponse';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.Service.js';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { ChannelService } from 'src/app/modules/chat/services/channel.service';
import { environment } from 'src/environments/environment';
import { UserRightService } from 'src/app/services/UserRight.service';
import { GetUserRightsList } from 'src/app/models/HttpRequests/UserRights';
import { UserRightsListResponse } from 'src/app/models/HttpResponses/UserRightsListResponse';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';



@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;
  pendingRequest = false;
  currentUser: User;
  constructor(
    private router: Router,
    private userService: UserService,
    private renderer: Renderer2,
    private userRightService: UserRightService,
    private storageService: StorageService,
    private apiService: ApiService) { }

  @ViewChild('login', { static: true })
  elRefs: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  typePassword: boolean;
  logoImageUrl = `${environment.ImageRoute}/logo.png`;
  ngOnInit() {
    const elem = document.getElementsByClassName('modal-backdrop');

    if (elem.length > 0) {
      this.renderer.removeClass(elem[0], elem[0].classList[0]);
    }
  }

  clearStorage(clear: boolean) {
    // clear local storage
    if (clear) { localStorage.clear(); }
  }

  onLoginSubmit() {
    this.clearStorage(true);
    if (this.txtEmail === '' || this.txtPassword === '') {

      this.pendingRequest = false;
      this.notify.errorsmsg('Invalid Input', 'Please enter all fields.');
    } else {

      this.pendingRequest = true;
      this.userService.authenticate(this.txtEmail, this.txtPassword).then(
        (res: LoginResponse) => {
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          this.userService.setAuth(res.authenticated);

          if (res.authenticated) {
            this.userService.persistLogin(JSON.stringify(res));
            this.userService.setAuth(res.authenticated);

            const uRModel: GetUserRightsList = {
              userID: 3,
              specificRightID: -1, // default
              specificUserID: res.userID,
              filter: '',
              orderBy: 'Name',
              orderByDirection: 'DESC',
              rowStart: 1,
              rowEnd: 100000
            };
            this.userRightService
              .getUserRightsList(uRModel).then(
              (response: UserRightsListResponse) => {
                this.storageService.save('rights', JSON.stringify(response.userRightsList));

                const user = this.userService.getCurrentUser();

                const model = {
                  requestParams: {
                    UserID: res.userID,
                    FirebaseToken: localStorage.getItem('firebase')
                  },
                  requestProcedure: 'UserToken'
                };

                this.apiService.post(`${environment.ApiEndpoint}/users/token`, model).then(
                  (resp: UpdateResponse) => {},
                );

                if (res.designation === 'Capturer') {
                  this.router.navigate(['transaction/capturerlanding']);
                } else if (res.designation === 'Consultant') {
                  this.router.navigate(['escalations']);
                } else {
                  this.router.navigate(['users']);
                }
            });
          } else {
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
          this.pendingRequest = false;
        },
        (msg) => {
          this.pendingRequest = false;
          this.notify.errorsmsg('Failure', 'Username or password is incorrect.');
        });
    }
  }

  togglePassword() {
    this.togglePassword = function() { this.typePassword = !this.typePassword; };
  }
}
