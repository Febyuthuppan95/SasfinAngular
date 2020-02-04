import { ChatNewMessage } from './../../models/signalr';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {

  constructor(private userService: UserService) { }

  sender: boolean;
  @Input() message: ChatNewMessage;
  ngOnInit() {
    console.log(this.message);
    this.sender = this.userService.getCurrentUser().userID === this.message.receivingUserID ? false : true;
    console.log(this.sender);
  }

}
