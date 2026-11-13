# One Character, Many Sounds

A mobile-first Traditional Chinese heteronym learning prototype for adult learners whose first language is English. The v4 GitHub Pages release is a team trial of the guided onboarding, level check, character path, and the sample lesson for 好.

## Try the flow

1. Enter a nickname and read the short guide.
2. Complete the 20-question placement check. It suggests a starting point; it is not an official TBCL certification.
3. Explore the character path and try the guided lesson.

The app saves a nickname and learning progress in the current browser on the current device. There is no account, cloud sync, or backup transfer. Clearing browser storage may remove saved progress.

## Scope and content status

This is a team preview, not a complete course. The guided lesson for 好 is a staged experience prototype; lesson content and word/sentence examples still require editorial review. The other path nodes are previews and should not be treated as completed lessons. Character ordering uses a local TBCL/corpus-frequency candidate file and is subject to content review.

Audio currently uses the available device/browser voice and has not been replaced with OpenAI TTS. Pronunciation quality can vary by device. The app does not record or score speaking practice.

## Project files

- `dist/` contains the GitHub Pages site.
- `tests.mjs` and `prepare-audio.mjs` are run by the Pages workflow on pushes to `main`.
- `CONTENT-CONTRACT.md` documents the lesson data format and source rules.

The Pages workflow deploys `dist` from `main` after its automated checks pass.
