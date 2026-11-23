import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogDir = 'src/app/syllabus/data';
const lessonDir = 'src/assets/json/subtopics';
const errors = [];
const ajv = new Ajv({ allErrors: true });
const validateOutline = ajv.compile(readJson('schemas/syllabus.schema.json'));
const validateLesson = ajv.compile(readJson('schemas/lesson.schema.json'));

function readJson(file) {
  return JSON.parse(readFileSync(resolve(root, file), 'utf8'));
}

function filesIn(directory) {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function readValidated(file, validate) {
  let data;
  try {
    data = readJson(file);
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return;
  }

  if (validate(data)) return data;

  for (const error of validate.errors) {
    errors.push(`${file}#${error.instancePath}: ${error.message} ${JSON.stringify(error.params)}`);
  }
}

function addUnique(values, value, where, field) {
  if (values.has(value)) {
    errors.push(`${where}: duplicate ${field} "${value}"`);
  }
  values.add(value);
}

const expectedLessons = new Set();
let sectionCount = 0;
let topicCount = 0;
const outlines = filesIn(catalogDir).filter(file => file.endsWith('.json'));
for (const file of outlines) {
  const sections = readValidated(file, validateOutline);
  if (!sections) continue;

  const technology = file.slice(catalogDir.length + 1, -'.json'.length);
  const sectionIds = new Set();
  const sectionSlugs = new Set();
  for (const section of sections) {
    sectionCount++;
    addUnique(sectionIds, section.id, file, 'section id');
    addUnique(sectionSlugs, section.slug, file, 'section slug');

    const topicIds = new Set();
    for (const topic of section.topics) {
      topicCount++;
      addUnique(topicIds, topic.id, `${file} / ${section.slug}`, 'topic id');
      for (const subtopic of topic.subTopics ?? []) {
        const lessonPath = `${lessonDir}/${technology}/${section.slug}/${subtopic.id}.json`;
        addUnique(expectedLessons, lessonPath, file, 'lesson path');
      }
    }
  }
}

const images = new Set(filesIn('src/assets/images').map(file => file.slice('src/'.length)));
const lessons = filesIn(lessonDir).filter(file => file.endsWith('.json'));
let imageCount = 0;
let questionCount = 0;
let publishedCount = 0;
for (const file of lessons) {
  const lesson = readValidated(file, validateLesson);
  if (!lesson) continue;

  if (!expectedLessons.has(file)) {
    errors.push(`${file}: no matching syllabus entry`);
  } else {
    publishedCount++;
  }

  questionCount += lesson.interviewQA?.length ?? 0;
  for (const content of [lesson, ...lesson.sections]) {
    for (const image of content.images ?? []) {
      imageCount++;
      if (!images.has(image.url)) {
        errors.push(`${file}: missing image "${image.url}"`);
      }
    }
  }

  for (const section of lesson.sections) {
    for (const { title, table } of section.subsections ?? []) {
      table?.rows.forEach((row, index) => {
        if (row.length !== table.headers.length) {
          errors.push(`${file}: "${title}" table row ${index + 1} has ${row.length} cells, expected ${table.headers.length}`);
        }
      });
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${outlines.length} outlines: ${sectionCount} sections, ${topicCount} topics, ${expectedLessons.size} subtopics.`);
  console.log(`Validated ${publishedCount} lessons, ${questionCount} interview questions, and ${imageCount} diagram references.`);
  console.log(`${expectedLessons.size - publishedCount} subtopics are outline-only.`);
}
