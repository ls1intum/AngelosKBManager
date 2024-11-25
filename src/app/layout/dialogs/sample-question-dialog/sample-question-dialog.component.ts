import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { SampleQuestion } from '../../../data/model/sample-question.model';
import { BaseDialogDirective } from '../base-dialog.directive';

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
  override addData(): void {
    this.data.created = new Date();
    this.data.actions = ['edit', 'delete'];
  }

  override get canSave(): boolean {
    return (
      this.data.topic?.trim() &&
      this.data.question?.trim() &&
      this.data.answer?.trim()
    );
  }
}
