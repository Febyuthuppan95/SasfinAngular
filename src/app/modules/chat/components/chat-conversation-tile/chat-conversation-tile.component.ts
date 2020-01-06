import { Conversation } from './../chat-conversation-list/chat-conversation-list.component';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-conversation-tile',
  templateUrl: './chat-conversation-tile.component.html',
  styleUrls: ['./chat-conversation-tile.component.scss']
})
export class ChatConversationTileComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  @Input() public conversation: Conversation;

  imageURL: string = null;

  ngOnInit() {
  }

  selectConversation(userID: any) {
    // this.chatService.setConverastion({ userID });
  }
  gotoConversation() {
    // Need ConversationID
    
  }
}
