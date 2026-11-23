export interface SubtopicContent {
  name: string;
  overview: string;
  sections: ContentSection[];
  codeExamples?: CodeExample[];
  images?: ImageReference[];
  keyPoints?: string[];
  references?: LessonReference[];
  interviewQA?: InterviewQuestion[];
}

export interface ContentSection {
  title: string;
  content: string;
  subsections?: Subsection[];
  codeExamples?: CodeExample[];
  images?: ImageReference[];
}

export interface Subsection {
  title: string;
  content?: string;
  table?: TableData;
}

export interface LessonReference {
  title: string;
  url?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface CodeExample {
  title: string;
  description?: string;
  code: string;
  language: string;
}

export interface ImageReference {
  url: string;
  alt: string;
  caption?: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}
