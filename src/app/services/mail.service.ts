import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MailStatusDTO } from '../data/dto/mail-status.dto';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { MailCredentialsDTO } from '../data/dto/mail-credentials.dto';
import { MailCredentialsResponseDTO } from '../data/dto/mail-credentials-response.dto';

export enum MailStatus {
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR',
  INACTIVE = 'INACTIVE'
}

@Injectable({
  providedIn: 'root' // ensures a singleton service across the app
})
export class MailService {
  private mailStatusSubject = new BehaviorSubject<MailStatus | null>(null);
  public mailStatus$ = this.mailStatusSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  /**
   * Fetch mail pipeline status from server
   */
  fetchMailStatus(): void {
    const headers = this.createAuthHeaders();

    this.http.get<MailStatusDTO>(`${environment.backendUrl}/mail/status`, { headers })
      .subscribe({
        next: (response) => {
          // Next the value into the subject to update subscribers
          console.log("MAIL STATUS RESPONSE", response);
          this.mailStatusSubject.next(response.status);
        },
        error: (error) => {
          console.error('Error fetching mail status', error);
          this.mailStatusSubject.next(MailStatus.ERROR);
        }
      });
  }

  setMailCredentials(account: string, password: string): Observable<void> {
    const headers = this.createAuthHeaders().set('Content-Type', 'application/json');

    const credentials : MailCredentialsDTO = {
      mailAccount: account,
      mailPassword: password
    };
    console.log("headers sent to backend", headers);
    console.log("credentials being sent to backend:", credentials);
  
    return this.http.post<void>(
      `${environment.backendUrl}/mail/set-credentials`,
      credentials,
      { headers }
    );
  }

  getMailCredentials(): Observable<MailCredentialsResponseDTO> {
    const headers = this.createAuthHeaders();

    return this.http.get<MailCredentialsResponseDTO>(
      `${environment.backendUrl}/mail/credentials`,
      { headers }
    );
  }

  setMailStatus(status: MailStatus): void {
    this.mailStatusSubject.next(status);
  }

  public getCurrentMailStatus(): MailStatus | null {
    return this.mailStatusSubject.value;
  }

  /**
   * Create headers with the Authorization token if available.
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