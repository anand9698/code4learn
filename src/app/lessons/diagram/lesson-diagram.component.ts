import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { ImageReference } from '../lesson.model';

@Component({
  selector: 'app-lesson-diagram',
  templateUrl: './lesson-diagram.component.html',
  styleUrl: './lesson-diagram.component.css'
})
export class LessonDiagramComponent {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

  readonly image = input.required<ImageReference>();
  readonly zoom = signal(100);

  open(): void {
    this.zoom.set(100);
    this.dialog().nativeElement.showModal();
    this.viewport().nativeElement.scrollTo(0, 0);
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  zoomBy(step: number): void {
    this.zoom.update(current => Math.min(400, Math.max(100, current + step)));
  }
}
