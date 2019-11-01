import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { UserListResponse } from 'src/app/models/HttpResponses/UserListResponse';
import { GetUserList } from 'src/app/models/HttpRequests/Users';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-chat-contact-list',
  templateUrl: './chat-contact-list.component.html',
  styleUrls: ['./chat-contact-list.component.scss']
})
export class ChatContactListComponent implements OnInit, OnDestroy {

  @Output() showConversations = new EventEmitter<void>();

  constructor(private userService: UserService, private chatService: ChatService) { }

  contactList: { designation: string, users: UserList[] }[];
  userListResponse: UserListResponse;
  noContacts: boolean;
  currentUser = this.userService.getCurrentUser();

  userRequest: GetUserList = {
    userID: this.currentUser.userID,
    specificUserID: -1,
    orderDirection: 'ASC',
    orderBy: 'Designation',
    rowStart: 1,
    rowEnd: 1000,
    filter: ''
  };

  selectedUser: number = null;

  private unsubscribe$ = new Subject<void>();


  ngOnInit() {
    this.loadContacts();

    this.chatService.observeConversation()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((conv) => {
      if (conv !== null) {
        this.selectedUser = conv.userID;
      }
    });
  }

  loadContacts() {
    this.userService.getUserList(this.userRequest).then(
      (res: UserListResponse) => {
        this.userListResponse = res;
        this.contactList = [];
        let designation = 'Capturer';
        let users: UserList[] = [];
        this.userListResponse.userList.forEach((item, i) => {
          if (designation === item.designation) {
            users.push(item);
          } else {
            this.contactList.push({ designation, users });
            designation = item.designation;
            users = [];
          }
        });

        if (users !== []) {
          this.contactList.push({ designation, users });
        }
      },
      (msg) => {
        this.noContacts = false;

        if (!environment.production) {
          console.log(msg);
        }
      }
    );
  }

  contactSearch() {
    this.loadContacts();
  }

  showConversationsEvent() {
    this.showConversations.emit();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
