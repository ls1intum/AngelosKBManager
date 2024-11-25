import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SampleQuestion } from '../data/model/sample-question.model';

@Injectable({
  providedIn: 'root',
})
export class SampleQuestionService {
  private sampleQuestions: SampleQuestion[] = [
    {
      id: "1",
      topic: "Studienrichtungswechsel im Masterstudiengang Informatik",
      question: "Ich bin Masterstudent im 6. Semester Informatik und möchte in den Studiengang Informatik: Games Engineering wechseln. Gibt es Einschränkungen beim Studiengangswechsel, wie ist die Frist und welche Unterlagen muss ich vorbereiten?",
      answer: "Um den Studiengang zu wechseln, müssen Sie sich regulär innerhalb der Bewerbungsfrist für den neuen Studiengang bewerben. Die Bewerbungsfrist für Masterstudiengänge endet am 30. November 2024, für den Studienbeginn im Sommersemester 2025. Sie müssen alle erforderlichen Bewerbungsunterlagen vorbereiten.",
      created: new Date('2024-09-15'),
      studyPrograms: [],
      actions: ['edit', 'delete'],
    },
    {
      id: "2",
      topic: "Thema: Ausstellung der Abschlussdokumente und Credits",
      question: "Wann kann ich mit der Ausstellung meiner Abschlussdokumente rechnen und wo kann ich festlegen, welche Credits verwendet werden, nachdem ich 182 Credits erreicht habe?",
      answer: "Sobald die letzte Note in TUMonline gültig ist, können Sie sich an Ihre Schriftführerin wenden, damit diese Ihr Zeugnis für Sie beantragt.",
      created: new Date('2024-09-15'),
      studyPrograms: [],
      actions: ['edit', 'delete'],
    },
    {
      id: "3",
      topic: "Urlaubssemester und Wiederholungsprüfungen",
      question: "Ich habe eine Zusage für ein Praktikum erhalten und möchte für das kommende Semester ein Urlaubssemester beantragen. Ist es möglich, während eines Urlaubssemesters die Klausuren von Modulen zu schreiben, die ich in der Vergangenheit nicht bestanden habe, insbesondere die Retake Klausur von einem bestimmten Modul?",
      answer: "Den Antrag für ein Urlaubssemester können Sie bis zum 1. Vorlesungstag einreichen. Sie benötigen eine Stellungnahme der Studienfachberatung und sollten die entsprechenden Dokumente zusenden. während des Urlaubssemesters können Sie nur Prüfungen, bei denen Sie zuvor durchgefallen sind, wiederholen. Haben Sie die Retake Klausur in diesem Semester bereits geschrieben und welche Fächer planen Sie im Wintersemester?",
      created: new Date('2024-09-15'),
      studyPrograms: [
        { id: '6', name: 'Bachelor Mathematik' },
        { id: '7', name: 'Bachelor Wirtschaftsinformatik' },
        { id: '8', name: 'Master Bioinformatik' },
      ],
      actions: ['edit', 'delete'],
    },
  ];

  constructor() {}

  getAllSampleQuestions(orgID: string): Observable<SampleQuestion[]> {
    console.log(`Simulating API call for organization ID: ${orgID}`);
    // Simulate a 200ms delay to mimic an API call
    return of(this.sampleQuestions).pipe(delay(200));
  }
}