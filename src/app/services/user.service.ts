import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, Observable } from 'rxjs';
import { UserDTO } from '../data/dto/user.dto';
import { environment } from '../../environments/environment';
import { User } from '../data/model/user.model';
import { UserDetailsDTO } from '../data/dto/user-details.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  /**
   * Get the current authenticated user.
   */
  getCurrentUser(): Observable<UserDetailsDTO> {
    return this.http.get<UserDetailsDTO>(`${environment.backendUrl}/users/me`, {});
  }

  /**
   * Get all users for the authenticated organisation.
   */
  getAllUsers(isAdmin: boolean): Observable<User[]> {
    return this.http
      .get<UserDTO[]>(`${environment.backendUrl}/users`, {})
      .pipe(
        map((response: UserDTO[]) => this.transformResponse(response, isAdmin))
      );;
  }

  /**
   * Approve a user by ID.
   */
  approveUser(userId: number): Observable<User> {
    return this.http
      .patch<UserDTO>(`${environment.backendUrl}/users/${userId}/approve`, null, {})
      .pipe(
        map((response: UserDTO) => this.transformSingleResponse(response, true))
      );
  }

  /**
   * Set a user to admin by ID.
   */
  setUserToAdmin(userId: number): Observable<User> {
    return this.http
      .patch<UserDTO>(`${environment.backendUrl}/users/${userId}/set-admin`, null, {})
      .pipe(
        map((response: UserDTO) => this.transformSingleResponse(response, true))
      );
  }

  /**
   * Remove user from the organisation.
   */
  removeUser(userId: number): Observable<User> {
    return this.http
      .patch<UserDTO>(`${environment.backendUrl}/users/${userId}/remove`, null, {})
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
    return !dto.isApproved ? ["approve"] : ["setAdmin", "remove"];
  }
}
