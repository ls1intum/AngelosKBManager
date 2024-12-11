import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { StudyProgramService } from './services/study-program.service';
import { NgIf } from '@angular/common';

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

  constructor(private studyProgramService: StudyProgramService, private router: Router) {}

  get showTabs(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/register';
  }
}
