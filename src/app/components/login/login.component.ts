import { Component, NgModule } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormControl, FormControlDirective, FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthenticationService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Login successful');
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
