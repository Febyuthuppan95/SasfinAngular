import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarModel } from '../models/StateModels/SnackbarModel';

@Injectable({
  providedIn: 'root'
})
export class HelpSnackbar {

  /**
   *
   */
  constructor() {
    const defaultContext: SnackbarModel = {
      display: false,
      content: 'Default help object',
      id: -1,
    };

    this.context = new BehaviorSubject<SnackbarModel>(defaultContext);
  }

  context: BehaviorSubject<SnackbarModel>;

  /**
   * observeHelp
   */
  public observeHelpContext() {
    return this.context.asObservable();
  }

  /**
   * setHelpContext
   */
  public setHelpContext(newContext: SnackbarModel) {
    this.context.next(newContext);
  }
}
