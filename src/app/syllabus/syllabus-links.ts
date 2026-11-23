import { Section, Subtopic, Topic } from './syllabus.model';
import { TechnologyId } from './technologies';

export function lessonQueryParams(tech: TechnologyId, section: Section, topic: Topic, subtopic?: Subtopic) {
  return {
    tech,
    section: section.title,
    sectionSlug: section.slug,
    topic: topic.name,
    topicId: topic.id,
    subtopicId: subtopic?.id,
    subtopicName: subtopic?.name
  };
}
