import { Directive, Inject, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { StudyProgram } from '../../data/model/study-program.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { BaseItem } from '../../data/model/base-item.model';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appBaseDialog]',
  standalone: true
})
export abstract class BaseDialogDirective<T extends BaseItem> {
  abstract get canSave(): boolean;

  protected abstract makeAddRequest(data: T): Observable<T>;
  protected abstract makeEditRequest(data: T): Observable<T>;

  @ViewChild('menuButton', { static: false }) menuButton!: MatIconButton;

  menuOpen = false;
  documentHeight = 0;
  menuPosition = { top: 0, left: 0, openUpwards: true };
  studyProgramsCopy: StudyProgram[] = [];
  availableStudyPrograms: StudyProgram[] = [];
  studyProgramsToAdd: StudyProgram[] = [];

  editMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<BaseDialogDirective<T>>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) protected document: Document,
  ) {
    this.editMode = !!data.id;
    this.availableStudyPrograms = data.availableStudyPrograms || [];
    this.studyProgramsCopy = [...data.studyPrograms];
  }

  ngOnInit(): void {
    if (this.document) {
      this.documentHeight = this.document.documentElement.scrollHeight;
    }
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    const buttonPosition = this.menuButton._elementRef.nativeElement.getBoundingClientRect();
    const middleY = window.innerHeight / 2;

    if (this.menuOpen) {
      this.closeMenu();
      return;
    }

    this.menuPosition = {
      top: buttonPosition.bottom + window.scrollY,
      left: buttonPosition.left + window.scrollX,
      openUpwards: buttonPosition.bottom > middleY,
    };
    
    const assignedIds = this.studyProgramsCopy
      ? this.studyProgramsCopy.map((sp: StudyProgram) => sp.id)
      : [];

    this.studyProgramsToAdd = this.availableStudyPrograms.filter(
      (sp) => !assignedIds.includes(sp.id)
    );

    this.menuOpen = true;
  }

  addStudyProgram(sp: StudyProgram) {
    this.studyProgramsCopy.push(sp);
    this.closeMenu()
  }

  removeStudyProgram(sp: StudyProgram) {
    this.studyProgramsCopy = this.studyProgramsCopy.filter(
      (program: StudyProgram) => program.id !== sp.id
    );
    this.availableStudyPrograms.push(sp);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.data.studyPrograms = [...this.studyProgramsCopy];

    if (this.editMode) {
      this.makeEditRequest(this.data).subscribe({
        next: (updatedItem) => {
          this.dialogRef.close(updatedItem);
        },
        error: (err) => {
          this.dialogRef.close(null);
        }
      });
    } else {
      this.makeAddRequest(this.data).subscribe({
        next: (newItem) => {
          this.dialogRef.close(newItem);
        },
        error: (err) => {
          console.log("closing with null")
          this.dialogRef.close(null);
        }
      });
    }
  }

  onDialogClicked(event: MouseEvent) {
    event.stopPropagation();
    this.closeMenu();
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuPosition = { top: 0, left: 0, openUpwards: false };
  }
}
