import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private hubUserConnection: signalR.HubConnection = null;
  private userHub = new BehaviorSubject<signalR.HubConnection>(this.hubUserConnection);
  
  constructor() {
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
    this.startConnection();
  }

  startConnection() {
    this.hubUserConnection
    .start()
    .then(() => {
      this.setUserConnection(this.hubUserConnection);
    })
    .catch(err => {
      setTimeout(() => this.startConnection(), 3000);
    });
  }
  
  public observeUserConnection = () => this.userHub.asObservable();
  public setUserConnection = (obj: signalR.HubConnection) => this.userHub.next(obj);

}
