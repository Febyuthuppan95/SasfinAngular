import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from './modules/firebase/messaging.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

      if (msg !== null) {
        this.matSnackbar.open(`New notification! ${msg.notification.title}`, '', { duration: 3000, panelClass: 'snackbar-notification' });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
