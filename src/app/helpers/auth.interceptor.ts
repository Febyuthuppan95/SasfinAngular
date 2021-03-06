import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { UserService } from '../services/user.Service';
import { headersToString } from 'selenium-webdriver/http';

@Injectable()
 export class AuthInterceptor implements HttpInterceptor {
   constructor(private DIUserService: UserService) { }

  /**
   * Will intercept any HTTP request and attach the following headers to it.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Should get auth token
    const request = req.clone({
      withCredentials: true,
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    });

    return next.handle(request);
 }
}
