import { Injectable, HostListener, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { Config } from '../../assets/config.json';
import { HttpClient } from '@angular/common/http';
import { BackgroundResponse } from 'src/app/models/HttpResponses/BackgroundGet.js';
import { User } from 'src/app/models/HttpResponses/User.js';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ContextMenu } from '../models/StateModels/ContextMenu';



@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient
    ) {
    }

  private theme = 'light';
  private toggleHelpValue = false;
  private background = '';
  private contMenu = false;
  private contMenuX = 0;
  private contMenuY = 0;
  private contMenuTable = false;
  private sidebarCollapsed = true;
  // Subjects
  private subjectSidebar = new Subject<boolean>();

  // Observable stream
  subjectSidebarEmit$ = this.subjectSidebar.asObservable();

  public setSidebar(source: boolean) {
    this.subjectSidebar.next(source);
    console.log(source);
  }

  /**
   * getTheme
   */
  public getTheme(): string {
    const themeCookie = this.cookieService.get('theme');

    if (themeCookie !== '') {
      this.theme = themeCookie;
    } else {
      this.theme = 'light';
    }

    return this.theme;
  }

  /**
   * setTheme
   */
  public setTheme(theme: string) {
    this.theme = theme;
    this.cookieService.set('theme', this.theme, 1000 * 60 * 60 * 24, '/');
  }

  /**
   * getCurrentTheme
   */
  public getCurrentTheme(): any {
    const themeCookie = this.cookieService.get('theme');

    if (themeCookie !== '') {
      this.theme = themeCookie;
    }

    const themeObserver = new Observable(observer => {
      setInterval(() => {
        observer.next(this.theme);
      }, 500);
    });

    return themeObserver;
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
    let bg = '';
    bg  = `${environment.ImageRoute}/backgrounds/background1.jpg`;
    return bg;
  }
  /**
   *
   */
  public getBackgroundUser(): Observable<{}> {
    const jsonString: string = this.cookieService.get('currentUser');
    const curUser: User = JSON.parse(jsonString);
    const requestModel = {
      _userID: curUser.userID,
      _specificUserID: 5 // Hardcoded for specific user id
    };
    const url = `${environment.ApiEndpoint}/backgrounds/get`;
    let result = this.httpClient.post(url, requestModel);
    return result;
  }
  /**
   * setBackground
   */
  public setBackground(backgroundURL: string): void {
    const path = `${environment.ImageRoute}/backgrounds/${backgroundURL}`;
      this.cookieService.set(
        'backgroundURL',
        path,
        1000 * 60 * 60 * 24,
        '/'
      );

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
