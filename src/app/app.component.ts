import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CIT Knowledge Base Manager';

  constructor(private authService: AuthenticationService, private router: Router) {}

  get showTabs(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/register' && this.router.url !== '/session-expired' && !this.router.url.startsWith('/confirm');
  }

  logout(): void {
    this.authService.logout();
  }
}
