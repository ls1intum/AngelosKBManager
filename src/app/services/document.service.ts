import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentModel } from '../data/model/document.model';
import { DocumentDataDTO } from '../data/dto/document-data.dto';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { DocumentRequestDTO } from '../data/dto/document-request.dto';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Fetch all documents metadata for the organization.
   */
  getAllDocuments(): Observable<DocumentModel[]> {
    const headers = this.createAuthHeaders();
    return this.http
      .get<DocumentDataDTO[]>(`${environment.backendUrl}/api/documents`, { headers })
      .pipe(
        map((response: DocumentDataDTO[]) => this.transformResponse(response))
      );
  }

  /**
   * Fetch a single document by ID as a PDF Blob.
   */
  getDocumentById(documentId: string): Observable<Blob> {
    const headers = this.createAuthHeaders();
    return this.http.get(`${environment.backendUrl}/api/documents/${documentId}/download`, {
      headers,
      responseType: 'blob',
    });
  }

  /**
   * Edit a document's title and study programs.
   */
  editDocument(docId: string, documentRequest: DocumentRequestDTO): Observable<DocumentModel> {
    const headers = this.createAuthHeaders();
    return this.http
      .put<DocumentDataDTO>(`${environment.backendUrl}/api/documents/${docId}`, documentRequest, { headers })
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Add a new document with metadata (JSON) and PDF file.
   */
  addDocument(documentRequest: DocumentRequestDTO, file: File): Observable<DocumentModel> {
    const headers = this.createAuthHeaders();

    const formData = new FormData();
    // Add the JSON metadata. We must stringify it since `@RequestPart` expects JSON.
    formData.append('documentRequestDTO', new Blob([JSON.stringify(documentRequest)], { type: 'application/json' }));
    formData.append('file', file, file.name);

    return this.http
      .post<DocumentDataDTO>(`${environment.backendUrl}/api/documents`, formData, { headers })
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Delete a document by ID.
   */
  deleteDocument(docId: string): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${environment.backendUrl}/api/documents/${docId}`, { headers });
  }

  /**
   * Transform a list of responses.
   */
  private transformResponse(response: DocumentDataDTO[]): DocumentModel[] {
    return response.map((dto) => this.transformSingleResponse(dto));
  }

  /**
   * Transform a single DTO to a DocumentModel.
   */
  private transformSingleResponse(dto: DocumentDataDTO): DocumentModel {
    return {
      id: dto.id,
      title: dto.title,
      uploaded: new Date(dto.createdAt),
      studyPrograms: dto.studyPrograms.map((sp) => ({
        id: sp.id,
        name: sp.name,
      })),
      actions: ['view', 'edit', 'delete'],
    };
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