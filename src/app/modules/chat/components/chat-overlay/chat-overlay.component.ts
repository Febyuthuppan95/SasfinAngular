import { ChannelService } from './../../services/channel.service';
import { Subscription } from 'rxjs';
import { SelectedConversation } from './../../services/chat.service';
import { CompanyService } from './../../../../services/Company.Service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { UserListResponse } from 'src/app/models/HttpResponses/UserListResponse';
import { GetUserList } from 'src/app/models/HttpRequests/Users';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/modules/chat/services/chat.service';

@Component({
  selector: 'app-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss']
})
export class ChatOverlayComponent implements OnInit, OnDestroy {

  @Input() enableChat: boolean;
  @Input() showChat: boolean;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() attachmentType: string;

  @Output() dismiss = new EventEmitter<void>();

  displayContacts = false;
  displayConversations = true;
  displaySelectedConversation = false;
  selectedConversation: number;
  currentCompany: number;
  chatSubscription: Subscription;
  constructor(
    private companyService: CompanyService,
    private chatService: ChatService,
    private channelService: ChannelService) { }

  ngOnInit() {
    this.channelService.observeUserConnection().subscribe((hub: signalR.HubConnection) => {
      if (hub !== null) {
        hub.on('userChatConnection', (msg: string) => {
          
        });
      }
    });
    this.companyService.observeCompany().subscribe( (company) => {
      this.currentCompany = company === null ? -1 : company.companyID;
    });
    this.chatSubscription = this.chatService.observeConversation()
    .subscribe((conversation: SelectedConversation) => {
      console.log(conversation);
      this.selectedConversation = conversation === null ? -1 : conversation.conversationID;
      this.displaySelectedConversation = this.selectedConversation === -1 ? false : true;
      this.displayConversations = !this.displaySelectedConversation;
      console.log(this.selectedConversation);
    });
  }
  ngOnDestroy(): void {
    this.displayConversations = true;
    this.displaySelectedConversation = false;
    this.chatSubscription.unsubscribe();
  }

  dismissEvent() {
    console.log('dismissed');
    this.dismiss.emit();
  }
  setCurrentSupervisor() {
    // Get supervisor for current user based on Company Service

  }
  setConvo($event: number) {
    this.displaySelectedConversation = $event === -1 ? false : true;
    this.displayConversations = !this.displaySelectedConversation;
  }
  displayContactsEvent() {
    this.displayConversations = false;
    this.displayContacts = true;
  }

  displayCOnversationsEvent() {
    this.displayConversations = true;
    this.displayContacts = false;
  }
}
