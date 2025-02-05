import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();

  override itemsPerPageLabel = 'Elemente pro Seite:';  // Change this text
  override nextPageLabel = 'Nächste';
  override previousPageLabel = 'Vorherige';
  override firstPageLabel = 'Erste';
  override lastPageLabel = 'Letzte';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 von ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} von ${length}`;
  };
}