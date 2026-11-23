import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { SubtopicDetailComponent } from './subtopic-detail.component';

describe('SubtopicDetailComponent', () => {
  it('shows the catalog summary when there is no published lesson file', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(
      '/subtopic-detail?tech=java&section=Core+Java+Basics&subtopicId=primitive_data_types',
      SubtopicDetailComponent
    );

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/json/subtopics/java/core_java_basics/primitive_data_types.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
    harness.detectChanges();

    const page = harness.routeNativeElement!;
    expect(page.querySelector('h1')?.textContent).toBe('Primitive data types');
    expect(page.querySelector('.overview-text')?.textContent).toContain('eight primitive types');
    const next = page.querySelector<HTMLAnchorElement>('.lesson-pagination a')!;
    expect(new URL(next.href).searchParams.get('subtopicId')).toBe('reference_types');

    await harness.navigateByUrl(
      '/subtopic-detail?tech=java&sectionSlug=core_java_basics&subtopicId=variables_local_instance_static',
      SubtopicDetailComponent
    );
    http.expectOne('assets/json/subtopics/java/core_java_basics/variables_local_instance_static.json')
      .flush(null, { status: 404, statusText: 'Not Found' });
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.lesson-pagination')).toBeNull();
    http.verify();
  });
});
