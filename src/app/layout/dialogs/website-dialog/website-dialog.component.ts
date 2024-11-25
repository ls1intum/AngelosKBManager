import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudyProgram } from '../../../data/model/study-program.model';
import { BaseDialogDirective } from '../base-dialog.directive';
import { Website } from '../../../data/model/website.model';

@Component({
  selector: 'app-website-dialog',
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
  templateUrl: './website-dialog.component.html',
  styleUrls: ['./website-dialog.component.css', '../dialog-styles.css', '../../cells/study-programs-cell/study-programs-cell.component.css']
})
export class WebsiteDialogComponent extends BaseDialogDirective<Website> {
  override addData(): void {
    this.data.lastUpdated = new Date();
    this.data.actions = ['delete'];
  }
  override get canSave(): boolean {
    return (
      this.data.title?.trim() &&
      this.data.link?.trim()
    );
  }
}
