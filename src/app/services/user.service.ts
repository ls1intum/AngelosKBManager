import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, Observable } from 'rxjs';
import { UserDTO } from '../data/dto/user.dto';
import { environment } from '../../environments/environment';
import { User } from '../data/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Get the current authenticated user.
   */
  getCurrentUser(): Observable<UserDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<UserDTO>(`${environment.backendUrl}/users/me`, { headers });
  }

  /**
   * Get all users for the authenticated organisation.
   */
  getAllUsers(isAdmin: boolean): Observable<User[]> {
    console.log(isAdmin);
    const headers = this.createAuthHeaders();
    return this.http
      .get<UserDTO[]>(`${environment.backendUrl}/users`, { headers })
      .pipe(
        map((response: UserDTO[]) => this.transformResponse(response, isAdmin))
      );;
  }

  /**
   * Approve a user by ID.
   */
  approveUser(userId: number): Observable<UserDTO> {
    const headers = this.createAuthHeaders();
    return this.http
      .patch<UserDTO>(`${environment.backendUrl}/users/${userId}/approve`, null, { headers })
      .pipe(
        map((response: UserDTO) => this.transformSingleResponse(response, true))
      );
  }

  /**
   * Set a user to admin by ID.
   */
  setUserToAdmin(userId: number): Observable<User> {
    const headers = this.createAuthHeaders();
    return this.http
      .patch<UserDTO>(`${environment.backendUrl}/users/${userId}/set-admin`, null, { headers })
      .pipe(
        map((response: UserDTO) => this.transformSingleResponse(response, true))
      );
  }

  /**
   * Confirm user email.
   */
  confirmEmail(token: string): Observable<string> {
    // This endpoint probably doesn't require auth headers since it's a confirmation endpoint
    return this.http.get(`${environment.backendUrl}/users/confirm`, {
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

  /**
   * Transform a list of responses.
   */
  private transformResponse(response: UserDTO[], isAdmin: boolean): User[] {
    return response.map((dto) => this.transformSingleResponse(dto, isAdmin));
  }

  /**
   * Transform a single response.
   */
  private transformSingleResponse(dto: UserDTO, isAdmin: boolean): User {
    return {
      id: dto.id,
      mail: dto.mail,
      isApproved: dto.isApproved,
      isAdmin: dto.isAdmin,
      actions: isAdmin && !dto.isAdmin ? this.getActions(dto) : []
    };
  }

  private getActions(dto: UserDTO): string[] {
    return [! dto.isApproved ? "approve" : "setAdmin"];
  }
}
