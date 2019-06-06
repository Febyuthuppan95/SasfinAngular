import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../assets/config.json';
import { UserListResponse } from './../../models/UserListResponse';
import { UserList } from './../../models/UserList';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent implements OnInit {

  constructor(private httpClient: HttpClient) {
    this.loadUsers();
  }

  userList: UserList[];

  ngOnInit() {
  }

  loadUsers() {

    const requestModel = {
      _userID: 3,
      _specificUserID: -1,
      _rightName: 'Users',
      _filter: '',
      _rowStart: 1,
      _rowEnd: 15
    }

    this.httpClient.post<UserListResponse>(`${dev.apiDomain}users/list/`, requestModel)
    .subscribe(
      data => {
        console.log('POST Request is successful ', data);
        this.userList = data.userList;
      },
      error => {
        console.log('Error', error);
      });
  }

}
