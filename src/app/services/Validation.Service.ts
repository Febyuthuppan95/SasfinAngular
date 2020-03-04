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
  public numberRegex = new RegExp(/^-?(0|[1-9]\d*)?$/);
  
  private requiredField = 'This field is required.';
  private emailFormatIncorrect = '';
  private passwordFormatIncorrect = 'This field is required.';
  


  // Regex Check
  public regexTest = (regexRule: RegExp, inputValue: string): boolean => regexRule.test(inputValue);
  public isEmpty = (value: any): boolean => {
    if (value === undefined) {
      return true;
    } else if (value === null) {
      return true;
    } else if (value === '') {
      return true;
    } else {
      return false;
    }
  }

  public model = (obj: object): { errors: object[]; count: number } => {
    const objectKeys = Object.keys(obj);
    const objectValues = Object.values(obj);
    const errors: { error: string }[] = [];
    let count = 0;
    let type;

    objectKeys.forEach((key, index) => {
      let reqError = '';
      let typeError = '';
      let fieldError = '';
      if (this.isEmpty(objectValues[index])) {
        reqError = this.requiredField;
        errors.push({ error: this.requiredField });
        count++;
      } else {
        errors.push({ error: null });
      }
    });

    return { errors, count };
  }
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
