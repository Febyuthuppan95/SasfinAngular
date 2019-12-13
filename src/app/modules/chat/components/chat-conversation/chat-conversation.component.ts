import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss']
})
export class ChatConversationComponent implements OnInit {

  constructor() { }
  @Output() dismiss = new EventEmitter<void>();

  ngOnInit() {
  }
  dismissEvent() {
    this.dismiss.emit();
  }


}
