import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Difficulty } from '../syllabus.model';

@Component({
  selector: 'app-difficulty-badge',
  imports: [CommonModule],
  templateUrl: './difficulty-badge.component.html',
  styleUrl: './difficulty-badge.component.css'
})
export class DifficultyBadgeComponent {
  @Input({ required: true }) difficulty!: Difficulty;
}
