const axios = require('axios');
const OpenAI = require('openai');
const ScrapingBeeService = require('./scrapingBeeService');

// 檢查環境變數
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ 錯誤：OPENAI_API_KEY 環境變數未設定');
  console.error('請在 server/.env 檔案中設定您的 OpenAI API 金鑰');
  console.error('範例：OPENAI_API_KEY=sk-your-api-key-here');
}

if (!process.env.SERPER_API_KEY) {
  console.error('❌ 錯誤：SERPER_API_KEY 環境變數未設定');
  console.error('請在 server/.env 檔案中設定您的 Serper API 金鑰');
  console.error('範例：SERPER_API_KEY=your-serper-api-key-here');
}

if (!process.env.SCRAPING_BEE_KEY) {
  console.warn('⚠️ 警告：SCRAPING_BEE_KEY 環境變數未設定');
  console.warn('動態網頁搜尋功能將被停用');
}

// 初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Serper API 搜尋服務
class SerperSearchService {
  constructor() {
    this.apiKey = process.env.SERPER_API_KEY;
    this.baseURL = 'https://google.serper.dev/search';
  }

  async search(query) {
    try {
      if (!this.apiKey) {
        throw new Error('Serper API key 未設定，請在 server/.env 檔案中設定 SERPER_API_KEY');
      }

      console.log(`🔍 執行 Google 搜尋: ${query}`);

      const response = await axios.post(this.baseURL, {
        q: query,
        num: 10, // 取得前 10 個結果
        gl: 'tw', // 台灣地區
        hl: 'zh-tw' // 中文繁體
      }, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 秒超時
      });

      return response.data;
    } catch (error) {
      console.error('Serper 搜尋錯誤:', error.message);
      throw new Error(`搜尋服務錯誤: ${error.message}`);
    }
  }
}

// GPT-4o 分析服務
class GPTAnalysisService {
  async analyzeQuery(query, searchResults) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key 未設定，請在 server/.env 檔案中設定 OPENAI_API_KEY');
      }

      console.log('🤖 使用 GPT-4o 分析搜尋結果');

      // 準備搜尋結果摘要
      const searchSummary = this.prepareSearchSummary(searchResults);

      const prompt = `你是一個專業的醫療資訊查詢助手。請根據以下搜尋結果，回答使用者的醫療相關問題。

使用者問題: "${query}"

搜尋結果摘要:
${searchSummary}

請根據搜尋結果提供準確、有用的回答。如果搜尋結果中沒有相關資訊，請誠實告知無法找到相關資訊。

回答要求:
1. 使用繁體中文回答
2. 回答要簡潔明瞭
3. 如果涉及醫院叫號資訊，請特別標註時間
4. 如果沒有找到相關資訊，請建議其他查詢方式
5. 回答長度控制在 200 字以內

請直接回答，不要包含任何前綴或格式說明。`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "你是一個專業的醫療資訊查詢助手，專門協助使用者查詢醫院相關資訊。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('GPT 分析錯誤:', error.message);
      throw new Error(`AI 分析錯誤: ${error.message}`);
    }
  }

  prepareSearchSummary(searchResults) {
    if (!searchResults || !searchResults.organic) {
      return '未找到相關搜尋結果';
    }

    let summary = '';
    const organicResults = searchResults.organic.slice(0, 5); // 只取前 5 個結果

    organicResults.forEach((result, index) => {
      summary += `${index + 1}. ${result.title}\n`;
      summary += `   網址: ${result.link}\n`;
      summary += `   摘要: ${result.snippet || '無摘要'}\n\n`;
    });

    return summary;
  }
}

// 主要查詢處理服務
class MedicalQueryService {
  constructor() {
    this.searchService = new SerperSearchService();
    this.analysisService = new GPTAnalysisService();
    this.scrapingBeeService = new ScrapingBeeService();
  }

  async processMedicalQuery(query) {
    try {
      console.log(`📝 開始處理查詢: ${query}`);

      // 1. 先嘗試動態搜尋
      const optimizedQuery = this.optimizeSearchQuery(query);
      const searchResults = await this.searchService.search(optimizedQuery);
      
      // 2. 檢查是否需要即時資訊
      const hybridResult = await this.scrapingBeeService.hybridSearch(query, searchResults);
      
      let response;
      let finalSearchResults;

      if (hybridResult.type === 'real-time') {
        // 有即時資訊，直接使用
        console.log('✅ 使用即時資訊');
        response = this.formatRealTimeResponse(hybridResult.data);
        finalSearchResults = {
          organic: [],
          totalResults: 0,
          realTimeData: hybridResult.data
        };
      } else {
        // 使用 Google 搜尋結果
        console.log('使用 Google 搜尋結果');
        response = await this.analysisService.analyzeQuery(query, searchResults);
        finalSearchResults = {
          organic: searchResults.organic?.slice(0, 3) || [],
          totalResults: searchResults.searchInformation?.totalResults || 0
        };
      }

      console.log(`✅ 查詢處理完成`);

      return {
        response,
        searchResults: finalSearchResults,
        dataSource: hybridResult.type
      };

    } catch (error) {
      console.error('查詢處理失敗:', error);
      throw error;
    }
  }

  // 格式化即時資訊回應
  formatRealTimeResponse(realTimeData) {
    console.log('formatRealTimeResponse:', realTimeData);
    const { hospital, currentNumber, department } = realTimeData;
    // 強制取得 timestamp
    let timestamp = realTimeData.timestamp;
    if (!timestamp) {
      timestamp = new Date().toISOString();
    }
    let timeStr = '';
    if (timestamp) {
      timeStr = `- 更新時間：${new Date(timestamp).toLocaleString('zh-TW')}`;
    }
    return `根據 ${hospital} 即時系統顯示：

目前叫號進度：
- 當前號碼：${currentNumber && currentNumber !== '' ? currentNumber : '無法取得'}
- 科別：${department && department !== '' ? department : '無法取得'}
${timeStr ? timeStr + '\n' : ''}
請攜帶健保卡提前報到，實際叫號進度請以現場公告為準。`;
  }

  // 優化搜尋查詢
  optimizeSearchQuery(userQuery) {
    // 針對醫療查詢進行優化
    let optimizedQuery = userQuery;

    // 如果是醫院叫號查詢，加入特定關鍵字
    if (userQuery.includes('看到幾號') || userQuery.includes('叫號')) {
      optimizedQuery += ' 即時叫號 門診進度';
    }

    // 如果是急診查詢
    if (userQuery.includes('急診')) {
      optimizedQuery += ' 急診室 等待時間';
    }

    // 確保包含醫院名稱
    if (userQuery.includes('高醫')) {
      optimizedQuery = optimizedQuery.replace('高醫', '高雄醫學大學附設醫院');
    }

    return optimizedQuery;
  }
}

// 建立服務實例
const medicalQueryService = new MedicalQueryService();

// 匯出主要函數
async function processMedicalQuery(query) {
  return await medicalQueryService.processMedicalQuery(query);
}

module.exports = {
  processMedicalQuery,
  MedicalQueryService,
  SerperSearchService,
  GPTAnalysisService,
  ScrapingBeeService
};