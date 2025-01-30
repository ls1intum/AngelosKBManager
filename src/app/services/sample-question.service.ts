import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SampleQuestion } from '../data/model/sample-question.model';
import { SampleQuestionDTO } from '../data/dto/sample-question.dto';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SampleQuestionService {
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Fetch all sample questions.
   */
  getAllSampleQuestions(): Observable<SampleQuestion[]> {
    return this.http
      .get<SampleQuestionDTO[]>(`${environment.backendUrl}/sample-questions`, {})
      .pipe(
        map((response: SampleQuestionDTO[]) => this.transformResponse(response))
      );
  }

  /**
   * Add a new sample question.
   */
  addSampleQuestion(request: SampleQuestionDTO): Observable<SampleQuestion> {
    return this.http
      .post<SampleQuestionDTO>(`${environment.backendUrl}/sample-questions`, request, {})
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Edit an existing sample question.
   */
  editSampleQuestion(sampleQuestionId: string, request: SampleQuestionDTO): Observable<SampleQuestion> {
    return this.http
      .put<SampleQuestionDTO>(`${environment.backendUrl}/sample-questions/${sampleQuestionId}`, request, {})
      .pipe(
        map((dto) => this.transformSingleResponse(dto))
      );
  }

  /**
   * Delete a sample question by ID.
   */
  deleteSampleQuestion(sampleQuestionId: string): Observable<void> {
    return this.http.delete<void>(`${environment.backendUrl}/sample-questions/${sampleQuestionId}`, {});
  }

  /**
   * Transform a list of responses.
   */
  private transformResponse(response: SampleQuestionDTO[]): SampleQuestion[] {
    return response.map((dto) => this.transformSingleResponse(dto));
  }

  /**
   * Transform a single response.
   */
  private transformSingleResponse(dto: SampleQuestionDTO): SampleQuestion {
    return {
      id: dto.id,
      topic: dto.topic,
      question: dto.question,
      answer: dto.answer,
      studyPrograms: dto.studyPrograms.map((sp) => ({
        id: sp.id,
        name: sp.name,
      })),
      actions: ['edit', 'delete'], // Add default actions
    };
  }
}