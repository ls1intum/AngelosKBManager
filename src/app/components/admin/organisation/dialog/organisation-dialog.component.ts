import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudyProgramService } from '../../../../services/study-program.service';
import { StudyProgram } from '../../../../data/model/study-program.model';
import { finalize, Observable, throwError } from 'rxjs';
import { LoadingContainerComponent } from '../../../../layout/containers/loading-container/loading-container.component';
import { BaseDialogComponent } from '../../../../layout/dialogs/base-dialog/base-dialog.component';
import { OrganisationService } from '../../../../services/organisation.service';
import { Organisation } from '../../../../data/model/organisation.model';

@Component({
  selector: 'app-study-program-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    BaseDialogComponent
  ],
  templateUrl: './organisation-dialog.component.html',
  styleUrls: [
    './organisation-dialog.component.css',
    '../../../../layout/dialogs/dialog-styles.css'
  ]
})
export class OrganisationDialogComponent {
  editMode: boolean;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<OrganisationDialogComponent>,
    private organisationService: OrganisationService,
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
    const obs$ = this.editMode
      ? this.editOrganisation(this.data)
      : this.addOrganisation(this.data.name);

    obs$.pipe(
      finalize(() => this.loading = false),
    ).subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (err) => this.dialogRef.close(null),
    });

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDialogClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  addOrganisation(name: string): Observable<Organisation> {
    return this.organisationService.addOrganisation(name);
  }

  editOrganisation(organisation: Organisation): Observable<Organisation> {
    return this.organisationService.updateOrganisation(organisation);
  }
}
