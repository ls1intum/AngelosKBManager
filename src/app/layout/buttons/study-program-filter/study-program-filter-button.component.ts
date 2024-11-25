import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatIconModule } from '@angular/material/icon'
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-study-program-filter',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatIconModule
  ],
  templateUrl: './study-program-filter-button.component.html',
  styleUrl: './study-program-filter-button.component.css'
})
export class StudyProgramFilterButtonComponent {
  @Input() studyPrograms: StudyProgram[] = [];
  @Input() selectedProgram: StudyProgram | null = null;
  @Output() programSelected = new EventEmitter<StudyProgram | null>();
  
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  clearSelection() {
    this.selectedProgram = null;
    this.programSelected.emit(null); 
    this.dropdownOpen = false;
  }

  selectProgram(program: StudyProgram) {
    this.selectedProgram = program;
    this.programSelected.emit(program);
    this.dropdownOpen = false;
  }
}
