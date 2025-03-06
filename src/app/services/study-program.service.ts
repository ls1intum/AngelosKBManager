import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  private studyProgramsSubject = new BehaviorSubject<StudyProgram[]>([]);


  studyPrograms$: Observable<StudyProgram[]> = this.studyProgramsSubject.asObservable().pipe(
    shareReplay(1)
  );

  constructor(
    private http: HttpClient,
  ) { }

  fetchStudyPrograms(): Observable<StudyProgram[]> {
    // Return cached data if available
    if (this.studyProgramsSubject.value && this.studyProgramsSubject.value.length > 0 ) {
      return of(this.studyProgramsSubject.value);
    }

    return this.http.get<StudyProgram[]>(`${environment.backendUrl}/study-programs`).pipe(
      tap((programs) => {
        this.studyProgramsSubject.next(this.sortPrograms(programs));
      }),
      shareReplay(1)
    );
  }

  private sortPrograms(programs: StudyProgram[]): StudyProgram[] {
    return programs.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  getStudyPrograms(): StudyProgram[] {
    return this.studyProgramsSubject.value;
  }

  addStudyProgram(studyProgramName: string): Observable<StudyProgramDTO> {
    const url = `${environment.backendUrl}/study-programs/create`;
    const params = {
      studyProgramName: studyProgramName,
    };

    return this.http.post<StudyProgramDTO>(url, {}, { params }).pipe(
      tap((newProgram) => {
        const updated = [...this.studyProgramsSubject.value, newProgram] as StudyProgram[];
        this.studyProgramsSubject.next(this.sortPrograms(updated));
      })
    );
  }

  deleteStudyProgram(id: number): Observable<void> {
    const url = `${environment.backendUrl}/study-programs/${id}`;

    return this.http.delete<void>(url).pipe(
      tap(() => {
        const updatedPrograms = this.studyProgramsSubject.value.filter(sp => sp.id !== id);
        this.studyProgramsSubject.next(updatedPrograms);
      })
    );
  }

  reset(): void {
    this.studyProgramsSubject.next([]);
  }
}
