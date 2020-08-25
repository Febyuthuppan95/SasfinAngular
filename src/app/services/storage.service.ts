import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public save = (key: string, value: string) => localStorage.setItem(key, btoa(value));
  public remove = (key: string): void => localStorage.removeItem(key);
  public get = (key: string): any => {
    try {
      return JSON.parse(atob(localStorage.getItem(key)));
    } catch {
      return undefined;
    }
  };
  public check = (key: string): boolean => localStorage.getItem(key) !== null;
}
