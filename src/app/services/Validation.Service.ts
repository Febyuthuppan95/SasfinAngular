import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  constructor() {}

  // Regex Rules
  // tslint:disable-next-line: max-line-length
  public emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  public passwordRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  // Regex Check
  public regexTest = (regexRule: RegExp, inputValue: string): boolean => regexRule.test(inputValue);
}


// Password Regex Rules
// ====================
/*
* 1 lowercase Alpha
* 1 uppercase Alpha
* 1 numeric
* 1 special
* 8 characters or more
*/
