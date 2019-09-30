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

  @Input() user: UserList;

  imageURL: string = null;

  ngOnInit() {
    if (this.user.profileImage !== null && this.user.profileImage !== undefined) {
      this.imageURL = `${environment.ApiProfileImages}/${this.user.profileImage}`;
    }
  }

  selectConversation(userID: number) {
    this.chatService.setConverastion({ userID });
  }
}
