import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { findTechnology } from '../syllabus/technologies';
import { sectionSlugFromTitle } from '../syllabus/section-slug';
import { LessonReference, SubtopicContent } from './lesson.model';

type StoredLesson = Omit<SubtopicContent, 'references'> & {
  references?: (LessonReference | string)[];
};

@Injectable({ providedIn: 'root' })
export class SubtopicContentService {
  private readonly http = inject(HttpClient);

  getSubtopicContent(
    technologyId: string,
    section: { title: string; slug?: string },
    subtopicId: string
  ): Observable<SubtopicContent | null> {
    const technology = findTechnology(technologyId);
    const sectionSlug = section.slug ?? sectionSlugFromTitle(section.title);

    const validPathSegment = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
    if (!technology || !validPathSegment.test(sectionSlug) || !validPathSegment.test(subtopicId)) {
      return of(null);
    }

    const url = `assets/json/subtopics/${technology.id}/${sectionSlug}/${subtopicId}.json`;
    return this.http.get<StoredLesson>(url).pipe(
      map(({ references, ...lesson }) => references ? {
        ...lesson,
        references: references.map(reference =>
          typeof reference === 'string' ? { title: reference } : reference
        )
      } : lesson),
      catchError((error: HttpErrorResponse) => error.status === 404
        ? of(null)
        : throwError(() => error))
    );
  }
}
