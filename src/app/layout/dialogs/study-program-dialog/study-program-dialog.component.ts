import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudyProgramService } from '../../../services/study-program.service';
import { BaseDialogDirective } from '../base-dialog.directive';
import { StudyProgram } from '../../../data/model/study-program.model';
import { Observable, throwError } from 'rxjs';
import { LoadingContainerComponent } from "../../containers/loading-container/loading-container.component";

@Component({
  selector: 'app-study-program-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    LoadingContainerComponent,
    NgIf
],
  templateUrl: './study-program-dialog.component.html',
  styleUrls: [
    './study-program-dialog.component.css', 
    '../dialog-styles.css'
  ]
})
export class StudyProgramDialogComponent {
  editMode: boolean;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<StudyProgramDialogComponent>,
    private studyProgramService: StudyProgramService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.editMode = !!data.id;
    this.loading = false;
  }

  get canSave(): boolean {
    return !!this.data.name?.trim();
  }

  onSave(): void {
    this.loading = true;

    if (this.editMode) {
      this.makeEditRequest(this.data.name).subscribe({
        next: (updatedItem) => {
          this.loading = false;
          this.dialogRef.close(updatedItem);
        },
        error: (err) => {
          this.loading = false;
          this.dialogRef.close(null);
        }
      });
    } else {
      this.makeAddRequest(this.data.name).subscribe({
        next: (newItem) => {
          this.loading = false;
          this.dialogRef.close(newItem);
        },
        error: (err) => {
          this.loading = false;
          this.dialogRef.close(null);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDialogClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * Called when saving a new study program
   */
  makeAddRequest(name: string): Observable<StudyProgram> {
    return this.studyProgramService.addStudyProgram(name, this.data.token);
  }

  /**
   * TODO
   * Called when editing an existing study program
   */
  makeEditRequest(data: string): Observable<StudyProgram> {
    return throwError(() => new Error('makeEditRequest is not implemented.'));
  }
}
