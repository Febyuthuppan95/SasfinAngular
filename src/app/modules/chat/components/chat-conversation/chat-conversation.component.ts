import { ChatSendMessageResponse } from './../../models/responses';
import { ChatSendMessageRequest } from './../../models/requests';
import { ChatNewMessage } from './../../models/signalr';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit {

  constructor(
    private chatService: ChatService
  ) { }
  @Output() dismiss = new EventEmitter<void>();
    messageList: ChatNewMessage[];
    currentUserID: number;
  ngOnInit() {
    // Load conversation messages
    // Hub monitor messages
  }
  dismissEvent() {
    this.dismiss.emit();
  }
  messagesLoad() {
    
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
