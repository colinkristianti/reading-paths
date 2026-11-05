# Reading Paths

A mobile-first Traditional Chinese heteronym learning prototype for adult learners whose first language is English. Built as static ES modules for GitHub Pages. No paid API, backend account or build dependency is required.

v3 is a local update; the public website is still v2. See [V3-REVIEW.md](V3-REVIEW.md) for scope, limits and upload instructions, and [AUDIO-SETUP.md](AUDIO-SETUP.md) for free device speech and future recording preparation.

- Learn → character, word, sentence cards; guided unlocks and Free explore.
- Review → missed learning connections, with a separate draft-bank review entry.
- Progress → normal practice accuracy, quiz averages and completed character checks.
- Profile → starting check / retake, preferred name and stage, display and audio settings, backup export / import.
- Team question bank → 320 original questions, 15 separate revisions; starting check → 20 original questions. All remain unvalidated drafts. Seven known problematic/missing keys and written listening previews are unscored. Draft records never alter normal metrics or unlocks.

The five sample lessons and two COCT sentence candidates remain unchanged; importing the complete question bank does not create a complete course. Existing `reading-paths-v1` progress migrates without clearing records. Storage is local to this browser; no cloud synchronization.

## Checks

Run `node tests.mjs`, then `node prepare-audio.mjs`. The latter validates optional approved clean recordings without downloading dictionary narration or calling a speech provider. Run `node build-preview.mjs` to write a standalone review HTML file into the parent output directory. Controller tests use a small DOM stub and are not a substitute for browser/phone QA.

Serve `dist` over HTTP for production testing, or use the generated review file. Commit source files to the existing GitHub repository. The existing Pages workflow runs tests and deploys `dist` from main.

## Sources

Original quiz: https://docs.google.com/spreadsheets/d/1Hf69uYxFku7LTxb99fbIrpBX8lhj1Ygs/edit?gid=2098312416

Starting check and revisions: https://docs.google.com/spreadsheets/d/1aT3f-NLhmql6XZyL2HadYzCgVe3eVXflWZ8qRaxvV68/edit

Each imported question retains its source row, original wording, key, fingerprint and review notes. Team question sentences are not COCT quotations. Dictionary audio is retained with its original attribution in the archive and excluded from learner playback.
