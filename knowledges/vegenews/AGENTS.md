# AGENTS.md — VegeNews 知識庫

> 本知識庫收錄社團及蔬食倡議資訊，供 Vegetaiwan 網站 Q&A 查詢。

## 目錄結構

```
knowledges/vegenews/
├── raw/           # 原始來源（唯讀）
├── wiki/          # LLM 維護的 markdown 知識網路
│   ├── overview.md
│   ├── index.md
│   ├── log.md
│   ├── sources/
│   ├── entities/
│   ├── concepts/
│   └── explorations/
└── AGENTS.md
```

## Ingest 規範

1. 讀取 `raw/` 來源全文
2. 寫入 `wiki/sources/` 來源摘要頁
3. 更新 `wiki/entities/`、`wiki/concepts/` 相關頁面
4. 關鍵主張附證據鏈 `[[頁面名稱]]`
5. 過濾敏感資訊（API key、密碼等）→ `[REDACTED]`
6. 更新 `wiki/index.md`
7. 追加 `wiki/log.md`：`## [YYYY-MM-DD] ingest | 來源標題`

## 證據鏈格式

關鍵事實結尾標註：`(來源: [[頁面名稱]])`

## 矛盾處理

不刪除舊內容，以 supersession 標記並移至「## 歷史記錄」。
