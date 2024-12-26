import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-container',
  standalone: true,
  imports: [],
  templateUrl: './loading-container.component.html',
  styleUrl: './loading-container.component.css'
})
export class LoadingContainerComponent {
  @Input() text: string = 'Lädt...';
}
