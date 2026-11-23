import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SyllabusService } from '../syllabus/syllabus.service';
import { TECHNOLOGIES } from '../syllabus/technologies';
import { BrandComponent } from '../brand/brand.component';
import { SyllabusCountsComponent } from '../syllabus/counts/syllabus-counts.component';

const UPCOMING_TECHNOLOGIES = [
  { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Components, Services, RxJS, Routing', color: '#dd0031' },
  { id: 'flutter', name: 'Flutter', icon: '📱', description: 'Dart, Widgets, State Management, UI', color: '#02569b' },
  { id: 'android', name: 'Android', icon: '🤖', description: 'Kotlin, Activities, Fragments, Jetpack', color: '#3ddc84' },
  { id: 'react', name: 'React', icon: '⚛️', description: 'Hooks, Components, Redux, Next.js', color: '#61dafb' },
  { id: 'nodejs', name: 'Node.js', icon: '📗', description: 'Express, REST APIs, MongoDB, Authentication', color: '#68a063' }
];

@Component({
  selector: 'app-home',
  imports: [RouterLink, BrandComponent, SyllabusCountsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly syllabus = inject(SyllabusService);

  readonly technologies = TECHNOLOGIES.map(technology => ({
    ...technology,
    stats: this.syllabus.getStats(this.syllabus.getSections(technology.id))
  }));
  readonly upcomingTechnologies = UPCOMING_TECHNOLOGIES;

  readonly technologyCount = TECHNOLOGIES.length;
  readonly totals = this.syllabus.getStats(
    TECHNOLOGIES.flatMap(technology => this.syllabus.getSections(technology.id))
  );
}
