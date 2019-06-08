import { HttpClient } from '@angular/common/http';
import { GetUserList } from './../models/HttpRequests/GetUserList';
import { UserListResponse } from './../models/UserListResponse';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable()
export class UserService {

  constructor(private cookieService: CookieService) { }

  /**
   * IsLoggedIn
   */
  public isLoggedIn(): boolean {
    return this.cookieService.check('UserId');
  }

  /**
   * Logout
   */
  public logout() {
    this.cookieService.set('UserId', null);
    this.cookieService.delete('Email');
    this.cookieService.delete('FirstName');
    this.cookieService.delete('Surname');
    this.cookieService.delete('EmpNo');
    this.cookieService.delete('Designation');
    this.cookieService.delete('Extension');
    this.cookieService.delete('ProfileImage');
    this.cookieService.delete('BackgroundImage');
  }

  /**
   * getCurrentUser
   */
  public getCurrentUser() {
    const currentUser = new User();
    currentUser.firstName = this.cookieService.get('FirstName');
    currentUser.surname = this.cookieService.get('Surname');
    currentUser.email = this.cookieService.get('Email');
    currentUser.empNo = this.cookieService.get('EmpNo');
    currentUser.userID = +this.cookieService.get('UserId');
    currentUser.designation = this.cookieService.get('Designation');
    currentUser.backgroundImage = this.cookieService.get('BackgroundImage');
    currentUser.extension = this.cookieService.get('Extension');
    currentUser.profileImage = this.cookieService.get('ProfileImage');
    return currentUser;
  }

  /**
   * GetUserList
   */
  public getUserList(obj: GetUserList) {

    const requestModel = {
      _userID: 3,
      _specificUserID: -1,
      _rightName: obj.rightName,
      _filter: obj.filter,
      _rowStart: obj.rowStart,
      _rowEnd: obj.rowEnd
    };
  }
}
