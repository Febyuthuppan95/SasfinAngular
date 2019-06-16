import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  constructor(private cookieService: CookieService) {}

  private theme = "light";

  /**
   * getTheme
   */
  public getTheme(): string {
    const themeCookie = this.cookieService.get("theme");

    if (themeCookie !== "") {
      this.theme = themeCookie;
    } else {
      this.theme = "light";
    }

    return this.theme;
  }

  /**
   * setTheme
   */
  public setTheme(theme: string) {
    this.theme = theme;
    this.cookieService.set("theme", this.theme, 1000 * 60 * 60 * 24, "/");
  }

  public getCurrentTheme(): any {
    const themeCookie = this.cookieService.get("theme");

    if (themeCookie !== "") {
      this.theme = themeCookie;
    }

    const themeObserver = new Observable(observer => {
      setInterval(() => {
        observer.next(this.theme);
      }, 500);
    });

    return themeObserver;
  }
}
