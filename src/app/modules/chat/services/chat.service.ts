import { ChatConversationIssue } from './../models/requests';
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
  setConversation = (next: SelectedConversation) => this.selectedConversation.next(next);

  conversationList = (requestModel: ChatConversationListRequest) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/users/chat/conversation/list`;
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
      const apiURL = `${environment.ApiEndpoint}/users/chat/conversation/get`;
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
      const apiURL = `${environment.ApiEndpoint}/users/chat/contact/list`;
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
      const apiURL = `${environment.ApiEndpoint}/users/chat/message/send`;
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
  createIssue = (requestModel: ChatConversationIssue) => {
    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/users/chat/issue`;
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
