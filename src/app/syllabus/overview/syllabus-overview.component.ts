import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SectionComponent } from '../section/section.component';
import { SyllabusCountsComponent } from '../counts/syllabus-counts.component';
import { Section } from '../syllabus.model';
import { SyllabusService } from '../syllabus.service';
import { TECHNOLOGIES } from '../technologies';
import { BrandComponent } from '../../brand/brand.component';

@Component({
  selector: 'app-syllabus-overview',
  imports: [CommonModule, SectionComponent, BrandComponent, SyllabusCountsComponent],
  templateUrl: './syllabus-overview.component.html',
  styleUrl: './syllabus-overview.component.css'
})
export class SyllabusOverviewComponent {
  private readonly syllabus = inject(SyllabusService);

  readonly entries = TECHNOLOGIES.flatMap(technology =>
    this.syllabus.getSections(technology.id).map(section => ({ technology, section }))
  );
  readonly stats = this.syllabus.getStats(this.entries.map(entry => entry.section));

  openSection: Section | null = null;

  toggleSection(section: Section): void {
    this.openSection = this.openSection === section ? null : section;
  }
}
