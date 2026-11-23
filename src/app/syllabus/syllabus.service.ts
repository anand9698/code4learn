import { Injectable } from '@angular/core';
import java from './data/java.json';
import spring from './data/spring.json';
import springboot from './data/springboot.json';
import { Section, SyllabusStats } from './syllabus.model';
import { findTechnology, TechnologyId } from './technologies';

const sectionsByTechnology: Record<TechnologyId, readonly Section[]> = {
  java: java as Section[],
  spring: spring as Section[],
  springboot: springboot as Section[]
};

@Injectable({ providedIn: 'root' })
export class SyllabusService {
  getSections(technologyId: TechnologyId): readonly Section[] {
    return sectionsByTechnology[technologyId];
  }

  resolveLesson(technologyId: string, sectionSlug: string, topicId: string | null, subtopicId: string | null) {
    const technology = findTechnology(technologyId);
    if (!technology) return null;

    const section = this.getSections(technology.id).find(section => section.slug === sectionSlug);
    const topic = section?.topics.find(topic => subtopicId
      ? topic.subTopics?.some(subtopic => subtopic.id === subtopicId)
      : topic.id === topicId
    );

    return section && topic ? { technology, section, topic } : null;
  }

  getStats(sections: readonly Section[]): SyllabusStats {
    let topics = 0;
    let subtopics = 0;

    for (const section of sections) {
      topics += section.topics.length;
      for (const topic of section.topics) {
        subtopics += topic.subTopics?.length ?? 0;
      }
    }

    return { sections: sections.length, topics, subtopics };
  }
}
