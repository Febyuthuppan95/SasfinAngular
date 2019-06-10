import { HttpClient } from '@angular/common/http';
import { GetUserList } from './../models/HttpRequests/GetUserList';
import { UserListResponse } from './../models/UserListResponse';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { LoginResponse } from './../models/LoginResponse';
import { Router } from '@angular/router';
import { Config } from './../../assets/config.json';


@Injectable()
export class UserService {

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private router: Router) { }

  /**
   * IsLoggedIn
   */
  public isLoggedIn(): boolean {
    return this.cookieService.check('currentUser');
  }

  /**
   * Logout
   */
  public logout() {
    this.cookieService.delete('currentUser', '/');
    this.router.navigateByUrl('/');
  }

  /**
   * persistLogin
   */
  public persistLogin(currentUser: string) {
    this.cookieService.set('currentUser', currentUser, (1000 * 60 * 60 * 24), '/');
  }

  /**
   * getCurrentUser
   */
  public getCurrentUser() {
    const jsonString: string = this.cookieService.get('currentUser');

    if (jsonString !== '') {
      const currentUser: User = JSON.parse(jsonString);
      return currentUser;
    } else {
      return null;
    }
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
