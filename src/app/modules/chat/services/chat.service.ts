import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatConversationListRequest, ChatContactListRequest, ChatSendMessageRequest } from '../models/requests';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  selectedConversation = new BehaviorSubject<SelectedConversation>(null);

  constructor(private httpClient: HttpClient) { }

  observeConversation = () => this.selectedConversation.asObservable();
  setConverastion = (next: SelectedConversation) => this.selectedConversation.next(next);

  conversationList = (requestModel: ChatConversationListRequest) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/chat/conversation/list`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }

  conversationGet = (requestModel: ChatConversationListRequest) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/chat/conversation/get`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }

  contactList = (requestModel: ChatContactListRequest) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/chat/contact/list`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }

  sendMessage = (requestModel: ChatSendMessageRequest) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/chat/message/send`;
      this.httpClient
        .post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });
  }
}

export class SelectedConversation {
  conversationID?: number;
  userID: number;
}