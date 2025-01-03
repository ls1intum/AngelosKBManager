import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { MailService, MailStatus } from './services/mail.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CIT Knowledge Base Manager';
  mailStatus: MailStatus | null = null;

  constructor(
    private authService: AuthenticationService,
    private mailService: MailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.mailService.fetchMailStatus();
    this.mailService.mailStatus$.subscribe((status) => {
      this.mailStatus = status;
    });
  }

  get showTabs(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/register' && this.router.url !== '/session-expired' && !this.router.url.startsWith('/confirm');
  }

  get showWarnIcon(): boolean {
    return (this.mailStatus === MailStatus.ERROR || this.mailStatus == MailStatus.INACTIVE);
  }

  logout(): void {
    this.authService.logout();
  }
}
