const MedicalQueryService = require('./server/services/queryService');

async function testFinalIntegration() {
  console.log('🧪 最終整合測試 - 驗證所有功能\n');
  
  const queryService = new MedicalQueryService();
  
  const testQueries = [
    '現在高雄醫學大學附設醫院卓士傑醫師 心臟血管內科４診看到幾號了?',
    '心臟科醫師推薦',
    '高醫內科現在看到幾號'
  ];
  
  for (const query of testQueries) {
    console.log(`📝 測試查詢: "${query}"`);
    console.log('─'.repeat(60));
    
    try {
      const result = await queryService.processMedicalQuery(query);
      
      if (result.success) {
        console.log('✅ 查詢成功');
        console.log('📋 回應內容:');
        console.log(result.response.substring(0, 500) + '...');
      } else {
        console.log('❌ 查詢失敗:', result.error);
      }
    } catch (error) {
      console.log('❌ 執行錯誤:', error.message);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 等待 2 秒再執行下一個查詢
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎯 最終整合測試完成！');
}

// 執行測試
testFinalIntegration().catch(console.error); 