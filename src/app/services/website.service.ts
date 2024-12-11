import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Website } from '../data/model/website.model';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { WebsiteResponseDTO } from '../data/dto/website-response.dto';
import { WebsiteRequestDTO } from '../data/dto/website-request.dto';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Fetch all websites.
   */
  getAllWebsites(): Observable<Website[]> {
    const token = this.authService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .get<WebsiteResponseDTO[]>(`${environment.backendUrl}/api/websites`, { headers })
      .pipe(
        map((response) => this.transformResponse(response))
      );
  }

  /**
   * Add a new website.
   */
  addWebsite(request: WebsiteRequestDTO): Observable<Website> {
    const token = this.authService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .post<WebsiteResponseDTO>(`${environment.backendUrl}/api/websites`, request, { headers })
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Edit an existing website by ID.
   */
  editWebsite(websiteId: number, request: WebsiteRequestDTO): Observable<Website> {
    const token = this.authService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .put<WebsiteResponseDTO>(`${environment.backendUrl}/api/websites/${websiteId}`, request, { headers })
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Delete a website by ID.
   */
  deleteWebsite(websiteId: number): Observable<void> {
    const token = this.authService.getAccessToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete<void>(`${environment.backendUrl}/api/websites/${websiteId}`, { headers });
  }

  /**
   * Transform multiple responses.
   */
  private transformResponse(response: WebsiteResponseDTO[]): Website[] {
    return response.map((dto) => this.transformSingleResponse(dto));
  }

  /**
   * Transform a single response.
   */
  private transformSingleResponse(dto: WebsiteResponseDTO): Website {
    return {
      id: dto.id,
      title: dto.title,
      link: dto.link,
      lastUpdated: new Date(dto.lastUpdated),
      studyPrograms: dto.studyPrograms.map((sp) => ({
        id: sp.id,
        name: sp.name,
      })),
      actions: ['delete'], // Add actions manually
    };
  }
}