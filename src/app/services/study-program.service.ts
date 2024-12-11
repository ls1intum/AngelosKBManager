import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudyProgram } from '../data/model/study-program.model';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';

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
      console.log('Returning cached study programs.');
      return this.studyPrograms$;
    }

    console.log('Fetching study programs from the backend...');
    
    const token = this.authService.getAccessToken(); // Get token from service

    // Prepare headers with the retrieved token, if available
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<StudyProgram[]>(`${environment.backendUrl}/api/study-programs`, { headers }).pipe(
      tap((programs) => {
        this.studyProgramsSubject.next(programs);
      }),
      shareReplay(1)
    );
  }

  getStudyPrograms(): StudyProgram[] | null {
    return this.studyProgramsSubject.value;
  }
}