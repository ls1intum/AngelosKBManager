import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-mail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './confirm-mail.component.html',
  styleUrl: './confirm-mail.component.css'
})
export class ConfirmMailComponent {
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.isLoading = false;
      this.errorMessage = 'Ungültiger Bestätigungslink.';
      return;
    }

    this.userService.confirmEmail(token).subscribe({
      next: (message) => {
        this.isLoading = false;
        this.successMessage = 'Ihre E-Mail wurde erfolgreich bestätigt. Ihr Zugang wird aktiviert, sobald ein Administrator Ihrer Organisation ihn genehmigt hat.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Leider ist der Bestätigungslink ungültig oder abgelaufen.';
      }
    });
  }
}
