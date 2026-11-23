import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { SyllabusOverviewComponent } from './syllabus-overview.component';

describe('Combined syllabus navigation', () => {
  it('identifies the technology in lesson links and toggles sections with the same display ID', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/syllabus', SyllabusOverviewComponent);

    const view: HTMLElement = harness.routeNativeElement!;
    const javaHeading = view.querySelector<HTMLButtonElement>('button.section-title')!;
    const springHeading = Array.from(view.querySelectorAll<HTMLButtonElement>('button.section-title'))
      .find(heading => heading.textContent?.includes('Core Spring Framework (Deep Dive)'))!;

    javaHeading.click();
    harness.detectChanges();
    expect(javaHeading.getAttribute('aria-expanded')).toBe('true');

    springHeading.click();
    harness.detectChanges();
    expect(javaHeading.getAttribute('aria-expanded')).toBe('false');
    expect(springHeading.getAttribute('aria-expanded')).toBe('true');

    const springSection = springHeading.closest('.section')!;
    springSection.querySelector<HTMLButtonElement>('button.topic-header')!.click();
    harness.detectChanges();

    const lessonLink = springSection.querySelector<HTMLAnchorElement>('a.subtopic-item')!;
    const url = new URL(lessonLink.href);
    expect(url.pathname).toBe('/subtopic-detail');
    expect(url.searchParams.get('tech')).toBe('spring');
    expect(url.searchParams.get('sectionSlug')).toBe('core_spring_framework_deep_dive');
    expect(url.searchParams.get('subtopicId')).toBe('what_is_ioc_and_why_spring_uses_it');
  });
});
