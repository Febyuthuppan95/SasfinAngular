import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment.test';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { ChatService } from 'src/app/modules/chat/services/chat.service';

@Component({
  selector: 'app-chat-user-tile',
  templateUrl: './chat-user-tile.component.html',
  styleUrls: ['./chat-user-tile.component.scss']
})
export class ChatUserTileComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  @Input() user: UserList;

  imageURL: string = null;

  ngOnInit() {
    if (this.user.profileImage !== null && this.user.profileImage !== undefined) {
      this.imageURL = `${environment.ApiProfileImages}/${this.user.profileImage}`;
    }
  }

  selectConversation(userID: any) {
    this.chatService.setConverastion({ userID });
  }

}
