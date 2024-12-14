import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.css']
})
export class GuardComponent {
  // TODO: This is a placeholder due to unexpected behavior of page refresh
}