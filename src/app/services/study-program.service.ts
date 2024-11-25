import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, filter, first, map, shareReplay, tap } from 'rxjs/operators';
import { StudyProgram } from '../data/model/study-program.model';

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

  constructor() {}

  // Fetch programs only if they are not already fetched
  fetchStudyPrograms(): Observable<StudyProgram[]> {
    if (this.studyProgramsSubject.value) {
      console.log('Returning cached study programs.');
      return this.studyPrograms$;
    }

    console.log('Fetching study programs from the simulated backend...');
    return of(this.getMockStudyPrograms()).pipe(
      delay(200),
      tap((programs) => {
        this.studyProgramsSubject.next(programs);
      }),
      shareReplay(1)
    );
  }

  // Synchronous access to cached data
  getStudyPrograms(): StudyProgram[] | null {
    return this.studyProgramsSubject.value;
  }

  // Mock data
  private getMockStudyPrograms(): StudyProgram[] {
    return [
      { id: '1', name: 'Bachelor Bioinformatik' },
      { id: '2', name: 'Bachelor Elektrotechnik Informationstechnik' },
      { id: '3', name: 'Bachelor Informatik' },
      { id: '4', name: 'Bachelor Informatik Games Engineering' },
      { id: '5', name: 'Bachelor Information Engineering' },
      { id: '6', name: 'Bachelor Mathematik' },
      { id: '7', name: 'Bachelor Wirtschaftsinformatik' },
      { id: '8', name: 'Master Bioinformatik' },
      { id: '9', name: 'Master Biomedical Computing' },
      { id: '10', name: 'Master Communications Electronics Engineering' },
      { id: '11', name: 'Master Computational Science Engineering' },
      { id: '12', name: 'Master Data Engineering Analytics' },
      { id: '13', name: 'Master Elektrotechnik Informationstechnik' },
      { id: '14', name: 'Master Informatik' },
      { id: '15', name: 'Master Informatik Games Engineering' },
      { id: '16', name: 'Master Information Engineering' },
      { id: '17', name: 'Master Information Systems' },
      { id: '18', name: 'Master Mathematical Finance Actuarial Science' },
      { id: '19', name: 'Master Mathematics Data Science' },
      { id: '20', name: 'Master Mathematics Operations Research' },
      { id: '21', name: 'Master Mathematics Science Engineering' },
      { id: '22', name: 'Master Mathematik' },
      { id: '23', name: 'Master Robotics Cognition Intelligence' },
      { id: '24', name: 'Neuroengineering' },
      { id: '25', name: 'TopMath' },
    ];
  }
}