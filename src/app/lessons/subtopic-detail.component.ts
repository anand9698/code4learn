import { CommonModule, Location } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { findTechnology } from '../syllabus/technologies';
import { SyllabusService } from '../syllabus/syllabus.service';
import { sectionSlugFromTitle } from '../syllabus/section-slug';
import { lessonQueryParams } from '../syllabus/syllabus-links';
import { LessonBulletsPipe } from './lesson-bullets.pipe';
import { SubtopicContentService } from './subtopic-content.service';
import { LessonDiagramComponent } from './diagram/lesson-diagram.component';

@Component({
  selector: 'app-subtopic-detail',
  imports: [CommonModule, LessonBulletsPipe, RouterLink, LessonDiagramComponent],
  templateUrl: './subtopic-detail.component.html',
  styleUrls: ['./subtopic-detail.component.css', './subtopic-detail.theme.css', './lesson-pagination.css']
})
export class SubtopicDetailComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly contentService = inject(SubtopicContentService);
  private readonly syllabus = inject(SyllabusService);

  private readonly route = inject(ActivatedRoute);

  readonly lesson$ = this.route.queryParamMap.pipe(
    switchMap(params => {
      const technologyId = params.get('tech') ?? '';
      const sectionTitle = params.get('section') ?? '';
      const sectionSlug = params.get('sectionSlug') ?? sectionSlugFromTitle(sectionTitle);
      const subtopicId = params.get('subtopicId') ?? '';
      const topicId = params.get('topicId') ?? '';
      const isTopic = this.route.snapshot.routeConfig?.path === 'topic-detail';
      const selection = this.syllabus.resolveLesson(technologyId, sectionSlug, topicId, subtopicId);
      const subtopics = selection?.topic.subTopics ?? [];
      const index = subtopics.findIndex(subtopic => subtopic.id === subtopicId);
      const subtopic = subtopics[index];
      const next = index >= 0 ? subtopics[index + 1] : undefined;
      const subtopicName = subtopic?.name ?? (params.get('subtopicName') || params.get('subtopic') || '');
      const details = {
        topicName: selection?.topic.name ?? params.get('topic') ?? '',
        sectionTitle: selection?.section.title ?? sectionTitle,
        technologyId,
        title: isTopic ? selection?.topic.name : subtopicName,
        summary: isTopic ? selection?.topic.summary : subtopic?.summary,
        subtopicLinks: isTopic && selection
          ? subtopics.map(subtopic => ({
              name: subtopic.name,
              params: lessonQueryParams(selection.technology.id, selection.section, selection.topic, subtopic)
            }))
          : [],
        next: selection && next ? {
          name: next.name,
          params: lessonQueryParams(selection.technology.id, selection.section, selection.topic, next)
        } : null
      };
      if (isTopic) {
        return of({ ...details, content: null, status: 'missing' });
      }
      return this.contentService
        .getSubtopicContent(
          details.technologyId,
          { title: sectionTitle, slug: sectionSlug },
          subtopicId
        )
        .pipe(
          map(content => ({ ...details, content, status: content ? 'loaded' : 'missing' })),
          catchError(() => of({ ...details, content: null, status: 'error' })),
          startWith({ ...details, content: null, status: 'loading' })
        );
    })
  );

  showBackToTop = false;

  goBack(technologyId: string): void {
    if (this.router.lastSuccessfulNavigation?.previousNavigation) {
      this.location.back();
      return;
    }

    const technology = findTechnology(technologyId);
    this.router.navigate(technology ? ['/syllabus', technology.id] : ['/syllabus']);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0 });
  }
}
