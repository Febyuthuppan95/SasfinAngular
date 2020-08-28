import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.Service';
import { environment } from 'src/environments/environment';
import { UpdateResponse } from 'src/app/layouts/claim-layout/claim-layout.component';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private userService: UserService, private apiService: ApiService) {
    this.receiveMessage();
  }

  requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      localStorage.setItem('firebase', token);

      if (this.userService.isLoggedIn() && token !== null) {
        const user = this.userService.getCurrentUser();

        const model = {
          requestParams: {
            UserID: user.userID,
            FirebaseToken: token
          },
          requestProcedure: 'UserToken'
        };

        this.apiService.post(`${environment.ApiEndpoint}/users/token`, model).then(
          (res: UpdateResponse) => {},
        );
      }
    });
  }

  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe((msg: any) => {
      this.currentMessage.next(msg);
    });
  }
}
