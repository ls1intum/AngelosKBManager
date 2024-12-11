import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { UserDTO } from '../data/dto/user.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Get all users for the authenticated organisation.
   */
  getAllUsers(): Observable<UserDTO[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<UserDTO[]>(`${environment.backendUrl}/api/users`, { headers });
  }

  /**
   * Approve a user by ID.
   */
  approveUser(userId: number): Observable<UserDTO> {
    const headers = this.createAuthHeaders();
    return this.http.patch<UserDTO>(`${environment.backendUrl}/api/users/${userId}/approve`, null, { headers });
  }

  /**
   * Set a user to admin by ID.
   */
  setUserToAdmin(userId: number): Observable<UserDTO> {
    const headers = this.createAuthHeaders();
    return this.http.patch<UserDTO>(`${environment.backendUrl}/api/users/${userId}/set-admin`, null, { headers });
  }

  /**
   * Confirm user email.
   */
  confirmEmail(token: string): Observable<string> {
    // This endpoint probably doesn't require auth headers since it's a confirmation endpoint
    return this.http.get(`${environment.backendUrl}/api/users/confirm`, {
      params: { token },
      responseType: 'text' // The endpoint returns a String message
    });
  }

  /**
   * Creates authorization headers with the JWT if available.
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
