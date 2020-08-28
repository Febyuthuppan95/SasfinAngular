import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public combineDateTime(date: Date | string, time: string): Date {
    const dateObject = new Date(date);
    return new Date(dateObject.getFullYear + '/' + dateObject.getMonth + '/' + dateObject.getDay() + ' ' + time);
  }

  /**
   * Compares two Date objects and returns e number value that represents
   * the result:
   * 0 if the two dates are equal.
   * 1 if the first date is greater than second.
   * -1 if the first date is less than second.
   * @param date1 First date object to compare.
   * @param date2 Second date object to compare.
   */
  public compareDate(date1: Date, date2: Date, ignoreTime?: boolean): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (ignoreTime) {
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
    }

    // Check if the dates are equal
    const same = d1.valueOf() === d2.valueOf();
    if (same) { return 0; }

    // Check if the first is greater than second
    if (d1 > d2) { return 1; }

    // Check if the first is less than second
    if (d1 < d2) { return -1; }
  }

  /**
   * Returns [true/false] if parameter date is in the past or not
   * @param date Date to check
   */
  public isPast(date: Date): boolean {
    const d1 = new Date(date);
    const check = this.compareDate(d1, new Date(), false);

    if (check === -1) { return true; }

    return false;
  }

  /**
   * Gets Todays Date
   */
  public getToday() {
    return new Date();
  }

  /**
   * Gets Tomorrows Date
   */
  public getTomorrow(date?: Date) {
    let tomorrow = new Date();

    if (date) {
      tomorrow = new Date(date);
    }

    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
  }

  /**
   * Returns ticks [number] of a date
   * @param date Date to get ticks
   */
  public getTicks(date: Date): number {
    const tickDate = new Date(date);
    return tickDate.valueOf();
  }

  /**
   * Converts date to UTC
   * @param date Date to be converted
   */
  public getUTC(date: Date) {
    if (!date || date === null) {
      return null;
    }

    const d1 = new Date(date);

    return new Date(Date.UTC(
      d1.getFullYear(),
      d1.getMonth(),
      d1.getDate(),
      d1.getHours(),
      d1.getMinutes(),
      d1.getSeconds(),
      d1.getMilliseconds()
    ));
  }
}
