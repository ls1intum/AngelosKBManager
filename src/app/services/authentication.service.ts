import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { RegisterRequestDTO } from '../data/dto/register-request.dto';
import { UserDTO } from '../data/dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessToken: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      `${environment.backendUrl}/api/users/login`,
      { email, password }, 
      { withCredentials: true } // Ensure refresh cookie is set
    ).pipe(
      tap(response => {
        this.accessToken = response.accessToken;
        this.router.navigate(['/']);
      })
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(
      `${environment.backendUrl}/api/users/refresh`,
      {}, // No body needed since refresh token is in cookie
      { withCredentials: true }
    ).pipe(
        tap(response => {
          this.accessToken = response.accessToken;
        }),
        map(response => response.accessToken)
      );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  logout() {
    // Call backend to clear the refresh token
    this.http.post(
        `${environment.backendUrl}/api/users/logout`, 
        {}, 
        { withCredentials: true } // Ensure the refresh token cookie is included
    ).subscribe({
        next: () => {
            console.log('Logged out successfully.');
        },
        error: (err) => {
            console.error('Logout failed:', err);
        },
        complete: () => {
            // Clear access token and redirect to login regardless of backend response
            this.accessToken = null;
            this.router.navigate(['/login']);
        }
    });
  }

  register(email: string, password: string, orgId: number): Observable<UserDTO> {
    const registerRequest: RegisterRequestDTO = { email, password, orgId };
    return this.http.post<UserDTO>(
      `${environment.backendUrl}/api/users/register`,
      registerRequest,
      { withCredentials: true }
    );
  }
}