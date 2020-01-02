import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.Service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private hubUserConnection: signalR.HubConnection = null;
  private userHub = new BehaviorSubject<signalR.HubConnection>(this.hubUserConnection);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private disconnectCount = 0;

  constructor(private userService: UserService) {
    this.hubUserConnection = new signalR.HubConnectionBuilder()
    .withUrl(
      environment.api.users.hub,
      {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();
    this.hubUserConnection.onclose((err) => {
      setTimeout(() => this.startConnection(), 3000);
    });

    if (this.userService.isLoggedIn()) {
      this.startConnection();
    }
  }

  startConnection() {
    if (!this.hubUserConnection.state) {
      this.hubUserConnection
      .start()
      .then(() => {
        // Set hub variables
        this.setUserConnection(this.hubUserConnection);
        this.setConnectionStatus(true);

        // Invoke server method to 'register' user in server memory
        this.hubUserConnection.invoke(
          'UserConnectInit',
          this.userService.getCurrentUser().userID).then(() => {

        });
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
}
