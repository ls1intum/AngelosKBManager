import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return of(true);
    }

    // No token, try to refresh silently
    return this.authService.refreshToken().pipe(
      map(token => {
        return true;
      }),
      catchError((err) => {
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}