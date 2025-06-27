# 高醫即時醫療資訊查詢系統

一個整合 RAG (Retrieval-Augmented Generation) 醫師資料庫檢索與 Web Search 即時資訊查詢的智能醫療資訊系統。

## 🎯 系統特色

### 🔍 分層整合架構
- **RAG 醫師檢索**: 基於本地醫師資料庫的智能檢索
- **Web Search**: 即時網路資訊搜尋
- **AI 整合**: GPT-4o 智能分析與回答生成

### 👨‍⚕️ 醫師資料庫
- 8 位心臟血管內科醫師完整資料
- 包含專長、職稱、經歷、學歷、證照等詳細資訊
- 智能關鍵字匹配與相關度排序

### 🏥 即時資訊查詢
- 高醫即時叫號進度查詢
- 動態網頁內容抓取
- 智能錯誤處理與重試機制

## 🚀 快速開始

### 1. 環境設定
```bash
# 設定環境變數
setup-env.bat

# 編輯 server/.env 檔案，填入您的 API 金鑰
OPENAI_API_KEY=your_openai_api_key_here
SERPER_API_KEY=your_serper_api_key_here
SCRAPING_BEE_KEY=your_scraping_bee_key_here
```

### 2. 啟動系統
```bash
npm run dev
```

### 3. 訪問系統
- 前端: http://localhost:3000
- 後端: http://localhost:3001
- 健康檢查: http://localhost:3001/health

## 📋 查詢範例

### 醫師資訊查詢
```
高醫朱志生醫師的專長是什麼？
李香君醫師的學歷和經歷
林宗翰醫師的職稱
```

### 即時叫號查詢
```
現在高醫心臟內科叫到幾號了？
高醫心臟血管內科４診看到幾號了？
```

### 綜合查詢
```
高醫林宗翰醫師現在心臟內科叫到幾號？
朱志生醫師的專長是什麼？現在叫到幾號？
```

## 🏗️ 系統架構

### 前端 (React + TypeScript)
- `client/src/App.tsx`: 主要應用程式
- `client/src/components/`: UI 元件
- `client/src/services/api.ts`: API 服務

### 後端 (Node.js + Express)
- `server/services/doctorRagService.js`: 醫師 RAG 服務
- `server/services/queryService.js`: 主要查詢處理服務
- `server/services/scrapingBeeService.js`: 即時資訊服務

### 資料庫
- `doctors.json`: 醫師資料庫 (8 位心臟血管內科醫師)

## 🔧 技術特色

### RAG 系統
- **純 JavaScript 實現**: 不依賴 Python，穩定可靠
- **智能關鍵字匹配**: 支援姓名、科別、專長、職稱等多維度搜尋
- **相關度排序**: 基於權重的智能排序算法
- **即時載入**: 動態載入醫師資料庫

### Web Search 整合
- **並行處理**: RAG 檢索與 Web 搜尋同時執行
- **智能路由**: 根據查詢類型選擇最佳資料來源
- **錯誤處理**: 優雅的降級機制
- **結果融合**: GPT-4o 智能整合多來源資訊

### 即時資訊服務
- **重試機制**: 最多 3 次重試，提高成功率
- **多種解析策略**: HTML 結構解析 + 內容分析
- **超時控制**: 45 秒超時，避免長時間等待
- **模擬資料**: 當無法取得即時資料時的備用方案

## 🧪 測試

### 完整系統測試
```bash
node test_rag_web_integration.js
```

### 單一查詢測試
```bash
node test_rag_web_integration.js "高醫朱志生醫師的專長是什麼？"
```

### 測試覆蓋範圍
- ✅ RAG 醫師檢索功能
- ✅ Web Search 網路搜尋
- ✅ 即時資訊查詢
- ✅ AI 整合回答生成
- ✅ 錯誤處理與降級

## 📊 醫師資料庫

### 心臟血管內科醫師 (8 位)
1. **林宗翰**: 重症加護醫學、心律不整治療
2. **盧怡旭**: 循環學、重症照護、高血壓
3. **林宗憲**: 高血壓、心絞痛、心肌梗塞、心衰竭
4. **朱志生**: 心臟電氣生理學、介入性心導管治療
5. **李香君**: 高血壓、心衰竭、心肌梗塞、冠狀動脈疾病
6. **林新進**: 高血壓、高血脂、心絞痛、心肌梗塞
7. **朱俊源**: 高血壓、高血脂、心絞痛、心肌梗塞

### 資料結構
```json
{
  "name": "醫師姓名",
  "department": "科別",
  "specialty": ["專長1", "專長2"],
  "title": ["職稱1", "職稱2"],
  "experience": ["經歷1", "經歷2"],
  "education": ["學歷1", "學歷2"],
  "certifications": ["證照1", "證照2"]
}
```

## 🔍 查詢處理流程

```
使用者查詢
    ↓
並行處理
├── RAG 檢索 (醫師資料庫)
└── Web Search (網路搜尋)
    ↓
即時資訊檢查
    ↓
GPT-4o 整合分析
    ↓
智能回答生成
```

## 🛠️ 開發指南

### 新增醫師資料
1. 編輯 `doctors.json`
2. 按照現有格式新增醫師資訊
3. 重新啟動服務器

### 修改 RAG 權重
編輯 `server/services/doctorRagService.js` 中的 `keywordWeights` 配置

### 調整 AI 回答
修改 `server/services/queryService.js` 中的 `createIntegratedPrompt` 方法

## 📝 更新日誌

### v2.0.0 - RAG + Web Search 整合版
- ✅ 新增醫師 RAG 檢索系統
- ✅ 實現分層整合架構
- ✅ 優化即時資訊服務
- ✅ 改善 AI 回答品質
- ✅ 新增完整測試套件

### v1.1.0 - 穩定版
- ✅ 基本醫療資訊搜尋
- ✅ 高醫即時叫號查詢
- ✅ Google 搜尋整合
- ✅ GPT-4o AI 分析

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License 