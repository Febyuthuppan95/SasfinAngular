import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dev } from './../../../assets/config.json';
import { UserListResponse } from './../../models/UserListResponse';
import { UserList } from './../../models/UserList';
import { Pagination } from './../../models/Pagination';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent implements OnInit {

  constructor(private httpClient: HttpClient) {
    this.rowStart = 1;
    this.rowCountPerPage = 15;
    this.rightName = 'Users';
    this.filter = '';
    this.loadUsers();
  }

  pages: Pagination[];
  userList: UserList[];
  rowCount: number;

  rowStart: number;
  rowEnd: number;
  rowCountPerPage: number;
  showingRecords: number;
  filter: string;
  rightName: string;

  showLoader = true;

  paginateData() {

    let rowStart = 1;
    let rowEnd = +this.rowCountPerPage;
    const pageCount = +this.rowCount / +this.rowCountPerPage;
    this.pages = Array<Pagination>();

    for (let i = 0; i < pageCount; i++) {
      const item = new Pagination();

      item.page = i + 1;
      item.rowStart = +rowStart;
      item.rowEnd = +rowEnd;
      this.pages[i] = item;

      rowStart = +rowEnd + 1;
      rowEnd += +this.rowCountPerPage;
    }
  }

  pageChange(rowStart: number, rowEnd: number) {
    this.rowStart = +rowStart;
    this.rowEnd = +rowEnd;
    this.loadUsers();
  }

  ngOnInit() {}

  loadUsers() {
    this.rowEnd = +this.rowStart + +this.rowCountPerPage - 1;
    this.showLoader = false;

    const requestModel = {
      _userID: 3,
      _specificUserID: -1,
      _rightName: this.rightName,
      _filter: this.filter,
      _rowStart: this.rowStart,
      _rowEnd: this.rowEnd
    }

    this.httpClient.post<UserListResponse>(`${dev.apiDomain}users/list/`, requestModel)
    .subscribe(
      data => {
        console.log('POST Request is successful ', data);
        this.userList = data.userList;
        this.rowCount = data.rowCount;
        this.showLoader = false;
        this.showingRecords = data.userList.length;
        this.paginateData();
      },
      error => {
        console.log('Error', error);
        this.showLoader = false;
      });
  }

}
