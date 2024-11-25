import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { StudyProgramService } from './services/study-program.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CIT Knowledge Base Manager';

  constructor(private studyProgramService: StudyProgramService) {}

  ngOnInit(): void {
    this.studyProgramService.fetchStudyPrograms().subscribe(() => {
      console.log('Study programs pre-fetched on application startup.');
    });
  }
}
