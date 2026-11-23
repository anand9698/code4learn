import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lessonBullets' })
export class LessonBulletsPipe implements PipeTransform {
  transform(text: string | null | undefined): string[] | null {
    const lines = (text ?? '').split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length && lines.every(line => line.startsWith('•'))) {
      return lines.map(line => line.slice(1).trim());
    }

    return null;
  }
}
