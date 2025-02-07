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
  ) { }

  fetchStudyPrograms(): Observable<StudyProgram[]> {
    // Return cached data if available
    if (this.studyProgramsSubject.value) {
      return this.studyPrograms$;
    }


    return this.http.get<StudyProgram[]>(`${environment.backendUrl}/study-programs`).pipe(
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
    const url = `${environment.backendUrl}/study-programs/create`;
    const params = {
      studyProgramName: studyProgramName,
    };

    return this.http.post<StudyProgramDTO>(url, {}, { params }).pipe(
      tap((newProgram) => {
        const currentPrograms = this.studyProgramsSubject.value || [];
        this.studyProgramsSubject.next([...currentPrograms, newProgram]);
      })
    );
  }

  deleteStudyProgram(id: number): Observable<void> {
    const url = `${environment.backendUrl}/study-programs/${id}`;

    return this.http.delete<void>(url).pipe(
      tap(() => {
        const currentPrograms = this.studyProgramsSubject.value || [];
        const updatedPrograms = currentPrograms.filter(sp => sp.id !== id);
        this.studyProgramsSubject.next(updatedPrograms);
      })
    );
  }

  reset(): void {
    this.studyProgramsSubject.next(null);
  }
}