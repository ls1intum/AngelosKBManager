import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-link-cell',
  standalone: true,
  imports: [],
  templateUrl: './link-cell.component.html',
  styleUrl: './link-cell.component.css'
})
export class LinkCellComponent {
  link: string;

  constructor(@Inject('cellValue') public value: string) {
    this.link = value;
  }
}
