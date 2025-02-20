import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private refreshUrl = `${environment.backendUrl}/users/refresh`;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url === this.refreshUrl) {
      return next.handle(req); // Don't attach token to refresh requests
    }

    return this.authService.getAccessToken().pipe(
      switchMap(accessToken => {
        let authReq = req;

        if (accessToken) {
          authReq = this.addTokenHeader(req, accessToken);
        }

        return next.handle(authReq).pipe(
          catchError((error: any) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.handle401Error(authReq, next);
            } else {
              return throwError(() => error);
            }
          })
        );
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Ensure cookies (refresh token) are included
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Attempt to refresh the token
      return this.authService.refreshToken().pipe(
        switchMap((newAccessToken: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newAccessToken);
          // Retry the original request with new access token
          return next.handle(this.addTokenHeader(request, newAccessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // Refresh failed, navigate to login or handle appropriately
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      // If refresh is already in progress, wait until it's done
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }
}