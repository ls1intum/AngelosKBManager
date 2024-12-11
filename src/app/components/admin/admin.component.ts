import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudyProgramService } from '../../services/study-program.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDialogModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  
  constructor(
    protected dialog: MatDialog,
    protected studyProgramService: StudyProgramService,
    @Inject(DOCUMENT) protected document: Document,
  ) {}

  ngOnInit(): void {
    this.studyProgramService.fetchStudyPrograms().subscribe({
      next: (programs) => {
        // Use the programs data as needed
        console.log('Study programs for Admin:', programs);
      },
      error: (err) => {
        console.error('Error fetching study programs for Admin:', err);
      },
    });
  }
}
