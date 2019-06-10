import { CookieService } from 'ngx-cookie-service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './../services/UserService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

    /**
     * canActivate
     */
    canActivate() {
        const state: boolean = this.userService.isLoggedIn();

        if (!state) {
            this.toastr.warning('Please login to continue', 'Unauthenticated');
            this.router.navigateByUrl('/');
        }

        return state;
    }
}
