import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-study-programs-cell',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    MatButtonModule,
    NgIf,
    MatMenuModule,
  ],
  templateUrl: './study-programs-cell.component.html',
  styleUrl: './study-programs-cell.component.css'
})
export class StudyProgramsCellComponent {
  @ViewChild('menuButton', { static: false }) menuButton!: MatIconButton;
  studyPrograms: StudyProgram[] = [];

  constructor(
    @Inject('cellValue') public value: any,
    @Inject('cellData') private rowData: any,
    @Inject('parentComponent') private parentComponent: any,
    @Inject('uniqueID') public uniqueID: string,
  ) {
    this.studyPrograms = [...value];
    //this.updateAvailableStudyPrograms();
  }

  onAddButtonClick() {
    const button = this.menuButton._elementRef.nativeElement;
    if (this.parentComponent && this.parentComponent.onAddStudyProgram) {
      this.parentComponent.onAddStudyProgram(this.rowData, button);
    }
  }

  removeStudyProgram(program: StudyProgram) {
    const index = this.studyPrograms.findIndex((sp) => sp.id === program.id);
    if (index > -1) {
      this.studyPrograms.splice(index, 1);
      //this.updateAvailableStudyPrograms();
      if (this.parentComponent && this.parentComponent.onRemoveStudyProgram) {
        this.parentComponent.onRemoveStudyProgram(this.rowData, program);
      }
    }
  }
}
