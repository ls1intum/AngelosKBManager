import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from '../../tables/main-table/main-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-actions-cell',
  standalone: true,
  imports: [
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule,
    NgForOf,
    NgFor,
  ],
  templateUrl: './actions-cell.component.html',
  styleUrls: ['./actions-cell.component.css']
})
export class ActionsCellComponent {
  actions: string[];

  constructor(
    @Inject('cellValue') public value: any,
    @Inject('cellData') private rowData: any,
    @Inject('parentComponent') private parentComponent: any
  ) {
    this.actions = value;
  }

  onAction(action: string) {
    const methodName = `on${this.capitalize(action)}`;
    if (
      this.parentComponent &&
      typeof this.parentComponent[methodName] === 'function'
    ) {
      this.parentComponent[methodName](this.rowData);
    }
  }

  getIconName(action: string): string {
    switch (action) {
      case 'edit':
        return 'edit';
      case 'delete':
        return 'delete';
      case 'refresh':
        return 'refresh';
      case 'view':
        return 'visibility';
      case 'approve':
        return 'check_circle';
      case 'setAdmin':
        return 'admin_panel_settings';
      case 'remove':
        return 'person_remove'
      default:
        return 'help';
    }
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
