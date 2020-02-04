import { Router } from '@angular/router';
import { TransactionService } from './../../../../services/Transaction.Service';
import { Conversation } from './../chat-conversation-list/chat-conversation-list.component';
import { ChannelService } from 'src/app/modules/chat/services/channel.service';
import { User } from './../../../../models/HttpResponses/User';
import { SelectedConversation } from './../../services/chat.service';
import { ChatSendMessageResponse, ChatConversationGetResponse } from './../../models/responses';
import { ChatSendMessageRequest } from './../../models/requests';
import { ChatNewMessage } from './../../models/signalr';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit, AfterContentChecked {
  

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private channelService: ChannelService,
    private transactionService: TransactionService,
    private router: Router
  ) { }
  @Input() conversationID: number;
  @Output() dismiss = new EventEmitter<void>();
  @ViewChild('chatWindow', { static: false}) private chatWindow: ElementRef;

  messageList: ChatNewMessage[];
  currentUser: User;
  messageCount: number;
  conversation: Conversation;
  transactionID: number;
  messageToSend = new FormControl('', [Validators.required]);
  recipientID = -1;
  form: FormGroup;
  @Output() resetConversation = new EventEmitter<void>();
  ngOnInit() {
    this.scrollToBottom();
    this.chatService.observeConversation().subscribe((conversation: SelectedConversation) => {
      this.currentUser = this.userService.getCurrentUser();
      this.conversationID = conversation === null ? -1 : conversation.conversationID;
      this.transactionID = conversation === null ? -1 : conversation.transactionID;
      console.log(this.transactionID);
      this.recipientID = conversation === null ? -1
      : conversation.recipientID === this.currentUser.userID
      ? conversation.userID : conversation.recipientID;
      console.log(conversation);
      this.conversation = conversation === null ? null : conversation.conversation;
      if (this.conversationID !== -1) {
        this.messagesLoad();
      }
    });
    this.channelService.observeUserConnection().subscribe((hub: signalR.HubConnection) => {
      if (hub !== null) {
        hub.on('userChatConnection', (res: ChatSendMessageRequest) => {
          console.log(res);
          if (this.conversationID === res.conversationID) {
            this.messageList.push({message: res.message,
              messageID: -1, receivingUserID: res.sendingUserID, sender: true});
          }
        });
      }
    });
    this.form = this.formBuilder.group({
      message: this.messageToSend
    });
    // Load conversation messages
    // Hub monitor messages
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentChecked(): void {
    this.scrollToBottom();
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
    if ( (this.recipientID > 0) && ( this.form.get('message').value !== '')) {
      const messageParams: ChatSendMessageRequest = {
        conversationID: this.conversationID,
        receivingUserID: this.recipientID,
        sendingUserID: this.currentUser.userID,
        message: this.form.get('message').value
      };
      console.log(messageParams);
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
  }
  scrollToBottom(): void {
    try {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    } catch (err) { }
}
  back() {
    this.resetConversation.emit();
  }
  gotoLink() {
    console.log('going to link');
    // Redirect to dummy route
    // tslint:disable-next-line: max-line-length
    this.transactionService.setCurrentAttachment({ transactionID: this.transactionID, attachmentID: this.conversation.documentID, docType: this.conversation.fileType });
    // this.router.navigate(['capture', 'transaction', 'attachment']);
    this.router.navigateByUrl('/refreshComponent');
  }

}
export class SignalRMessage {
  conversationID: number;
  message: string;
  messageID: number;
  receivingUserID: number;
}
;
