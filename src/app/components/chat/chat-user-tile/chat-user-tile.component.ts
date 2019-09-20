import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment.test';
import { UserList } from 'src/app/models/HttpResponses/UserList';

@Component({
  selector: 'app-chat-user-tile',
  templateUrl: './chat-user-tile.component.html',
  styleUrls: ['./chat-user-tile.component.scss']
})
export class ChatUserTileComponent implements OnInit {

  constructor() { }

  @Input() user: UserList;

  imageURL: string = null;

  ngOnInit() {
    if (this.user.profileImage !== null && this.user.profileImage !== undefined) {
      this.imageURL = `${environment.ApiProfileImages}/${this.user.profileImage}`;
    }
  }

}
