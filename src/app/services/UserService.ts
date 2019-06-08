import { HttpClient } from '@angular/common/http';
import { GetUserList } from './../models/HttpRequests/GetUserList';
import { UserListResponse } from './../models/UserListResponse';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { LoginResponse } from './../models/LoginResponse';
import { Config } from './../../assets/config.json';

@Injectable()
export class UserService {

  constructor(private cookieService: CookieService, private httpClient: HttpClient) { }

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
   * authenticate
   */
  public authenticate(email: string, pass: string) {
    const requestModel = {
      _email: email,
      _pass: pass
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.test}/account/authenticate`;
      this.httpClient.post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  /**
   * forgot password
   */
  public forgotPassword(email: string) {
    const requestModel = {
      _email: email,
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.test}/account/request/otp`;
      this.httpClient.post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  /**
   * change password
   */
  public changePassword(email: string, otp: string, newPass: string) {
    const requestModel = {
      _email: email,
      _otp: otp,
      _newPass: newPass
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.test}/account/request/changepassword`;
      this.httpClient.post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });

    return promise;
  }

  /**
   * user list
   */
  public getUserList(filter: string, userID: number, specificUserID: number, rightName: string, rowStart: number, rowEnd: number) {
    const requestModel = {
      _userID: 3,
      _specificUserID: -1,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.test}/users/list`;
      this.httpClient.post(apiURL, requestModel)
        .toPromise()
        .then(
          res => {
            resolve(res);
          },
          msg => {
            reject(msg);
          }
        );
    });

    return promise;
  }
}
