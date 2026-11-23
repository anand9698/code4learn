export interface Subtopic {
  readonly id: string;
  readonly name: string;
  readonly summary?: string;
}

export interface Topic {
  readonly id: string;
  readonly name: string;
  readonly summary?: string;
  readonly subTopics?: readonly Subtopic[];
}

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface Section {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly topics: readonly Topic[];
}

export interface SyllabusStats {
  readonly sections: number;
  readonly topics: number;
  readonly subtopics: number;
}
