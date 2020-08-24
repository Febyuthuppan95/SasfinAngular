import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from './modules/firebase/messaging.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SasfinGTS';
  subscription;

  constructor(private messagingService: MessagingService, private matSnackbar: MatSnackBar) {}

  ngOnInit() {
    this.messagingService.requestPermission();
    this.subscription = this.messagingService.currentMessage.subscribe((msg) => {
      console.log(msg);

      if (msg !== null) {
        console.log('here');
        this.matSnackbar.open(msg.notification.body, '', { duration: 3000 });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
