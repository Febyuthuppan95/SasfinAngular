import { Injectable, HostListener, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BackgroundResponse } from 'src/app/models/HttpResponses/BackgroundGet.js';
import { User } from 'src/app/models/HttpResponses/User.js';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ContextMenu } from '../models/StateModels/ContextMenu';
import { UserService } from './user.Service.js';
import { GetUserBackground } from '../models/HttpRequests/GetUserBackground';
import { BackgroundList } from '../models/HttpResponses/BackgroundList';



@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private userService: UserService
    ) {
      const currentUser = this.userService.getCurrentUser();

      this.themeColor = new BehaviorSubject<string>(this.cookieService.get('theme') !== '' ? this.cookieService.get('theme') : 'light');
      this.backgroundImage = new BehaviorSubject<string>(currentUser.backgroundImage);
    }

  // private theme = 'light';
  private toggleHelpValue = false;
  private contMenu = false;
  // private contMenuX = 0;
  // private contMenuY = 0;
  private contMenuTable = false;
  private sidebarCollapsed = true;

  backgroundImage: BehaviorSubject<string>;
  themeColor: BehaviorSubject<string>;

  /**
   * observeBackground
   */
  public observeBackground() {
    return this.backgroundImage.asObservable();
  }

  /**
   * observeTheme
   */
  public observeTheme() {
    return this.themeColor.asObservable();
  }

  /**
   * setTheme
   */
  public setTheme(theme: string) {
    this.cookieService.set('theme', theme, 1000 * 60 * 60 * 24, '/');
    this.themeColor.next(theme);
  }

  /**
   * toggleHelp
   */
  public toggleHelp(): any {
    const toggleHelpObserver = new Observable(observer => {
      setInterval(() => {
        observer.next(this.toggleHelpValue);
      }, 500);
    });

    return toggleHelpObserver;
  }

  /**
   * setToggle
   */
  public setToggleValue(toggle: boolean): void {
    this.toggleHelpValue = toggle;
  }


  /**
   * getBackground
   */
  public getBackground(): string {
    const currentUser = this.userService.getCurrentUser();

    if (currentUser !== null) {
      if (currentUser.backgroundImage !== undefined) {
        return `${environment.ApiBackgroundImages}/${currentUser.backgroundImage}`;
      }
    }

    return `${environment.ApiBackgroundImages}/background1.jpg`;
  }

  /**
   * setBackground
   */
  public setBackground(background: BackgroundList) {
    const currentUser: User = this.userService.getCurrentUser();
    currentUser.backgroundImage = background.image;
    this.userService.persistLogin(JSON.stringify(currentUser));
    this.backgroundImage.next(background.image);

    return new Promise((resolve, reject) => {
      const apiURL = `${environment.ApiEndpoint}/backgrounds/set`;
      const requestModel = {
        userID: currentUser.userID,
        specificUserID: currentUser.userID,
        backgroundID: background.backgroundID,
        rightName: 'BackgroundUser',
      };

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

  public toggleContextMenu(setting: boolean): void {
    // if(this.contMenuTable && setting) { // Clicked on table
    //   console.log('table');
    //   this.contMenu = true;
    // } else {
    //   console.log('not table');
    //   this.contMenu = false;
    //   this.contMenuTable = false;
    // }
    this.contMenu = setting;
  }
  // Clicked on table
  public toggleContTable(): void {
    this.contMenuTable = true;
  }
  public isTable(): Observable<any> {
    return new Observable(observer => {
      setInterval(() => {
        observer.next(this.contMenuTable);
      }, 500);
    });
  }
  public isContextMenu(): Observable<any> {
    return new Observable(observer => {
      setInterval(() => {
        observer.next(this.contMenu);
      }, 500);
    });
    // return isMenu;
  }
 public setSidebarCollapse(collapse: boolean) {
   console.log('set to...', collapse);
   this.sidebarCollapsed = collapse;
 }
 public getSidebarCollapse(): any {
   const result = new Observable(observer => {
    setInterval(() => {
      observer.next(this.sidebarCollapsed);
    }, 500);
  });
  return result;
 }
}
