import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../services/user.Service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private userService: UserService, private snackbar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          if ([401].indexOf(err.status) !== -1) {
            // this.appService.snackbar({ title: 'Unauthorized (401)', duration: 3000, action: 'OK' });
            this.userService.logout();
          }

          // if ([403].indexOf(err.status) !== -1) {
          //   this.appService.snackbar({ title: 'Forbidden (403)', duration: 3000, action: 'OK' });
          //   this.router.navigate(['error', 'forbidden']);
          // }

          // if ([400].indexOf(err.status) !== -1) {
          //   this.appService.snackbar({ title: 'Bad Request (400)', duration: 3000, action: 'OK' });
          // }

          // if ([422].indexOf(err.status) !== -1) {
          //   this.appService.snackbar({ title: 'Blocked by CORS  (422)', duration: 3000, action: 'OK' });
          // }
          if ([404].indexOf(err.status) !== -1) {
            this.snackbar.open('Request Destination Not Found (404)', '', {duration: 3000});
          }

          // if ([404, 500, 0].indexOf(err.status) !== -1) {
          //   if ([500].indexOf(err.status) !== -1) {
          //     this.appService.snackbar({ title: 'Internal Server Error (500)', duration: 3000, action: 'OK' });
          //   } else {
          //     this.appService.snackbar({ title: 'Something went wrong (Unknown 0)', duration: 3000, action: 'OK' });
          //   }
          // }

          const error = err.error.message || err.statusText;
          return throwError(error);
        }));
    }
}
