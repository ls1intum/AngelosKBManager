import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar-filter',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    NgFor
  ],
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.css'
})
export class SidebarFilterComponent {
  @Input() studyPrograms: StudyProgram[] = [];
  @Input() selectedProgram: StudyProgram | null = null;
  @Output() programSelected = new EventEmitter<StudyProgram | null>();

  // Whether the "Studiengänge" dropdown is open
  isStudiengaengeOpen = true;

  /**
   * Toggle the visibility of the "Studiengänge" filter section.
   */
  toggleStudiengaenge(): void {
    this.isStudiengaengeOpen = !this.isStudiengaengeOpen;
  }

  /**
   * Emit the selected program to the parent
   */
  selectProgram(program: StudyProgram): void {
    this.programSelected.emit(program);
  }

  /**
   * Emit null to clear any selected filter
   */
  clearFilter(): void {
    this.programSelected.emit(null);
  }
}
