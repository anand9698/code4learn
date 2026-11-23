# Code4Learn

An Angular study guide for Java, Spring Framework, and Spring Boot. Browse each syllabus, filter sections by difficulty, and open published lessons for explanations, diagrams, code examples, and interview questions.

## Run locally

Use Node.js 22.12 or later. The Docker build uses Node 22.

```sh
npm ci
npm start
```

Open http://localhost:4200. Run the tests with Chrome installed:

```sh
npm test -- --watch=false --browsers=ChromeHeadless
```

If Karma cannot find Chrome, set `CHROME_BIN` to the Chrome executable path.

## Project layout

| Location | What it contains |
| --- | --- |
| `src/main.ts`, `src/app/app.routes.ts` | App bootstrap and routes |
| `src/app/home/` | Learning hub and technology cards |
| `src/app/syllabus/` | Combined overview, technology pages, section and topic components, catalog service and models |
| `src/app/syllabus/data/` | Java, Spring, and Spring Boot syllabus outlines |
| `src/app/lessons/` | Lesson reader, content model, and HTTP loading |
| `src/app/themes/`, `src/styles.css` | App-wide styling and animation utilities |
| `src/assets/` | Lesson JSON, diagrams, and icons served as static files |
| `schemas/`, `scripts/check-content.mjs` | Content schemas and validation |
| `android/` | Capacitor Android project |
| `docs/` | GitHub Pages publish folder |

The learning hub is at `/`. The combined syllabus is at `/syllabus` and individual outlines are at `/syllabus/:technology`. The old `/java`, `/spring`, and `/springboot` links redirect to their syllabuses. The reader uses `/subtopic-detail` with query parameters so a lesson can be bookmarked.

Add or edit supported technology metadata in `src/app/syllabus/technologies.ts`. Technology page colors are defined in `src/app/syllabus/technology/technology-syllabus.theme.css`.

## Edit content

1. Edit the relevant outline under `src/app/syllabus/data/`. A section has a numeric display ID and a stable `slug`. Topics and subtopics each need an `id`, a `name`, and a one-sentence `summary`. Keep subtopic IDs unique within their section.
2. Save each published lesson under `src/assets/json/subtopics/<technology>/<section_slug>/<subtopic_id>.json`. Keep the slug and subtopic ID when changing display names so saved links continue to work. Entries without a published lesson show their summary as a quick overview.
3. A lesson needs a `name`, `overview`, and `sections`. Omit unused optional fields. A subsection can contain text, a table, or both. Each reference has a `title` and an optional `url`.
4. Use diagram URLs that start with `assets/images/` so images also work under `/Syllabus/`.
5. Run `npm run check:content`, then open the lesson and check its presentation. Production builds also run the validator.

For example, the Java entry with ID `history_of_java` loads `src/assets/json/subtopics/java/core_java_basics/history_of_java.json`.

The [outline schema](schemas/syllabus.schema.json) and [lesson schema](schemas/lesson.schema.json) list the allowed fields. The checker also checks unique IDs, published lesson paths, diagram files, and table widths.

## Build and deploy

| Target | Command | Output |
| --- | --- | --- |
| Root-hosted web app or Capacitor | `npm run build` | `dist/syllabus-angular/browser/` |
| GitHub Pages or a server under `/Syllabus/` | `npm run build:pages` | `dist/pages/browser/` |

For GitHub Pages configured to publish from `docs/`, copy the **contents** of `dist/pages/browser/` into `docs/`, remove obsolete generated files, and commit the updated publish folder. The Pages build includes `404.html` so a direct link can load the Angular router. For other static hosts, configure a fallback to `index.html` for client-side routes.

For Android, run `npm run build`, then `npx cap sync android` and `npx cap open android`. Android Studio uses the SDK version in `android/variables.gradle`.

To serve the Pages build with Docker and Nginx:

```sh
docker build -t syllabus-app .
docker run --rm -p 8080:80 syllabus-app
```

Open http://localhost:8080/Syllabus/.

This project is for educational purposes.
