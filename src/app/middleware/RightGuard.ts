import { CookieService } from 'ngx-cookie-service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './../services/UserService';
import { Router } from '@angular/router';

@Injectable()
export class RightGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) { }

    /**
     * canActivate
     */
    canActivate() {
        // SP Service to check user rights
        return true;
    }
}
