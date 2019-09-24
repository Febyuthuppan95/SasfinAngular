import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { UserList } from 'src/app/models/HttpResponses/UserList';
import { UserListResponse } from 'src/app/models/HttpResponses/UserListResponse';
import { GetUserList } from 'src/app/models/HttpRequests/Users';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-overlay',
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.scss']
})
export class ChatOverlayComponent implements OnInit {

  @Input() enableChat: boolean;
  @Input() showChat: boolean;

  constructor(private userService: UserService) { }

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

  ngOnInit() {
    this.loadContacts();
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

}
