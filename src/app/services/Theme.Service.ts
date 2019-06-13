import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {


  constructor(private cookieService: CookieService) {}

  private theme = 'light';

  /**
   * getTheme
   */
  public getTheme() {

  }

  /**
   * setTheme
   */
  public setTheme(theme: string) {
    this.theme = theme;
    this.cookieService.set('theme', this.theme, (1000 * 60 * 60 * 24), '/');
  }

  public getCurrentTheme(): any {
    const studentsObservable = new Observable(observer => {
          setInterval(() => {
               observer.next(this.theme);
           }, 500);
    });

    return studentsObservable;
  }
}
