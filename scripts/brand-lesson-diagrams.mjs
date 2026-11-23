import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = fileURLToPath(new URL('../src/', import.meta.url));
const lessonDir = resolve(sourceDir, 'assets/json/subtopics');
const logo = readFileSync(resolve(sourceDir, 'assets/brand/code4learn-mark.png'), 'base64');
const watermark = `  <image id="code4learn-watermark" x="12%" y="8%" width="76%" height="84%" opacity="0.18" href="data:image/png;base64,${logo}"/>`;

const diagramPaths = new Set();
for (const file of readdirSync(lessonDir, { recursive: true }).filter(file => file.endsWith('.json'))) {
  const lesson = JSON.parse(readFileSync(resolve(lessonDir, file), 'utf8'));
  for (const section of [lesson, ...lesson.sections]) {
    for (const image of section.images ?? []) {
      if (image.url.endsWith('.svg')) {
        diagramPaths.add(resolve(sourceDir, image.url));
      }
    }
  }
}

for (const file of diagramPaths) {
  const svg = readFileSync(file, 'utf8');
  const background = /^(  <rect\b[^\r\n]*\/>)(\r?\n)/m;
  if (!background.test(svg)) {
    throw new Error(`Missing diagram background rectangle in ${file}`);
  }

  // Place the self-contained logo over the background and under the foreground.
  const branded = svg
    .replace(/^  <image id="code4learn-watermark" [^\n]+\/>\r?\n/m, '')
    .replace(background, (_, rectangle, lineBreak) => rectangle + lineBreak + watermark + lineBreak)
    .replace(/(<rect [^\n]* fill="#fff")(?= stroke=)/g, '$1 fill-opacity="0.65"');
  if (branded !== svg) {
    writeFileSync(file, branded);
  }
}

console.log(`Branded ${diagramPaths.size} lesson diagrams.`);
