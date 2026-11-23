import { Component, input } from '@angular/core';
import { SyllabusStats } from '../syllabus.model';

@Component({
  selector: 'app-syllabus-counts',
  template: `
    @let tracks = technologyCount();
    <ul class="motion-stagger" aria-label="Syllabus counts">
      <li>
        <span class="count">
          <span aria-hidden="true">{{ tracks === undefined ? '📚' : '💻' }}</span>
          <strong>{{ tracks ?? stats().sections }}</strong>
        </span>
        <span>{{ tracks === undefined ? 'Sections' : 'Technologies' }}</span>
      </li>
      <li>
        <span class="count"><span aria-hidden="true">📖</span><strong>{{ stats().topics }}</strong></span>
        <span>Topics</span>
      </li>
      <li>
        <span class="count"><span aria-hidden="true">📝</span><strong>{{ stats().subtopics }}</strong></span>
        <span>Subtopics</span>
      </li>
    </ul>
  `,
  styleUrl: './syllabus-counts.component.css'
})
export class SyllabusCountsComponent {
  readonly stats = input.required<SyllabusStats>();
  readonly technologyCount = input<number>();
}
