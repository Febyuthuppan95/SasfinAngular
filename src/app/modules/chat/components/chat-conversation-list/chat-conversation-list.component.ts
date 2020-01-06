import { ChatConversationListResponse } from './../../models/responses';
import { CompanyServiceResponse } from './../../../../models/HttpResponses/CompanyServiceResponse';
import { CompanyService } from 'src/app/services/Company.Service';
import { User } from './../../../../models/HttpResponses/User';
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
export class ChatConversationListComponent implements OnInit {

  @Output() contacts = new EventEmitter<void>();
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() attachmentType: string;
  @Input() companyID: number;

  currentUser: User;
  currentRecipient: number;
  conversations: Conversation[];


  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private chatService: ChatService,
    private companyService: CompanyService) { }

  ngOnInit() {
    // Load User Conversations
    this.conversations = [];
    this.currentUser = this.userService.getCurrentUser();
    this.setResponsibleUser();

  }

  setResponsibleUser() {
    const model = {
      filter: '',
      userID: this.currentUser.userID,
      specificCompanyID: this.companyID,
      specificServiceID: 1,
      rowStart: 1,
      rowEnd: 10,
      orderBy: '',
      orderByDirection: ''
    };
    this.companyService.service(model).then(
      (res: CompanyServiceResponse) => {
        console.log(res);
        if ((this.currentUser.userID === res.services[0].resCapturerID) &&
            (this.currentUser.userID !== res.services[0].resConsultantID)) {
          // if capturer lead
              this.currentRecipient = res.services[0].resConsultantID;
        } else {
          this.currentRecipient = res.services[0].resCapturerID;
        }
      },
      (msg) => {

      }
    );
  }
  getConversations() {
    const model = {
      userID: this.currentUser.userID,
      rowStart: 1,
      rowEnd: 10,
      filter: ''
    };
    this.chatService.conversationList(model).then(
      (res: ChatConversationListResponse) => {
        this.conversations = res.conversations;
      });
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
        this.conversations.push({conversationID: res.conversationID, recipientID: this.currentRecipient, issueID: res.issueID,
          latestMessage: 'Click to enter new message', latestMessageDate: new Date().toLocaleDateString(),
           issueDoc: request.documentID, issueFileType: request.fileType});
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

