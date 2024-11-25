import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-refresh-cell',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './refresh-cell.component.html',
  styleUrl: './refresh-cell.component.css'
})
export class RefreshCellComponent {
  date: string

  constructor(
    @Inject('cellValue') public value: any,
    @Inject('cellData') public rowData: any,
    @Inject('parentComponent') private parentComponent: any
  ) {
    this.date = value.toLocaleDateString();
  }
  
  refreshRow() {
    if (this.parentComponent && this.parentComponent.onRefresh) {
      this.parentComponent.onRefresh(this.rowData);
    }
  }
}
