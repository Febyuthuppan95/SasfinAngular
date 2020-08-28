import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from './modules/firebase/messaging.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from './services/event.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SasfinGTS';
  subscription;

  constructor(private messagingService: MessagingService,
              private matSnackbar: MatSnackBar,
              private event: EventService) {}

  ngOnInit() {
    this.messagingService.requestPermission();
    const body = document.getElementsByTagName('body')[0];

    this.subscription = this.messagingService.currentMessage.subscribe((msg) => {

      if (msg !== null) {
        this.matSnackbar.open(`New notification! ${msg.notification.title}`, '', { duration: 3000, panelClass: 'snackbar-notification' });
      }
    });

    this.event.mouseChange.subscribe((mouse) => {
      if (mouse) {
        body.classList.remove('defaultCursor');
        body.classList.add('customCursor');
      } else {
        body.classList.remove('customCursor');
        body.classList.add('defaultCursor');
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
