import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TECHNOLOGIES } from '../technologies';

@Component({
  selector: 'app-syllabus-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './syllabus-nav.component.html',
  styleUrl: './syllabus-nav.component.css'
})
export class SyllabusNavComponent {
  readonly activeTechnology = input<string>();
  readonly technologies = TECHNOLOGIES;
}
