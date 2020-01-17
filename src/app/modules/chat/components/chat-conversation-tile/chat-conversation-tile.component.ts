import { SelectedConversation } from './../../services/chat.service';
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
  @Output() public displaySelectedConversation: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public conversationID: EventEmitter<number> = new EventEmitter<number>();
  imageURL: string = null;

  ngOnInit() {
  }

  selectConversation(userID: any) {
    // this.chatService.setConverastion({ userID });
  }
  gotoConversation(convoID: number, convoRecipient: number) {
    const model: SelectedConversation = {
      conversation: this.conversation,
      conversationID: convoID,
      recipientID: convoRecipient
    };
    this.chatService.setConversation(model);
    // Need ConversationID
    this.displaySelectedConversation.emit(true);
    this.conversationID.emit(convoID);
  }
}
