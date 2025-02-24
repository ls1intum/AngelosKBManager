import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MailService } from '../../services/mail.service';
import { map, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthenticationService,
    private mailService: MailService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onLogin() {
    this.authService.login(this.email, this.password).pipe(
      switchMap(() =>
        this.authService.getAccessToken().pipe(
          map(token => {
            if (!token) {
              throw new Error('No access token available');
            }
            return token;
          })
        )
      ),
      tap(token => this.mailService.fetchMailStatus(token))
    ).subscribe({
      next: () => {
        this.router.navigate(['/websites']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.snackBar.open(
          'Login fehlgeschlagen. Bitte stellen Sie sicher, dass Ihre E-Mail-Adresse bestätigt ist, Ihr Passwort korrekt ist und Ihr Konto von einem Administrator freigegeben wurde.',
          'Schließen', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snack-bar'],
        }
        );
      }
    });
  }
}
