# 即時醫療資訊查詢系統

這是一個結合 Google 搜尋和 GPT-4o 的即時醫療資訊查詢系統，讓使用者能夠透過自然語言查詢醫院即時資訊。

## 功能特色

- 🔍 **即時搜尋**: 透過 Serper API 即時搜尋 Google 獲取最新醫療資訊
- 🤖 **AI 解析**: 使用 GPT-4o 解析搜尋結果並提供自然語言回應
- 💬 **自然語言查詢**: 支援中文自然語言查詢，如「今天高醫心臟內科看到幾號？」
- ⚡ **即時回應**: 無需資料庫，完全依賴網路即時資訊
- 🎨 **現代化 UI**: 簡潔美觀的 React 前端介面

## 使用範例

**查詢範例:**
- "今天高醫心臟內科看到幾號？"
- "高醫急診室現在人多嗎？"
- "高醫門診時間表"

**回應範例:**
- "目前高醫心臟內科已看到第 36 號，下一位為第 37 號，請攜帶健保卡提前報到。"

## 技術架構

- **前端**: React + TypeScript + Tailwind CSS
- **後端**: Node.js + Express
- **搜尋 API**: Serper API (Google 搜尋)
- **AI 模型**: OpenAI GPT-4o
- **開發工具**: Vite, nodemon

## 🚀 快速開始

### 1. 系統需求
- Node.js 18+ 
- npm 或 yarn
- OpenAI API Key
- Serper API Key

### 2. 取得 API 金鑰

#### OpenAI API Key
1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊/登入帳號
3. 前往 API Keys 頁面
4. 建立新的 API Key
5. 複製並保存金鑰

#### Serper API Key (Google 搜尋)
1. 前往 [Serper.dev](https://serper.dev/)
2. 註冊帳號
3. 選擇適合的方案 (免費版每月 100 次搜尋)
4. 取得 API Key

### 3. 安裝與設定

#### 方法一：使用啟動腳本 (推薦)
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

#### 方法二：手動安裝
```bash
# 1. 安裝所有依賴
npm run install-all

# 2. 設定環境變數
# Windows
setup-env.bat

# Linux/Mac
chmod +x setup-env.sh
./setup-env.sh

# 3. 編輯 server/.env 檔案，填入您的 API 金鑰

# 4. 啟動開發伺服器
npm run dev
```

### 4. 環境變數設定

在 `server/.env` 檔案中設定：

```env
# OpenAI API 設定
OPENAI_API_KEY=sk-your-openai-api-key-here

# Serper API 設定 (Google 搜尋)
SERPER_API_KEY=your-serper-api-key-here

# 伺服器設定
PORT=3001
NODE_ENV=development
```

### 5. 驗證安裝

1. 開啟瀏覽器前往 http://localhost:3000
2. 在查詢框中輸入：「今天高醫心臟內科看到幾號？」
3. 點擊搜尋按鈕
4. 等待系統回應

## 🐛 故障排除

### 常見問題

#### 1. API 金鑰錯誤
```
錯誤：OPENAI_API_KEY 環境變數未設定
解決方案：執行 setup-env.bat 或 setup-env.sh，然後編輯 server/.env 檔案
```

#### 2. 前端啟動失敗
```
錯誤：npm ERR! Missing script: "start"
解決方案：已修復，重新執行 start.bat
```

#### 3. 網路連線問題
```
錯誤：搜尋服務錯誤
解決方案：檢查網路連線和 Serper API 狀態
```

#### 4. 前端無法連線後端
```
錯誤：網路連線錯誤
解決方案：確認後端伺服器在 http://localhost:3001 運行
```

### 測試系統
```bash
# 測試 API 功能
node test-query.js
```

## API 端點

- `POST /api/query` - 處理醫療資訊查詢
- `GET /health` - 健康檢查

## 專案結構

```
medical-info-query-system/
├── client/                 # React 前端
│   ├── src/
│   │   ├── components/     # React 元件
│   │   ├── types/         # TypeScript 型別定義
│   │   └── App.tsx        # 主應用程式
├── server/                 # Node.js 後端
│   ├── routes/            # API 路由
│   ├── services/          # 業務邏輯服務
│   └── index.js           # 伺服器入口
├── package.json
└── README.md
```

## 注意事項

- 需要有效的 OpenAI API Key 和 Serper API Key
- 系統完全依賴網路即時資訊，不儲存任何資料
- 建議用於小型專案或概念驗證
- 本系統僅供參考，不構成醫療建議 