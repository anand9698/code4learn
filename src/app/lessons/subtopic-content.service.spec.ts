import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SubtopicContentService } from './subtopic-content.service';

describe('SubtopicContentService', () => {
  let service: SubtopicContentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SubtopicContentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads a lesson relative to the app base URL using the legacy section title', () => {
    const lesson = { name: 'Lesson', overview: '', sections: [] };
    service.getSubtopicContent('Spring', { title: 'Inversion of Control & Dépendency Injection' }, 'ioc')
      .subscribe(content => expect(content).toEqual(lesson));

    http.expectOne('assets/json/subtopics/spring/inversion_of_control_and_dependency_injection/ioc.json')
      .flush(lesson);
  });

  it('uses a stable section slug after a title change and supports older references', () => {
    const lesson = { name: 'Lesson', overview: 'Overview', sections: [] };
    const reference = { title: 'Java documentation', url: 'https://docs.oracle.com/en/java/' };
    service.getSubtopicContent('java', { title: 'Java Fundamentals', slug: 'core_java_basics' }, 'history_of_java')
      .subscribe(content => expect(content).toEqual({
        ...lesson,
        references: [{ title: 'Older citation' }, reference]
      }));

    http.expectOne('assets/json/subtopics/java/core_java_basics/history_of_java.json')
      .flush({ ...lesson, references: ['Older citation', reference] });
  });

  it('treats a missing lesson as unpublished', () => {
    service.getSubtopicContent('java', { title: 'Core Java Basics' }, 'unpublished')
      .subscribe(content => expect(content).toBeNull());

    http.expectOne('assets/json/subtopics/java/core_java_basics/unpublished.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('preserves a server error for the reader to report', () => {
    service.getSubtopicContent('java', { title: 'Core Java Basics' }, 'history_of_java').subscribe({
      next: () => fail('Expected the request to fail'),
      error: error => expect(error.status).toBe(500)
    });

    http.expectOne('assets/json/subtopics/java/core_java_basics/history_of_java.json')
      .flush(null, { status: 500, statusText: 'Server Error' });
  });
});
