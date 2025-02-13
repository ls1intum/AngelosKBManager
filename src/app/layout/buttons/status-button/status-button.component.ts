import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status-button',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass
  ],
  templateUrl: './status-button.component.html',
  styleUrl: './status-button.component.css'
})
export class StatusButtonComponent {
  @Input() active: boolean = true;
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
