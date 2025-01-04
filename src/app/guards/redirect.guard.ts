import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
        return of(this.router.createUrlTree(['/websites']));
    } else {
        return of(true);
    }
  }
}