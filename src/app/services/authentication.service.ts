import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { RegisterRequestDTO } from '../data/dto/register-request.dto';
import { UserDTO } from '../data/dto/user.dto';
import { StudyProgramService } from './study-program.service';
import { MailService } from './mail.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number; // Expiration time in seconds
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessToken: string | null = null;

  // Subject to track ongoing refresh request
  private isRefreshing = false;
  private refreshTokenSubject: Subject<string | null> = new Subject<string | null>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private studyProgramService: StudyProgramService,
    private mailService: MailService
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      `${environment.backendUrl}/users/login`,
      { email, password },
      { withCredentials: true } // Ensure refresh cookie is set
    ).pipe(
      tap(response => {
        this.accessToken = response.accessToken;
        console.log("Login successful", this.accessToken);
      })
    );
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      // If a refresh is already in progress, return the existing Observable
      return this.refreshTokenSubject.pipe(
        switchMap(token => {
          if (token) {
            return of(token); // Use the new token once available
          } else {
            throw new Error('Refresh token failed'); // Handle edge case
          }
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http.post<{ accessToken: string }>(
      `${environment.backendUrl}/users/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.accessToken = response.accessToken;
        this.refreshTokenSubject.next(response.accessToken);
      }),
      map(response => response.accessToken),
      catchError(error => {
        this.refreshTokenSubject.next(null);
        console.error("Refresh token failed:", error);
        throw error;
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  getAccessToken(): Observable<string | null> {
    if (this.accessToken && this.isTokenExpired(this.accessToken)) {
      return this.refreshToken();
    }
    return of(this.accessToken);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        return Date.now() >= decoded.exp * 1000; // Convert seconds to milliseconds
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  logout() {
    this.http.post(
      `${environment.backendUrl}/users/logout`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => {
        console.log('Logged out successfully.');
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
      complete: () => {
        this.accessToken = null;
        this.reset();
        this.studyProgramService.reset();
        this.mailService.reset();
        this.router.navigate(['/login']);
      }
    });
  }

  register(email: string, password: string, orgId: number): Observable<UserDTO> {
    const registerRequest: RegisterRequestDTO = { email, password, orgId };
    return this.http.post<UserDTO>(
      `${environment.backendUrl}/users/register`,
      registerRequest,
      { withCredentials: true }
    );
  }

  reset(): void {
    this.refreshTokenSubject.next(null);
  }
}