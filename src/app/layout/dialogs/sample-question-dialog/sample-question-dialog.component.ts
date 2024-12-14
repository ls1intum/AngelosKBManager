import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, inject, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { SampleQuestion } from '../../../data/model/sample-question.model';
import { BaseDialogDirective } from '../base-dialog.directive';
import { SampleQuestionService } from '../../../services/sample-question.service';
import { SampleQuestionDTO } from '../../../data/dto/sample-question.dto';
import { Observable } from 'rxjs';
import { StudyProgramDTO } from '../../../data/dto/study-program.dto';

@Component({
  selector: 'app-sample-question-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './sample-question-dialog.component.html',
  styleUrls: ['./sample-question-dialog.component.css', '../dialog-styles.css', '../../cells/study-programs-cell/study-programs-cell.component.css']
})
export class SampleQuestionDialogComponent extends BaseDialogDirective<SampleQuestion> {
  
  private sampleQuestionService = inject(SampleQuestionService)

  override get canSave(): boolean {
    return (
      this.data.topic?.trim() &&
      this.data.question?.trim() &&
      this.data.answer?.trim()
    );
  }

  protected makeAddRequest(data: SampleQuestion): Observable<SampleQuestion> {
    return this.sampleQuestionService.addSampleQuestion(this.createDTO(data, false));
  }

  protected makeEditRequest(data: SampleQuestion): Observable<SampleQuestion> {
    return this.sampleQuestionService.editSampleQuestion(data.id, this.createDTO(data, false));
  }

  private createDTO(data: SampleQuestion, add: boolean): SampleQuestionDTO {
    const dto: SampleQuestionDTO = {
      id: add ? -1 : data.id, // Placeholder for add request (ID does not exist yet)
      topic: data.topic,
      question: data.question,
      answer: data.answer,
      studyPrograms: data.studyPrograms.map(this.toSPDTO),
    }
    return dto;
  }

  private toSPDTO(sp: StudyProgram): StudyProgramDTO {
    return {
      id: sp.id,
      name: sp.name,
    };
  }
}
