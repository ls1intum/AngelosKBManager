import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudyProgram } from '../data/model/study-program.model';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { StudyProgramDTO } from '../data/dto/study-program.dto';

@Injectable({
  providedIn: 'root',
})
export class StudyProgramService {
  private studyProgramsSubject = new BehaviorSubject<StudyProgram[] | null>(null);
  
  studyPrograms$: Observable<StudyProgram[]> = this.studyProgramsSubject.asObservable().pipe(
    filter((programs) => programs !== null),
    map((programs) => programs as StudyProgram[]),
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService // Inject AuthenticationService
  ) {}

  fetchStudyPrograms(): Observable<StudyProgram[]> {
    // Return cached data if available
    if (this.studyProgramsSubject.value) {
      return this.studyPrograms$;
    }
    
    const token = this.authService.getAccessToken(); // Get token from service

    // Prepare headers with the retrieved token, if available
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<StudyProgram[]>(`${environment.backendUrl}/api/study-programs`, { headers }).pipe(
      tap((programs) => {
        const programsCopy = (programs as StudyProgram[]).sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
  
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0; // Equal names
        });
        this.studyProgramsSubject.next(programsCopy);
      }),
      shareReplay(1)
    );
  }

  getStudyPrograms(): StudyProgram[] | null {
    return this.studyProgramsSubject.value;
  }

  addStudyProgram(studyProgramName: string): Observable<StudyProgramDTO> {
    // Fetch token for authorization
    const token = this.authService.getAccessToken();
  
    // Prepare headers with the token
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    // Backend API endpoint for creating study programs
    const url = `${environment.backendUrl}/api/study-programs/create`;
  
    // Set up query parameters
    const params = {
      studyProgramName: studyProgramName,
    };
  
    // Make the POST request
    return this.http.post<StudyProgramDTO>(url, {}, { headers, params }).pipe(
      tap((newProgram) => {
        // Update the local BehaviorSubject with the new program
        const currentPrograms = this.studyProgramsSubject.value || [];
        this.studyProgramsSubject.next([...currentPrograms, newProgram]);
      })
    );
  }
}