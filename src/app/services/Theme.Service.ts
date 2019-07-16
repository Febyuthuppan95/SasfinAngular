import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Config } from '../../assets/config.json';
import { HttpClient } from '@angular/common/http';
import { BackgroundResponse } from 'src/app/models/HttpResponses/BackgroundGet.js';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient) {}

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
    console.log('Getting Background for main');
    bg  = 'http://197.189.218.50:7777/public/images/backgrounds/background1.jpg';
    return this.background;
  }
  /**
   *
   */
  public getBackgroundUser(): Observable<{}> {
    const jsonString: string = this.cookieService.get('currentUser');
    const requestModel = {
      _userID: jsonString,
      _specificUserID: 5 // Hardcoded for specific user id
    };

    const url = `${Config.ApiEndpoint.local}/backgrounds/get`;
    let result = this.httpClient.post(url, requestModel);
    return result;
  }
  /**
   * setBackground
   */
  public setBackground(backgroundURL: string): void {
    console.log(backgroundURL);
    const url = `http://localhost:4200/images/backgrounds/${backgroundURL}`;
    console.log(url);
      this.cookieService.set(
        'backgroundURL',
        `http://localhost:4200/images/backgrounds/${backgroundURL}`,
        1000 * 60 * 60 * 24,
        '/'
      );

  }
}
