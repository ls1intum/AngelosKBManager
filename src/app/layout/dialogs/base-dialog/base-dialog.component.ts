import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, throwError } from 'rxjs';
import { LoadingContainerComponent } from "../../containers/loading-container/loading-container.component";

@Component({
  selector: 'app-base-dialog',
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
  templateUrl: './base-dialog.component.html',
  styleUrls: [
    './base-dialog.component.css',
    '../dialog-styles.css'
  ]
})
export class BaseDialogComponent {
  /** Title to be shown in the dialog header. */
  @Input() title = '';

  /** Whether to show a loading overlay. */
  @Input() loading = false;

  /** Whether the save button is disabled. */
  @Input() disableSave = false;

  /** Text for the save (confirm) button. E.g. 'Speichern' or 'Hinzufügen'. */
  @Input() confirmButtonText = 'Speichern';

  /** Event that signals the user clicked Cancel. */
  @Output() cancel = new EventEmitter<void>();

  /** Event that signals the user clicked Save. */
  @Output() save = new EventEmitter<void>();

  constructor(
    private dialogRef: MatDialogRef<BaseDialogComponent>
  ) { }

  onSaveClicked() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onContainerClick() {
    // If you actually want to close if user clicks outside, do so here
    // But be consistent with your desired UX.
    // E.g., this.dialogRef.close();
  }

  onDialogClicked(event: MouseEvent) {
    // Prevent click on the dialog from closing
    event.stopPropagation();
  }
}
