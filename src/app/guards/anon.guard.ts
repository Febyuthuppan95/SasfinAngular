import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.Service';
import { Router } from '@angular/router';

@Injectable()
export class AnonGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  /**
   * canActivate
   */
  canActivate() {
    const state: boolean = this.userService.isLoggedIn();

    if (state) {
      this.router.navigateByUrl('/users');
    }

    return !state;
  }
}
