import { CommonModule, NgClass, NgComponentOutlet, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, Injector, Input, TemplateRef, Type } from '@angular/core';
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { ActionsCellComponent } from '../../cells/actions-cell/actions-cell.component';
import { StudyProgramsCellComponent } from '../../cells/study-programs-cell/study-programs-cell.component';
import { LinkCellComponent } from '../../cells/link-cell/link-cell.component';
import { StudyProgram } from '../../../data/model/study-program.model';

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    NgForOf,
    CommonModule,
    MatCardModule,
    NgComponentOutlet,
    NgClass
  ],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.css'
})
export class MainTableComponent<T> {
  @Input() dataSource: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() parentComponent: any;
  @Input() availableStudyPrograms: StudyProgram[] = [];

  get displayedColumns(): string[] {
    return this.columns.map(column => column.key as string);
  }

  constructor(private injector: Injector) {}

  createInjector(element: T, column: TableColumn<T>): Injector {
    const rowIndex = this.dataSource.indexOf(element);
    const uniqueID = `sp-add-${rowIndex}`;
  
    return Injector.create({
      providers: [
        { provide: 'cellData', useValue: element },
        { provide: 'cellValue', useValue: column.value ? column.value(element) : element[column.key] },
        { provide: 'parentComponent', useValue: this.parentComponent },
        { provide: 'uniqueID', useValue: uniqueID },
      ],
      parent: this.injector,
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }
}

export interface TableColumn<T> {
  key: keyof T & string;
  header: string;
  value?: (row: T) => string | number | boolean;
  cellComponent?: Type<any>;
  primary?: boolean;
}
