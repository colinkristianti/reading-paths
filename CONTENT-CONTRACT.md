# 教材交接格式 v1

你們可以先在共用試算表填寫，下次由我匯入，不需要內容負責人編輯程式。每個單位使用穩定 ID；修改文字時不要重新編 ID，才能保留學習紀錄。

| 資料 | 必填欄位 | 原則 |
|---|---|---|
| 漢字 | character_id、漢字原字形、漢字級別、字表來源列、收錄決策、審核人 | 限 1、1*、2、2*、3、3*；以漢字決定資格 |
| 讀音 | reading_id、character_id、注音、拼音、英文義項、字典版本／字詞號、用途分類、讀音呈現決策 | 每音獨立，不以缺詞刪音；文言／姓氏／又音等先審 |
| 詞 | word_id、reading_id、詞形、整詞拼音／注音、詞級、英文解釋、總詞表來源列 | 限 1–4*；詞級與漢字級別分開 |
| 句 | sentence_id、word_id、原句、目標詞、語料庫名稱、text_id、查詢詞與 query_id／結果序號、來源網址、審核狀態 | 必須實際從 COCT 觀察；保留原文，只另存去除分詞空格的顯示值 |
| 題目 | question_id、character_id、reading_id、題幹、選項、唯一答案、英文解析、來源、審核狀態 | 每字五題；需檢查選項是否有多個合理答案 |

缺詞、缺句、缺題均填「待補」，不要補自造例句，也不要刪除原本符合字級的漢字。國教院基礎詞彙表的教學例句如另行使用，須標成「官方教學例句」，不能標成 COCT 語料原句。

審核狀態建議：研究候選 → 待內容審核 → 已核准 → 可上線。網站現有範例皆為 demonstration，不代表已通過你們的教材審查。

同一字可能存在異義分讀、同義異讀、語音／讀音、文言、姓氏專名與語法輕聲。逐音記下處理方式，例如「主線教學／補充說明／先不呈現」，不能只用音數一刀切。漢字的納入決策和讀音的教學呈現決策須分開。

階段總複習與入口測驗請另有題庫；不應正式上線後仍完全重複單字小測驗。現有原型只重用範例題來驗證流程，入口建議僅涵蓋 1／1*／2，並無估計完整 TBCL 能力的效度。

目前程式對應：`CHARACTERS[]` → `readings[]` → `words[]`／`sentences[]`；`QUESTIONS[]` 以 characterId／readingId 關聯。將來教材量增加時可由試算表輸出 JSON，不必重寫畫面與學習紀錄。


手機版音訊欄位：每音 reading:<reading_id>、每詞 word:<reading_id>:<詞形>，不可只以字形當音訊鍵。音訊需有 src、來源／授權、字詞號、對應注音／拼音及聽審狀態。例句可另外提供臺灣華語完整錄音；未提供時以裝置的臺灣華語語音朗讀，無該語音則明確提示。不得為了方便將另一口音標成臺灣口音。

## v3 separate draft banks

`question-bank.mjs` preserves 320 original items, 15 worksheet revisions and 20 starting-check items. These records are team drafts, not a reviewed course inventory. Each retains source URL/row, original wording/key, fingerprint and known flags. Missing keys and the known 多 duó items are unscored; no version borrows keys from another version. Draft activity uses `teamAttempts`, `teamHistory`, and `startingChecks`, never normal `attempts`, `lessons` or `stagePasses`.

Source authored practice sentences are never labelled COCT quotations. Listening tasks require the prompt to start or an explicit unscored written preview. Isolated-sound tasks with no exact recording stay pending. Browser speech is an unvalidated device preview. Optional approved clips use `clean-audio-manifest.json`; the original MOE dictionary narration is excluded at playback.
