import { Component, Inject, OnInit } from '@angular/core';
import { StudyProgramFilterButtonComponent } from "../../layout/buttons/study-program-filter/study-program-filter-button.component";
import { AddButtonComponent } from "../../layout/buttons/add-button/add-button.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudyProgram } from '../../data/model/study-program.model';
import { SampleQuestion } from '../../data/model/sample-question.model';
import { TableColumn, MainTableComponent } from '../../layout/tables/main-table/main-table.component';
import { StudyProgramsCellComponent } from '../../layout/cells/study-programs-cell/study-programs-cell.component';
import { ActionsCellComponent } from '../../layout/cells/actions-cell/actions-cell.component';
import { StudyProgramService } from '../../services/study-program.service';
import { NgFor, NgIf } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { DeleteDialogComponent } from '../../layout/dialogs/delete-dialog/delete-dialog.component';
import { SampleQuestionDialogComponent } from '../../layout/dialogs/sample-question-dialog/sample-question-dialog.component';
import { GENERAL_STUDY_PROGRAM_ID } from '../../utils/utils';
import { BaseComponent } from '../base-template/base-template.component';
import { SampleQuestionService } from '../../services/sample-question.service';

@Component({
  selector: 'app-samplequestions',
  standalone: true,
  imports: [
    StudyProgramFilterButtonComponent,
    AddButtonComponent,
    MatDialogModule,
    MainTableComponent,
    NgIf,
    NgFor,
],
  templateUrl: '../base-template/base-template.component.html',
  styleUrl: '../base-template/base-template.component.css'
})
export class SampleQuestionsComponent extends BaseComponent<SampleQuestion> {
  items: SampleQuestion[] = [];
  
  headerText = "Beispielsfragen"
  addButtonText = "Beispielsfrage hinzufügen"

  constructor(
    protected override dialog: MatDialog,
    protected override studyProgramService: StudyProgramService,
    @Inject(DOCUMENT) protected override document: Document,
    private sampleQuestionService: SampleQuestionService
  ) {
    super(dialog, studyProgramService, document);
  }
  
  override fetchData(): void {
    // TODO: Use real org ID after login
    this.sampleQuestionService.getAllSampleQuestions("OrgID").subscribe(
      (sampleQuestions) => {
        this.items = sampleQuestions;  
        this.displayedItems = [...sampleQuestions];
      },
      (error) => {
        // TODO: Handle error
        console.error('Error fetching sample questions:', error);
      }
    );
  }

  columns: TableColumn<SampleQuestion>[] = [
    {
      key: 'topic',
      header: 'Thema',
      value: (sq: SampleQuestion) => sq.topic,
      primary: true,
    },
    {
      key: 'question',
      header: 'Frage',
      value: (sq: SampleQuestion) => sq.question,
    },
    {
      key: 'answer',
      header: 'Antwort',
      value: (sq: SampleQuestion) => sq.answer,
    },
    {
      key: 'studyPrograms',
      header: 'Studiengänge',
      cellComponent: StudyProgramsCellComponent,
    },
    {
      key: 'actions',
      header: '',
      cellComponent: ActionsCellComponent,
    },
  ];

  override getDialogConfig(item?: SampleQuestion | undefined): { data: any; component: any; } {
    return {
      data: {
        ...item,
        availableStudyPrograms: this.availableStudyPrograms,
        studyPrograms: item?.studyPrograms || [],
      },
      component: SampleQuestionDialogComponent
    }
  }
  override getDeleteDialogText(item: SampleQuestion): { title: string; message: string; } {
    return {
      title: 'Beispielsfrage löschen',
      message: `Sind Sie sicher, dass Sie die Beispielsfrage zu dem Thema "${item.topic}" löschen wollen?`
    }
  }

  onEdit(sampleQuestion: SampleQuestion): void {
    this.openAddOrEditDialog(sampleQuestion);
  }

}