import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { UserList } from 'src/app/models/HttpResponses/UserList';

@Component({
  selector: 'app-chat-conversation-list',
  templateUrl: './chat-conversation-list.component.html',
  styleUrls: ['./chat-conversation-list.component.scss']
})
export class ChatConversationListComponent implements OnInit {

  @Output() contacts = new EventEmitter<void>();

  currentUser = this.userService.getCurrentUser();
  conversations: { user: UserList }[];

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  showContacts() {
    this.contacts.emit();
  }

}
