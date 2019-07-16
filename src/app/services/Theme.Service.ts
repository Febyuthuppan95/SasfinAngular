import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Config } from '../../assets/config.json';
import { HttpClient } from '@angular/common/http';
import { BackgroundResponse } from 'src/app/models/HttpResponses/BackgroundGet.js';
import { User } from 'src/app/models/HttpResponses/User.js';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient

    ) {}

  private theme = 'light';
  private toggleHelpValue = false;
  private background = '';

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
}
