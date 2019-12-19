import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetObjectHelpRequest } from '../models/HttpRequests/GetObjectHelpRequest';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { UpdateObjectHelpRequest } from '../models/HttpRequests/UpdateObjectHelpRequest';
import {GetObjectHelpResponse} from '../models/HttpResponses/GetObjectHelpResponse';

@Injectable({
  providedIn: 'root'
})
export class ObjectHelpService {
  constructor(private httpClient: HttpClient, private cookieService: CookieService) {

    const helpObjectCookie = this.cookieService.get('helpContext');

    if (helpObjectCookie === '') {
      this.helpEnabled = true;

      const helpContext = {
        help: this.helpEnabled ,
      };

      this.cookieService.set('helpContext', JSON.stringify(helpContext), (1000 * 60 * 60 * 24 * 31), '/', '/');    }
  }

  helpEnabled: boolean;
  endPoint = `${environment.ApiEndpoint}/objecthelp`;
  allow = new BehaviorSubject<boolean>(this.helpEnabled);

  /**
   * get
   */
  public get(request: GetObjectHelpRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${this.endPoint}/get`;
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
   * update
   */
  public update(request: UpdateObjectHelpRequest) {
    const requestModel = JSON.parse(JSON.stringify(request));
    return new Promise((resolve, reject) => {
      const apiURL = `${this.endPoint}/update`;
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
   * toggleHelp
   */
  public toggleHelp(toggleState: boolean) {
    this.helpEnabled = toggleState;

    const helpContext = {
      help: this.helpEnabled ,
    };

    this.cookieService.set('helpContext', JSON.stringify(helpContext), (1000 * 60 * 60 * 24 * 31), '/', '/');
    this.setAllow(toggleState);
  }

  /**
   * getHelpState
   */
  public getHelpState = (): boolean => this.helpEnabled;

  /**
   * observeAllow
   */
  public observeAllow() {
    return this.allow.asObservable();
  }

  /**
   * setAllow
   */
  private setAllow(newContext: boolean) {
    this.allow.next(newContext);
  }

}
