import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Website } from '../data/model/website.model';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  private websites: Website[] = [
    {
      id: '1',
      title: 'Studium im Ausland',
      link: 'https://www.cit.tum.de/cit/studium/internationales/informatics-outgoing/studium-im-ausland/',
      lastUpdated: new Date('2023-09-15'),
      studyPrograms: [],
      actions: ['delete'],
    },
    {
      id: '2',
      title: 'Studienpläne Master Informatik',
      link: 'https://www.cit.tum.de/cit/studium/studiengaenge/master-informatik/studienplaene/',
      lastUpdated: new Date('2023-09-10'),
      studyPrograms: [
        { id: '14', name: 'Master Informatik' },
      ],
      actions: ['delete'],
    },
    {
      id: '3',
      title: 'Subject-specific Advice Electrical and Computer Engineering',
      link: 'https://www.cit.tum.de/en/cit/studies/students/advising/electrical-computer-engineering/',
      lastUpdated: new Date('2023-08-25'),
      studyPrograms: [
        { id: '2', name: 'Bachelor Elektrotechnik Informationstechnik' },
        { id: '13', name: 'Master Elektrotechnik Informationstechnik' },
      ],
      actions: ['delete'],
    },
  ];

  getAllWebsites(orgID: string): Observable<Website[]> {
    console.log(`Simulating API call for orgID: ${orgID}`);
    return of(this.websites).pipe(delay(200)); // Simulate a 200ms API delay
  }
}