import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() {

  }
  private subSidebar = new Subject<boolean>();
  subSidebarEmit$ = this.subSidebar.asObservable();


  /**
   *
   *
   * @param {boolean} setting
   * @memberof MenuService
   */
  public setSidebar(setting: boolean) {
    this.subSidebar.next(setting);
  }


}
