# Reading Paths v3｜組員試用與更新說明

日期：2026-11-05。這是已完成程式檢查的本機更新包，**尚未發佈到 GitHub Pages**。目前公開網址仍是 v2：
https://colinkristianti.github.io/reading-paths/

## 這次可以試什麼

- 底部四個選單：Learn、Review、Progress、Profile。
- Profile 直接顯示 Take starting check；完成新版測驗後改為 Retake starting check。跳過測驗、直接選起點的人仍可回來做。
- 起點測驗使用原工作表 20 題。它是未經效度驗證的學習起點建議，不是 TBCL 程度認證。部分題目不計分時，請自行選起點。
- Learn / Profile → Team question bank：原始 64 字 × 5 題，共 320 題；另保留中、好、行的 15 題修訂版，可切換來源、篩選來源字級、搜尋漢字、找出答錯的題組。
- 選擇題與配對題保留原形式，一次一題。作答後可展開來源列、原始文字、原答案及待確認資訊。圖像題目前保留情境文字與圖片描述，沒有另外生成插圖。
- 草稿作答、最近錯題、已完成題組及起點測驗紀錄隨 Profile 儲存在目前瀏覽器，並納入備份。沒有跨裝置帳號同步；換手機可 Export / Import。
- Progress 的答對率、平均小測驗成績仍只使用原學習區紀錄。草稿題庫不改變正式練習成績或解鎖。
- 小／中／大字體、拼音／注音／兩者／隱藏、播放速度與減少動態都保留。

## 內容範圍要分清楚

**完整匯入題庫不等於完成所有教材。** 字→詞→句的示範教材仍為好、看、樂、長、行；原練習仍為 4 組五題檢核，COCT 例句仍只有 2 個待審候選。其他漢字的完整教材及例句沒有憑空補寫。

原始 64 字題庫含有分類爭議、變調等內容，並非已核定的 1–3* 級破音字清單。保留它供組員檢視，不據此擴大正式教學範圍。題目的中文例句是組員原稿，沒有標成 COCT 引文。

已識別的 7 題不計分：原始「多」的第 1–3 題（「多麼」標成 duó），修訂版「行」的第 1、2、4、5 題（未標答案）。原來源的校稿勾選只保留作追溯，不能視為本次已審定；其餘題目仍須逐題校稿。來源版本不互相代填答案。

72 題含聽力任務：55 題有完整詞語的裝置語音預覽，17 題仍待精確錄音。看文字提示或直接看答案的題目不計分；沒有適合的聲音時仍能完整檢視。

## 零預算聲音

不申請付費服務、不綁信用卡、不設定 API 金鑰、不呼叫雲端付費產音。先使用瀏覽器實際提供的臺灣華語聲音，並顯示偵測到的聲音；沒有 zh-TW 就說明如何設定，不替換成其他地區口音。

含部首／筆畫等資訊的教育部字典錄音排除於學習播放；原檔與原授權另留存，沒有裁切。字的播放按鈕明示實際朗讀的提示詞，如好像、好奇；看 kān 無適合的現有詞，仍標待補，不猜孤立字音。裝置聲音不等於逐項聽校完成，也不等於已產出可下載的 AI 音檔。

請見同資料夾的「Reading_Paths_v3_免費產音與設定步驟.md」與 108 項 CSV / JSON 待製清單。

## 本機試用

用 Chrome 開啟「Reading_Paths_手機版_v3_本機預覽.html」。這是單檔預覽，不用架伺服器。檔案使用獨立儲存名稱，不會改動公開網站原本的紀錄。音訊須瀏覽器提供臺灣聲音；網路音色可能需要連網。

建議測試：先跳過測驗選起點 → Profile → Take starting check → 回 Learn → Team question bank → 好的 5 題 → Progress 確認原練習統計未被草稿影響 → Profile Export。

已通過：來源 355 題的完整性與唯一 ID、選項／答案解析、配對評分、7 題爭議隔離、聽力閘門、舊版紀錄相容、臺灣語系與取消播放、20 題起點及 5 題混合題型的控制流程測試。單檔預覽另做程式載入檢查。

**尚未驗收**：新版手機實機畫面、跨瀏覽器聲音及逐題聽校。Chrome 原生測試連線曾顯示畫面停留／重新載入空白，隨後操作連線逾時；不能把這輪程式測試當成完整瀏覽器視覺驗收。

## 更新既有 GitHub Pages

GitHub 連接器先前回傳 403（Resource not accessible by integration），無法替你提交程式；Chrome 操作連線這次也逾時。因此先提供完整更新包，不宣稱已發布。

1. 解壓「Reading_Paths_v3_GitHub更新包.zip」。
2. 到 https://github.com/colinkristianti/reading-paths ，可先建立一個新版分支。
3. 打開解壓後的 GitHub更新檔，將**裡面的項目**拖進 Upload files。讓 dist、tests.mjs、ui-flow-tests.mjs、prepare-audio.mjs 等位於儲存庫原來的位置，不要多包一層 GitHub更新檔。
4. Commit，若使用分支則建立 PR 並合併到 main。現有 .github/workflows/pages.yml 可以繼續使用，不必再上傳隱藏資料夾：它仍會呼叫 tests.mjs 與 prepare-audio.mjs；新版 prepare 只驗證選填的乾淨音檔，不再下載字典音訊。
5. Actions 的 main 部署成功後，在公開網站重新整理；看到四個底部選單、Profile 的測驗入口以及 320 題入口才算已更新。

如果要調整工作流程的顯示名稱，可另採完整原始碼包內新版 pages.yml；它不是這次更新可運作的必要條件。

## 原始資料

原始 320 題：
https://docs.google.com/spreadsheets/d/1Hf69uYxFku7LTxb99fbIrpBX8lhj1Ygs/edit?gid=2098312416

20 題起點測驗：
https://docs.google.com/spreadsheets/d/1aT3f-NLhmql6XZyL2HadYzCgVe3eVXflWZ8qRaxvV68/edit?gid=884981026

15 題修訂：
https://docs.google.com/spreadsheets/d/1aT3f-NLhmql6XZyL2HadYzCgVe3eVXflWZ8qRaxvV68/edit?gid=1540295536

來源試算表未被修改。
