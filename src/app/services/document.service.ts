import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DocumentModel } from '../data/model/document.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documents: DocumentModel[] = [
    {
      id: '1',
      title: 'Allgemeine Prüfungs- und Studienordnung',
      uploaded: new Date('2023-10-01'),
      studyPrograms: [],
      actions: ['view', 'edit', 'delete'],
    },
    {
      id: '2',
      title: 'Fachprüfungs- und Studienordnung des Studiengangs Information Systems',
      uploaded: new Date('2023-09-15'),
      studyPrograms: [
        { id: '17', name: 'Master Information Systems' },
      ],
      actions: ['view', 'edit', 'delete'],
    },
  ]

  constructor(private http: HttpClient) {}

  getAllDocuments(orgID: string): Observable<DocumentModel[]> {
    // TODO: Implement real method
    // Simulate fetching metadata
    return of(this.documents).pipe(delay(200));
  }

  getDocumentById(documentId: string): Observable<Blob> {
    // TODO: Implement real method
    const documentFilePaths: Record<string, string> = {
      '1': 'assets/example.PDF',
      '2': 'assets/ISMsc_FPSO_28.03.2024.PDF',
    };  
    const filePath = documentFilePaths[documentId];
  
    if (filePath) {
      // Simulate fetching a real PDF from assets
      return this.http.get(filePath, { responseType: 'blob' }).pipe(delay(200));
    } else {
      // Simulate returning an empty placeholder PDF
      console.log('No file path found. Returning placeholder PDF.');
      const simulatedPdfBlob = new Blob(['%PDF-1.4\n%...'], { type: 'application/pdf' });
      return of(simulatedPdfBlob).pipe(delay(200));
    }
  }
}