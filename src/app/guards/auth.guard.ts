import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { MailService } from '../services/mail.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private mailService: MailService,
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
        this.mailService.fetchMailStatus(token);
        return true;
      }),
      catchError((err) => {
        return of(this.router.createUrlTree(['/session-expired']));
      })
    );
  }
}