import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { User } from '../models/HttpResponses/User';
import { Router } from '@angular/router';
import { Config } from '../../assets/config.json';
import { environment } from '../../environments/environment';
import { ThemeService } from './theme.Service';
import { GetUserList } from '../models/HttpRequests/GetUserList';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}

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
    this.router.navigateByUrl('/account/login');
  }

  /**
   * persistLogin
   */
  public persistLogin(currentUser: string) {
    this.cookieService.set(
      'currentUser',
      currentUser,
      1000 * 60 * 60 * 24,
      '/'
    );
  }


  /**
   * getCurrentUser
   */
  public getCurrentUser() {
    const jsonString: string = this.cookieService.get('currentUser');
    if (jsonString !== '') {
      const currentUser: User = JSON.parse(jsonString);

      if (currentUser.profileImage === null) {
        currentUser.profileImage = `${environment.ApiProfileImages}/default.jpg`;
      } else {
        currentUser.profileImage = `${environment.ApiProfileImages}/${currentUser.profileImage}`;
      }
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
      email: email,
      pass: pass
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/account/authenticate`;
      this.httpClient
        .post(apiURL, requestModel)
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
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/account/request/otp`;
      this.httpClient
        .post(apiURL, {email: email})
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
      const apiURL = `${
        environment.ApiEndpoint
      }/account/request/changepassword`;
      this.httpClient
        .post(apiURL, requestModel)
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
  public getUserList(model: GetUserList) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/users/list`;
      this.httpClient
        .post(apiURL, requestModel)
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
