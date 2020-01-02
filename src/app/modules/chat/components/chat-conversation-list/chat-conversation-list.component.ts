import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { UserList } from 'src/app/models/HttpResponses/UserList';

@Component({
  selector: 'app-chat-conversation-list',
  templateUrl: './chat-conversation-list.component.html',
  styleUrls: ['./chat-conversation-list.component.scss']
})
export class ChatConversationListComponent implements OnInit{

  @Output() contacts = new EventEmitter<void>();

  currentUser = this.userService.getCurrentUser();
  conversations: { user: UserList }[];
  

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.conversations = [];
    const userL: UserList = {
      rowNum: 1,
      userId: 3,
      firstName: 'Name',
      surname: 'SName',
      email: '@mail.com',
      extension: '0415608907',
      designation: 'Lead Capturer',
      online: true,
      profileImage: 'silvia-elizabeth-ocana-ferr.jpg'      
    };
    this.conversations.push({user: userL});
  }

  createIssue() {
    // Create a new issue
    
  }

}
