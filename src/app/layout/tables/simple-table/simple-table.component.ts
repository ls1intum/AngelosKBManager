import { CommonModule, NgClass, NgComponentOutlet, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Injector, Input, Output, TemplateRef, Type } from '@angular/core';
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { ActionsCellComponent } from '../../cells/actions-cell/actions-cell.component';
import { StudyProgramsCellComponent } from '../../cells/study-programs-cell/study-programs-cell.component';
import { LinkCellComponent } from '../../cells/link-cell/link-cell.component';
import { StudyProgram } from '../../../data/model/study-program.model';

@Component({
  selector: 'simple-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgFor,
    NgForOf,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.css'
})
export class SimpleTableComponent<T> {

  @Input() dataSource: T[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() columnHeaders: { [key: string]: string } = {};
  @Output() rowClicked = new EventEmitter<T>();

  protected onRowClick(row: T) {
    this.rowClicked.emit(row);
  }
}