import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, PRIMARY_OUTLET, Router, RouterLink, RouterOutlet } from '@angular/router';
import { SyllabusNavComponent } from './syllabus/navigation/syllabus-nav.component';
import { sectionSlugFromTitle } from './syllabus/section-slug';
import { lessonQueryParams } from './syllabus/syllabus-links';
import { SyllabusService } from './syllabus/syllabus.service';
import { BrandComponent } from './brand/brand.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, SyllabusNavComponent, BrandComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly syllabus = inject(SyllabusService);
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');
  private readonly url = signal(this.router.url);
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private pageMotion?: Animation;

  readonly lessonParams = lessonQueryParams;
  readonly activeSubtopic = computed(() => this.router.parseUrl(this.url()).queryParamMap.get('subtopicId'));
  readonly selection = computed(() => {
    const url = this.router.parseUrl(this.url());
    const page = url.root.children[PRIMARY_OUTLET]?.segments[0]?.path;
    if (page !== 'topic-detail' && page !== 'subtopic-detail') return null;
    const params = url.queryParamMap;
    return this.syllabus.resolveLesson(
      params.get('tech') ?? '',
      params.get('sectionSlug') ?? sectionSlugFromTitle(params.get('section') ?? ''),
      params.get('topicId'),
      params.get('subtopicId')
    );
  });
  readonly activeTechnology = computed(() => {
    const segments = this.router.parseUrl(this.url()).root.children[PRIMARY_OUTLET]?.segments;
    return segments?.[0]?.path === 'syllabus'
      ? segments[1]?.path.toLowerCase()
      : this.selection()?.technology.id;
  });

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url.set(event.urlAfterRedirects);
        this.pageMotion?.cancel();
        if (!this.reducedMotion.matches) {
          this.pageMotion = this.main()?.nativeElement.animate(
            [{ opacity: 0.65 }, { opacity: 1 }],
            { duration: 220, easing: 'ease-out' }
          );
        }
      }
    });
  }

  skipToContent(event: Event): void {
    event.preventDefault();
    requestAnimationFrame(() => {
      const main = this.main()?.nativeElement;
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ block: 'start' });
    });
  }
}
