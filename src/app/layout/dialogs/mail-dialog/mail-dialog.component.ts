import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoadingContainerComponent } from '../../containers/loading-container/loading-container.component';
import { NgIf } from '@angular/common';
import { MailService } from '../../../services/mail.service';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-mail-dialog',
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
  templateUrl: './mail-dialog.component.html',
  styleUrls: [
    './mail-dialog.component.css',
    '../dialog-styles.css'
  ]
})
export class MailDialogComponent {
  editMode: boolean;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<MailDialogComponent>,
    private mailService: MailService,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editMode = !!data.mailAccount; 
    this.loading = false;
  }

  /**
   * Validate email and password fields
   */
  get canSave(): boolean {
    return (
      this.isValidEmail(this.data.mailAccount) &&
      this.data.password &&
      this.data.confirmPassword &&
      this.data.password === this.data.confirmPassword
    );
  }

  onSave(): void {
    this.loading = true;

    this.setMailCredentials(this.data.mailAccount, this.data.password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.dialogRef.close(this.data.mailAccount); 
        },
        error: (err) => {
          this.loading = false;
          this.dialogRef.close(false);
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDialogClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  setMailCredentials(mail: string, password: string): Observable<void> {
    return this.mailService.setMailCredentials(mail, password, this.authService.getAccessToken());
  }

  /**
   * Basic email validation. 
   * Replace with your own logic if needed.
   */
  private isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email?.trim());
  }
}
