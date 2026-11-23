import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TECHNOLOGIES } from './syllabus/technologies';

const loadLesson = () => import('./lessons/subtopic-detail.component')
  .then(module => module.SubtopicDetailComponent);

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'syllabus',
    loadComponent: () => import('./syllabus/overview/syllabus-overview.component')
      .then(module => module.SyllabusOverviewComponent)
  },
  {
    path: 'syllabus/:technology',
    loadComponent: () => import('./syllabus/technology/technology-syllabus.component')
      .then(module => module.TechnologySyllabusComponent)
  },
  ...TECHNOLOGIES.map(({ id }) => ({
    path: id,
    redirectTo: `syllabus/${id}`,
    pathMatch: 'full' as const
  })),
  { path: 'topic-detail', loadComponent: loadLesson },
  { path: 'subtopic-detail', loadComponent: loadLesson },
  { path: '**', redirectTo: '' }
];
