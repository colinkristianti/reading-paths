# Reading Paths · 一字多讀 — mobile-first v2

An English-interface, Traditional Chinese learning prototype for adult learners. Working title; branding and content are open for review.

Public v1: https://colinkristianti.github.io/reading-paths/

The mobile-first v2 source in this folder is not published yet. See [RELEASE-STATUS.md](RELEASE-STATUS.md). For a standalone local review file, run `node build-preview.mjs`; it creates `../output/Reading_Paths_手機版_v2_本機預覽.html`. Open that file in Chrome. Its learning records are independent of the public site. It includes the two available original recordings and uses system fonts so the interface can open offline.

See [QA.md](QA.md) for completed checks and remaining limits.

## Mobile-first learning

The learning screen shows one reading, word or sentence at a time. A fixed bottom Next button explains the next action; Back returns one card. Lesson position is saved per browser. After the character check, the primary action continues to the next character or the stage review. Phone layouts come first; wider screens keep the same focused reading column.

Character and word play buttons are configured to use whole original MOE recordings. Currently, only the two 看 recordings are included locally; the build is configured to download and validate the remaining files before publishing. Sentences and words without recordings use the device’s exact Taiwan Mandarin (`zh-TW`) voice. If no Taiwan voice exists, the app explains how to add one; it never silently switches to another accent. Character readings without a recording never use isolated-character TTS guesswork. Speech synthesis and recording metadata still require content-owner listening review.

Progress separates overall practice accuracy (all practice answers including repeats), first-attempt accuracy (one first answer per question), and average completed character-quiz percentage (includes retakes, excludes stage/review/placement checks). Earlier v1 best scores and records are retained; the new quiz average begins with newly recorded complete quizzes.

## What works

- Optional six-question starting check, with an explicit non-certification notice and manual stage choice.
- Guided learning with stage unlocks, plus free exploration sharing the same progress.
- Character → readings → words → corpus sentence candidates.
- Five-question sample checks for 好、樂、長、行; 看 remains in the collection with both kàn and kān even when kān has no confirmed word within the selected vocabulary scope.
- Character pass at 4/5; stage review pass at 80%. Sample stage reviews use all available sample questions at that stage.
- Wrong-answer review by character, reading, and word. One correct revisit schedules the next day; two correct revisits move it out of the active queue. Review currently repeats the original question, so this is practice history rather than a validated mastery measure.
- Local profile, persistent progress, JSON backup/export and import confirmation.
- Small/medium/large text, Pinyin/Zhuyin/both/hidden hints, responsive layout and reduced-motion support.

Only five character previews and four quizzes are supplied. They demonstrate the UX and are awaiting the content owner's review. There are no complete lessons at stages 2*, 3, or 3* yet. The starting check can suggest only its sample stages 1, 1*, and 2. It must not be presented as an official TBCL placement test.

## Data principles

Select characters by character levels `1, 1*, 2, 2*, 3, 3*` first. Verify dictionary readings independently. Attach word levels `1 through 4*` afterward. A missing in-scope word must never remove a qualifying character or a dictionary reading.

The independent audit of 801 TBCL character rows found 176 broad dictionary research candidates, requiring further semantic and teaching review. These are not 176 approved lessons. Full evidence is delivered separately in the research workbook; the public learner site does not expose the unreviewed research list.

The two Chinese sentence examples are verbatim COCT observations, with only corpus segmentation spaces removed. They are labelled review candidates and retain text IDs and query positions. Neither is an AI-generated sentence. The corpus is not phonemically tagged; target-reading interpretation and teaching suitability still require human review. No missing sentence is filled with invented Chinese text. English glosses and feedback are prototype editorial drafts.

## Files and checks

`dist/` is the whole deployed website. `audio-sources.json` records official dictionary headword/reading matches and candidate source URLs; `prepare-audio.mjs` downloads whole MP3 assets during the normal Pages build, checks HTTP responses and MPEG headers, and writes a provenance manifest. All ten character reading files must succeed before deployment; unavailable word files use the strictly Taiwan-locale device voice. This build makes no paid API calls or API-key requests.

`dist/` is the whole website. Paths are relative and navigation uses hash routes, so GitHub project Pages work without a base-path rebuild. No package installation is needed. Audio preparation requires network access to the official MOE host during the GitHub build.

Run `node tests.mjs` and `node --check dist/app.mjs`. Serve `dist/` with any static server for local development. ES modules require HTTP(S), rather than double-clicking a file URL.

`.github/workflows/pages.yml` runs the learning-logic checks and publishes `dist/` to GitHub Pages. In repository Settings → Pages, choose **GitHub Actions** as the source. Official workflow reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Storage and accessibility

Learning state is kept under `reading-paths-v1` in browser localStorage, scoped to the website origin. A Pages deployment and any preview origin have separate progress. The export/import flow transfers it. This version has no account authentication or cloud sync; clearing website data removes the local copy. Profile names are never sent to a server by the application.

System fonts are available as fallbacks; Google Fonts supplies DM Sans and Noto Serif TC when reachable. Animations respect `prefers-reduced-motion`, with an explicit in-app override. Navigation, practice answers, display controls, and dialogs have keyboard-operable semantic elements. Native browser confirmation is used before replacing a backup or leaving an unfinished check.

## Content handoff

See [CONTENT-CONTRACT.md](CONTENT-CONTRACT.md) for field definitions and [COLLABORATION.md](COLLABORATION.md) for the proposed team workflow. Edit reviewed content in `dist/content.mjs`; the UX is independent of that module. Stable character, reading, and question IDs preserve saved learning records.

Sources: NAER TBCL downloadable character and vocabulary lists (https://coct.naer.edu.tw/page.jsp?ID=10); MOE Concised Mandarin Dictionary (https://dict.concised.moe.edu.tw/); COCT written corpus (https://bcoct.naer.edu.tw/cqpweb/yl_2014_2024/). Source row numbers in the demo refer to the supplied NAER workbook, including its header row.
