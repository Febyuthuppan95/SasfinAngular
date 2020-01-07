import { SelectedConversation } from './../../services/chat.service';
import { ChatSendMessageResponse, ChatConversationGetResponse } from './../../models/responses';
import { ChatSendMessageRequest } from './../../models/requests';
import { ChatNewMessage } from './../../models/signalr';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit {

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) { }
  @Input() conversationID: number;
  @Output() dismiss = new EventEmitter<void>();
  messageList: ChatNewMessage[];
  currentUserID: number;
  messageCount: number;
  @Output() resetConversation = new EventEmitter<void>();
  
  ngOnInit() {
    this.chatService.observeConversation().subscribe((conversation: SelectedConversation) => {
      this.conversationID = conversation === null ? -1 : conversation.conversationID;
      if (this.conversationID !== -1) {
        this.messagesLoad();
      }
    });
    this.currentUserID = this.userService.getCurrentUser().userID;
    // Load conversation messages
    // Hub monitor messages
  }
  dismissEvent() {
    this.dismiss.emit();
  }
  messagesLoad() {
    console.log(this.conversationID);
    const model = {
      conversationID: this.conversationID,
      userID: this.currentUserID,
      rowStart: 1,
      rowEnd: 10
    };
    this.chatService.conversationMessagesGet(model).then(
      (res: ChatConversationGetResponse) => {
        if (res.outcome.outcome === 'SUCCESS') {
          this.messageList = res.messages;
          this.messageCount = res.rowCount;
        } // Display error message
      },
      (msg) => {
      }
    );

  }
  messageSend() {
    const messageParams: ChatSendMessageRequest = {
      conversationID: 0,
      receivingUserID: 0,
      userID: 0,
      message: ''
    };
    this.chatService.sendMessage(messageParams).then(
      (res: ChatSendMessageResponse) => {
        // print to screen
        if (res.outcome.outcome === 'SUCCESS') {
          this.messageList.push({ message: messageParams.message,
            messageID: res.messageID, receivingUserID: messageParams.receivingUserID});
        } else {
          // Message sending failure
        }
      },
      (msg) => {
        //
      }
    );
  }


}
