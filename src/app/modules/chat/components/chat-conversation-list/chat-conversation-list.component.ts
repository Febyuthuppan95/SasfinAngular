import { ChatConversationIssue } from './../../models/requests';
import { Outcome } from './../../../../models/HttpResponses/DoctypeResponse';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { TransactionService } from 'src/app/services/Transaction.Service';
import { Transaction } from './../../../../models/HttpResponses/TransactionListResponse';
import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { UserList } from 'src/app/models/HttpResponses/UserList';

@Component({
  selector: 'app-chat-conversation-list',
  templateUrl: './chat-conversation-list.component.html',
  styleUrls: ['./chat-conversation-list.component.scss']
})
export class ChatConversationListComponent implements OnInit{

  @Output() contacts = new EventEmitter<void>();
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() attachmentType: string;

  currentUser = this.userService.getCurrentUser();
  currentRecipient = 0;
  conversations: Conversation[];
  

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private chatService: ChatService) { }

  ngOnInit() {
    // Load User Conversations
    this.conversations = [];
  }

  createIssue() {
    // Create a new issue -- direct to conversation with consultant
    const request: ChatConversationIssue = {
      receivingUserID: this.currentRecipient,
      fileType: this.attachmentType,
      documentID: this.attachmentID,
      userID: this.currentUser.userID
    };
    this.chatService.createIssue(request).then(
      (res: ConversationIssue) => {
        console.log(res);
        this.conversations.push({conversationID: 0, recipientID: this.currentRecipient, issueID: 0,
          latestMessage: 'Click to enter new message', latestMessageDate: new Date(2020, 2, 1).toLocaleDateString(),
           issueDoc: 1, issueFileType: 'SAD'});
      },
      (msg) => {

      }
    );
    

  }

}

export interface Conversation {
  conversationID: number;
  recipientID: number;
  issueID: number;
  issueDoc: number;
  issueFileType: string;
  latestMessage: string;
  latestMessageDate: Date | string;
}

export interface ConversationIssue {
  issueID: number;
  conversationID: number;
  outcome: Outcome;
}

