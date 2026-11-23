import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { SyllabusCountsComponent } from '../counts/syllabus-counts.component';
import { Difficulty, Section } from '../syllabus.model';
import { SyllabusService } from '../syllabus.service';
import { findTechnology, Technology } from '../technologies';

type DifficultyFilter = Difficulty | 'all';

@Component({
  selector: 'app-technology-syllabus',
  imports: [CommonModule, FormsModule, SectionComponent, SyllabusCountsComponent],
  templateUrl: './technology-syllabus.component.html',
  styleUrls: ['./technology-syllabus.component.css', './technology-syllabus.theme.css']
})
export class TechnologySyllabusComponent {
  technology?: Technology;
  sections: readonly Section[] = [];
  filteredSections: readonly Section[] = [];
  stats = this.syllabus.getStats([]);

  readonly openSections = new Set<Section>();
  searchTerm = '';
  selectedDifficulty: DifficultyFilter = 'all';

  constructor(route: ActivatedRoute, private readonly syllabus: SyllabusService) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.technology = findTechnology(params.get('technology') ?? '');
      this.sections = this.technology ? this.syllabus.getSections(this.technology.id) : [];
      this.stats = this.syllabus.getStats(this.sections);
      this.openSections.clear();
      this.applyFilters();
    });
  }

  toggleSection(section: Section): void {
    if (!this.openSections.delete(section)) {
      this.openSections.add(section);
    }
  }

  setVisibleSectionsExpanded(expanded: boolean): void {
    for (const section of this.filteredSections) {
      if (expanded) {
        this.openSections.add(section);
      } else {
        this.openSections.delete(section);
      }
    }
  }

  filterByDifficulty(difficulty: DifficultyFilter): void {
    this.selectedDifficulty = difficulty;
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredSections = this.sections.filter(section => {
      const matchesDifficulty = this.selectedDifficulty === 'all'
        || section.difficulty === this.selectedDifficulty;
      return matchesDifficulty && (
        !term
        || section.title.toLowerCase().includes(term)
        || section.topics.some(topic =>
          topic.name.toLowerCase().includes(term)
          || topic.subTopics?.some(subtopic => subtopic.name.toLowerCase().includes(term))
        )
      );
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterByDifficulty('all');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0 });
  }
}
