import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Config } from '../../assets/config.json';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient) {}

  private theme = 'light';
  private toggleHelpValue = false;

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

    let bg = this.cookieService.get('backgroundURL');

    if (bg === '') {
      bg =
        'http://197.189.218.50:7777/public/images/background/background1.jpg';
    }

    return bg;
  }

  public getUserBackground() {
    const jsonString: string = this.cookieService.get('currentUser');
    const requestModel = {
      _userID: jsonString,
      _specificUserID: 5 // Hardcoded for specific user id
    };
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${Config.ApiEndpoint.local}/backgrounds/get`;
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
   * setBackground
   */
  public setBackground(backgroundURL: string): void {
    this.cookieService.set(
      'backgroundURL',
      backgroundURL,
      1000 * 60 * 60 * 24,
      '/'
    );
  }
}
