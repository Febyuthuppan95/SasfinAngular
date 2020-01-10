import { User } from './../../../../models/HttpResponses/User';
import { SelectedConversation } from './../../services/chat.service';
import { ChatSendMessageResponse, ChatConversationGetResponse } from './../../models/responses';
import { ChatSendMessageRequest } from './../../models/requests';
import { ChatNewMessage } from './../../models/signalr';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit {

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }
  @Input() conversationID: number;
  @Output() dismiss = new EventEmitter<void>();
  messageList: ChatNewMessage[];
  currentUser: User;
  messageCount: number;
  messageToSend = new FormControl('', [Validators.required]);
  recipientID: number;
  form: FormGroup;
  @Output() resetConversation = new EventEmitter<void>();
  ngOnInit() {
    this.chatService.observeConversation().subscribe((conversation: SelectedConversation) => {
      this.conversationID = conversation === null ? -1 : conversation.conversationID;
      this.recipientID = conversation === null ? -1 : conversation.recipientID;
      if (this.conversationID !== -1) {
        this.currentUser = this.userService.getCurrentUser();
        this.messagesLoad();
      }
    });
    this.form = this.formBuilder.group({
      message: this.messageToSend
    });
    // Load conversation messages
    // Hub monitor messages
  }
  dismissEvent() {
    this.dismiss.emit();
  }
  messagesLoad() {
    console.log(this.recipientID);
    const model = {
      conversationID: this.conversationID,
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 10
    };
    this.chatService.conversationMessagesGet(model).then(
      (res: ChatConversationGetResponse) => {
        if (res.outcome.outcome === 'Success') {
          if (res.messages.length === 1) {
          } else {
          this.messageList = res.messages;
          this.messageCount = res.rowCount;
          this.messageList.forEach(x => x.receivingUserID === this.currentUser.userID ? x.sender = false : true);
          console.log(this.messageList);
          }
        } // Display error message
      },
      (msg) => {
      }
    );

  }
  messageSend() {
    const messageParams: ChatSendMessageRequest = {
      conversationID: this.conversationID,
      receivingUserID: this.recipientID,
      userID: this.currentUser.userID,
      message: this.form.get('message').value
    };
    this.chatService.sendMessage(messageParams).then(
      (res: ChatSendMessageResponse) => {
        console.log(res);
        // print to screen
        if (res.outcome.outcome === 'Success') {
          this.messageList.push({ message: messageParams.message,
            messageID: res.messageID, receivingUserID: messageParams.receivingUserID, sender: true});
        } else {
          // Message sending failure
        }
      },
      (msg) => {
        //
      }
    );
    this.form.reset();
  }
  back() {
    this.resetConversation.emit();
  }


}
