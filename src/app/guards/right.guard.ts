import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.Service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable()
export class RightGuard implements CanActivate {

    constructor(private router: Router, private storage: StorageService) { }

    /**
     * canActivate
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const rights: string[] = this.storage.get('rights').map((item) => item.name);
        const targetRight = route.data.right;

        if (rights.indexOf(targetRight) === -1) {
          this.router.navigate(['unauthorized']);
          return false;
        }

        return true;
    }
}
