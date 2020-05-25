import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { AddUserRight, UpdateUserRight } from '../models/HttpRequests/UserRights';
import { AddUserRequest, GetUserList, UpdateUserRequest } from '../models/HttpRequests/Users';
import { User } from '../models/HttpResponses/User';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  private isAuth = new BehaviorSubject<boolean>(localStorage.getItem('currentUser') !== null);
  //private isAuth = new BehaviorSubject<boolean>(this.cookieService.check('currentUser') !== null);
  public observeLogin = this.isAuth.asObservable();

  public setAuth = (isAuth: boolean) => {
    this.isAuth.next(isAuth);
  }
  /**
   * IsLoggedIn
   */
  public isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') === null ? false : true;
    //return this.cookieService.check('currentUser');
  }

  /**
   * Logout
   */
  public logout(): void {
    localStorage.removeItem('currentUser');
    // this.cookieService.delete('currentUser', '/');
    this.setAuth(false);
    this.router.navigateByUrl('/account/login');
  }

  /**
   * persistLogin
   */
  public persistLogin(currentUser: string): void {
    localStorage.setItem('currentUser', currentUser);
    console.log(currentUser);
    // this.cookieService.set(
    //   'currentUser',
    //   currentUser,
    //   1000 * 60 * 60 * 24,
    //   '/',
    //   null,
    //   true,
    //   'None'
    // );
    // console.log(this.cookieService.get('currentUser'));
  }

  /**
   * getCurrentUser
   */
  public getCurrentUser(): User {
    const jsonString: string = localStorage.getItem('currentUser');
    //const jsonString: string = this.cookieService.get('currentUser');
    if (jsonString !== null) {
      const currentUser: User = JSON.parse(jsonString);

      if (currentUser.profileImage === null) {
        currentUser.profileImage = `${environment.ApiProfileImages}/default.png`;
      } else {
        currentUser.profileImage = `${environment.ApiProfileImages}/${currentUser.profileImage}`;
      }

      return currentUser;
    } else {
      return null;
    }
  }

  public addUserright(model: AddUserRight) {
    const json = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      this.httpClient.post(`${environment.ApiEndpoint}/userRights/add`, json)
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

  public updateUserRight(model: UpdateUserRight) {
    const json = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      this.httpClient.post(`${environment.ApiEndpoint}/userRights/update`, json)
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
   * authenticate
   */
  public authenticate(email: string, pass: string) {
    const requestModel = {
      email: email,
      pass: pass
    };

    const promise = new Promise((resolve, reject) => {
      // const apiURL = `${environment.ApiEndpoint}/account/authenticate`;
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
        .post(apiURL, {email})
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
      email,
      otp,
      newPass
    };

    const promise = new Promise((resolve, reject) => {
      const apiURL = `${
        environment.ApiEndpoint}/account/request/changepassword`;
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

  /*
  * UserUpdate
  */
  public UserUpdate(model: UpdateUserRequest) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/users/update`;
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

  public UserAdd(model: AddUserRequest) {
    const requestModel = JSON.parse(JSON.stringify(model));
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/users/add`;
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
   * UserUpdateProfileImage
   */
  public UserUpdateProfileImage(src: File) {
    if (src !== undefined) {
      const formData = new FormData();
      formData.append('file', src);

      return new Promise((resolve, reject) => {
        const apiURL = `${environment.ApiEndpoint}/users/upload`;
        this.httpClient
        .post(apiURL, formData)
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
}
