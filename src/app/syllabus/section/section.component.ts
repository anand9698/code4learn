import { Component, input, output } from '@angular/core';
import { DifficultyBadgeComponent } from '../difficulty-badge/difficulty-badge.component';
import { Section } from '../syllabus.model';
import { TechnologyId } from '../technologies';
import { TopicComponent } from '../topic/topic.component';

@Component({
  selector: 'app-section',
  imports: [DifficultyBadgeComponent, TopicComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  readonly section = input.required<Section>();
  readonly technologyId = input.required<TechnologyId>();
  readonly expanded = input.required<boolean>();
  readonly toggled = output<void>();
}
