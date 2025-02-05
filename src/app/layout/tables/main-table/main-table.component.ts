import { CommonModule, NgClass, NgComponentOutlet, NgFor, NgForOf, NgIf } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, Injector, Input, OnChanges, SimpleChanges, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { ActionsCellComponent } from '../../cells/actions-cell/actions-cell.component';
import { StudyProgramsCellComponent } from '../../cells/study-programs-cell/study-programs-cell.component';
import { LinkCellComponent } from '../../cells/link-cell/link-cell.component';
import { StudyProgram } from '../../../data/model/study-program.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    NgClass,
    MatPaginatorModule
  ],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.css'
})
export class MainTableComponent<T> implements AfterViewInit, OnChanges {
  @Input() dataSource: T[] = [];

  matDataSource = new MatTableDataSource<T>();

  @Input() columns: TableColumn<T>[] = [];
  @Input() parentComponent: any;
  @Input() availableStudyPrograms: StudyProgram[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && changes['dataSource'].currentValue) {
      this.matDataSource.data = changes['dataSource'].currentValue;
    }
  }

  ngAfterViewInit(): void {
    this.matDataSource.paginator = this.paginator;
  }
}

export interface TableColumn<T> {
  key: keyof T & string;
  header: string;
  value?: (row: T) => string | number | boolean;
  cellComponent?: Type<any>;
  primary?: boolean;
}
