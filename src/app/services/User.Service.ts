import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Injectable} from '@angular/core';
import {User} from '../models/HttpResponses/User';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router
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
    debugger;
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
        currentUser.profileImage = `${environment.ImageRoute}/default.jpg`;
      } else {
        currentUser.profileImage = `${environment.ImageRoute}/${currentUser.profileImage}`;
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
      _email: email,
      _pass: pass
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
    const requestModel = {
      _email: email
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/account/request/otp`;
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
   * change password
   */
  public changePassword(email: string, otp: string, newPass: string) {
    const requestModel = {
      _email: email,
      _otp: otp,
      _newPass: newPass
    };

    return new Promise((resolve, reject) => {
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
  }


  /**
   * user list
   */
  public getUserList(
    filter: string,
    userID: number,
    specificUserID: number = -1,
    rightName: string,
    rowStart: number,
    rowEnd: number,
    // tslint:disable-next-line:align
    orderBy: string,
    orderDirection: string
  ) {
    const requestModel = {
      _userID: userID,
      _specificUserID: specificUserID,
      _rightName: rightName,
      _filter: filter,
      _rowStart: rowStart,
      _rowEnd: rowEnd,
      _orderBy: orderBy,
      _orderDirection: orderDirection
    };

    return new Promise((resolve, reject) => {
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
  }
}
