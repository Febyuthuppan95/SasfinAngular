import { CompanyService } from './../../../../services/Company.Service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class ChatOverlayComponent implements OnInit {

  @Input() enableChat: boolean;
  @Input() showChat: boolean;
  @Input() transactionID: number;
  @Input() attachmentID: number;
  @Input() attachmentType: string;
  

  @Output() dismiss = new EventEmitter<void>();

  displayContacts = false;
  displayConversations = true;
  displaySelectedConversation = false;
  currentCompany: number;
  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.companyService.observeCompany().subscribe( (company) => {this.currentCompany = company.companyID;});
  }

  dismissEvent() {
    console.log('dismissed');
    this.dismiss.emit();
  }
  setCurrentSupervisor() {
    // Get supervisor for current user based on Company Service

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
