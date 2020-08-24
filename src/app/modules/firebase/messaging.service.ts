import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private matSnackbar: MatSnackBar) {
    this.receiveMessage();
  }

  requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      console.log(token);
    });
  }

  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe((msg: any) => {
      this.currentMessage.next(msg);
    });
  }
}
