# 免費語音：本輪設定與後續產音

## 本輪已完成與尚未完成

已完成瀏覽器臺灣華語播放、教育部字典敘述排除、108 項產音待製清單、乾淨音檔索引與驗證機制。**尚未產出新 AI MP3**，尚未逐項聽校。沒有付費帳號、API 金鑰或產音費用。

CSV 可用 Excel 開啟；JSON 保留完整資料。每個項目有固定 key、實際文字、已知拼音／注音、來源、目前狀態；字音另有裝置預覽使用的提示詞。聽力題要依原任務確認是「純字音」、「完整詞語」還是其他內容，不能為了方便把答案整段讀出來。

## 手機 / 電腦設定

1. 開 Profile → Audio setup，看目前瀏覽器偵測的聲音，再按 Check voice again。
2. iPhone / iPad：設定 → 輔助使用 → 閱讀與朗讀（或語音內容）→ 聲音。Mac：系統設定 → 輔助使用 → 閱讀與朗讀（或語音內容）→ 系統聲音。找裝置提供的中文（臺灣），需要時下載。
3. Android：設定 → 無障礙設定 → 文字轉語音輸出 → 引擎／語言／安裝語音資料。是否有臺灣華語依引擎與廠牌而異。
4. 重新開啟 Chrome，回工具按 Check voice again，再試聽快樂、好像／好奇、長短／長大、旅行／銀行。OS 裝好音色，不保證所有瀏覽器都能取得。
5. 如果仍沒有適合音色，可繼續無聲學習或換支援裝置。工具不自動改成中國華語或英語。網路聲音需要網路；不能宣稱完全離線。

Apple 官方：https://support.apple.com/zh-tw/111798
Android 官方：https://support.google.com/accessibility/android/answer/6006983?hl=zh-Hant
瀏覽器聲音來源：https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

## 要有固定、可公開播放的音檔：兩條零服務費路徑

**較容易先完成：自行錄製。** 找同意用於公開教學工具的臺灣華語說話者，照清單每個項目單獨錄製；保留同意及來源。字音只讀指定讀音，不讀部首／筆畫。每個檔案先確認音量、開頭結尾、目標讀音及與畫面文字的一致性，再由另一人聽校。這能產出固定音檔，但不稱為 AI 產音。

**後續 AI 研究：MediaTek Research BreezyVoice。** 官方程式與模型為 Apache-2.0，支援臺灣華語及手動注音。官方依賴含 Linux 專用套件；目前尚未驗證這台 Mac 的安裝與速度。這次不自行下載數 GB 模型、不租 GPU、不開付費帳號。之後若採這條路，先確認現有電腦可執行，再用已取得同意的聲音提示、小批產出 10 個目標讀音，逐項聽校後才擴大。模型授權不代替聲音同意與文本來源授權。

官方程式：https://github.com/mtkresearch/BreezyVoice
官方模型：https://huggingface.co/MediaTek-Research/BreezyVoice

Google / Azure 的免費額度方案本輪不採用，避免綁卡與超額計費設定。

## 乾淨音檔如何接回網站（開發設定）

1. 將已審核檔案放在 dist/audio/clean/，例如 hao-3.mp3。此目錄只放可公開散布、審核通過的短音檔。
2. 在 dist/clean-audio-manifest.json 的 entries 內，以待製清單的 key 建立對應。示意（請填真實內容與 checksum，不能直接把範例標成已核准）：

```json
{
  "version": 1,
  "entries": {
    "reading:hao-3": {
      "src": "./audio/clean/hao-3.mp3",
      "text": "好",
      "locale": "zh-TW",
      "reviewStatus": "approved",
      "rights": "實際的說話者同意 / 產音來源與公開使用依據",
      "sha256": "實際檔案 SHA-256"
    }
  }
}
```

3. 在 tool-prototype 執行 node prepare-audio.mjs；會驗證目錄、必要欄位與 SHA-256，不會呼叫付費服務。再執行 node tests.mjs。
4. 檢查字音、詞音、句音及聽力題實際播放內容，再發布。瀏覽器播放成功不等於讀音正確。

純字音的乾淨錄音會優先於提示詞語音。教育部原始字典錄音保留於研究檔案，不裁切、不拿來假裝純字音。

COCT 下載頁目前未找到附可公開重用授權的逐字詞句音檔包；不能把有口語語料解讀為可任意下載原音公開播放。
https://coct.naer.edu.tw/page.jsp?ID=41
