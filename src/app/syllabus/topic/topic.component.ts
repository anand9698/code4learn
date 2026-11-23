import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Section, Subtopic, Topic } from '../syllabus.model';
import { TechnologyId } from '../technologies';
import { lessonQueryParams } from '../syllabus-links';

@Component({
  selector: 'li[app-topic]',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {
  readonly topic = input.required<Topic>();
  readonly section = input.required<Section>();
  readonly technologyId = input.required<TechnologyId>();

  expanded = false;

  lessonParams(subtopic?: Subtopic) {
    return lessonQueryParams(this.technologyId(), this.section(), this.topic(), subtopic);
  }
}
