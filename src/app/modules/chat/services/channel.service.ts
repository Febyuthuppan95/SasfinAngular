import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.Service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements OnDestroy {
  private hubUserConnection: signalR.HubConnection = null;
  private userHub = new BehaviorSubject<signalR.HubConnection>(this.hubUserConnection);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private disconnectCount = 0;
  private unsubscribe$ = new Subject<void>();

  constructor(private userService: UserService) {
    this.hubUserConnection = new signalR.HubConnectionBuilder()
    .withUrl(
      environment.api.users.hub,
      {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.userService.observeLogin
    .pipe(takeUntil(this.unsubscribe$)).subscribe((isAuth) => {
      if (isAuth) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });

    this.observeUserConnection().subscribe((hub) => {
      if (hub !== null) {
        if (hub.state === 1) {

        // Invoke server method to 'register' user in server memory
        hub.invoke(
          'UserConnectInit',
          this.userService.getCurrentUser().userID).then(() => {
            console.log(`Registered to Hub Context, UserID: ${this.userService.getCurrentUser().userID}`);
        });
        }
      }
    });
  }

  startConnection() {
    if (this.hubUserConnection.state === 0) {
      this.hubUserConnection
      .start()
      .then(() => {
        // Set hub variables
        this.setUserConnection(this.hubUserConnection);
        this.setConnectionStatus(true);
      })
      .catch(err => {
        console.log(err);
        this.setConnectionStatus(false);
        this.setUserConnection(null);
        this.disconnectCount++;

        setTimeout(() => {
          this.startConnection();
        }, 5000);
      });
    }
  }

  stopConnection() {
    this.setUserConnection(null);
    this.hubUserConnection.stop();
  }

  public observeUserConnection = () => this.userHub.asObservable();
  public setUserConnection = (obj: signalR.HubConnection) => this.userHub.next(obj);

  public setConnectionStatus = (status: boolean) => this.connectionStatus.next(status);
  public observeConnectionStatus = () => this.connectionStatus.asObservable();

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
