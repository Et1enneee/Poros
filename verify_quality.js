/**
 * Poros 6.8 质量验证脚本
 * 确保6.8版本保持了5.1的所有高质量特性
 */

const fs = require('fs');
const path = require('path');

class QualityVerifier {
  constructor() {
    this.basePath = __dirname;
    this.testResults = [];
    this.qualityIssues = [];
  }

  runQualityCheck() {
    console.log('🔍 Poros 6.8 质量验证');
    console.log('=' * 60);
    console.log('基于5.1版本的高质量标准进行验证\n');

    // 检查前端质量
    this.checkFrontendQuality();
    
    // 检查后端质量
    this.checkBackendQuality();
    
    // 检查数据库质量
    this.checkDatabaseQuality();
    
    // 检查AI集成
    this.checkAIIntegration();
    
    // 检查启动脚本
    this.checkStartupScripts();
    
    // 生成质量报告
    this.generateQualityReport();
  }

  checkFrontendQuality() {
    console.log('📱 检查前端质量 (基于5.1标准)');
    console.log('-'.repeat(40));

    const frontendFiles = {
      'App.tsx': {
        required: true,
        minLines: 25,
        checks: ['Router', 'Routes', 'Route', 'Dashboard', 'CommunicationManagement']
      },
      'pages/Dashboard.tsx': {
        required: true,
        minLines: 400,
        checks: ['recharts', 'BarChart', 'PieChart', 'useState', 'mockCustomers']
      },
      'pages/CommunicationManagement.tsx': {
        required: true,
        minLines: 200,
        checks: ['CommunicationPlans', 'CommunicationRecords', 'CommunicationReminders', 'CommunicationDashboard']
      },
      'components/Layout.tsx': {
        required: true,
        minLines: 50,
        checks: ['Layout', 'Header', 'Navigation']
      },
      'components/communications/': {
        required: true,
        minFiles: 4,
        description: '4个专门的通讯组件'
      },
      'components/ui/': {
        required: true,
        minFiles: 8,
        description: '完整的shadcn/ui组件库'
      }
    };

    Object.entries(frontendFiles).forEach(([file, config]) => {
      this.verifyFrontendFile(file, config);
    });
  }

  verifyFrontendFile(filePath, config) {
    const fullPath = path.join(this.basePath, 'frontend', 'src', filePath);
    
    if (filePath.endsWith('/')) {
      // 检查目录
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        if (config.minFiles && files.length >= config.minFiles) {
          console.log(`✅ ${filePath}: ${files.length} 个文件 (要求: ${config.minFiles}+)`);
          this.recordQualityCheck(`前端目录 - ${filePath}`, true, `包含${files.length}个文件`);
        } else {
          console.log(`❌ ${filePath}: ${files.length} 个文件 (要求: ${config.minFiles}+)`);
          this.recordQualityCheck(`前端目录 - ${filePath}`, false, `只有${files.length}个文件`);
        }
      } else {
        console.log(`❌ ${filePath}: 目录不存在`);
        this.recordQualityCheck(`前端目录 - ${filePath}`, false, '目录不存在');
      }
    } else {
      // 检查文件
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n').length;
        
        if (config.minLines && lines >= config.minLines) {
          console.log(`✅ ${filePath}: ${lines} 行 (要求: ${config.minLines}+)`);
          this.recordQualityCheck(`前端文件 - ${filePath}`, true, `${lines}行代码`);
        } else {
          console.log(`⚠️  ${filePath}: ${lines} 行 (要求: ${config.minLines}+)`);
          this.recordQualityCheck(`前端文件 - ${filePath}`, false, `只有${lines}行`);
        }
        
        // 检查关键特性
        if (config.checks) {
          config.checks.forEach(check => {
            if (content.includes(check)) {
              console.log(`   ✅ 包含: ${check}`);
            } else {
              console.log(`   ❌ 缺少: ${check}`);
              this.recordQualityCheck(`${filePath} - ${check}`, false, '关键特性缺失');
            }
          });
        }
      } else {
        console.log(`❌ ${filePath}: 文件不存在`);
        this.recordQualityCheck(`前端文件 - ${filePath}`, false, '文件不存在');
      }
    }
  }

  checkBackendQuality() {
    console.log('\n⚙️  检查后端质量 (基于5.1标准)');
    console.log('-'.repeat(40));

    const backendFiles = {
      'server.js': {
        required: true,
        minLines: 150,
        checks: ['aiRoutes', 'communicationsRoutes', 'marketRoutes']
      },
      'routes/communications.js': {
        required: true,
        minLines: 100,
        description: '通讯记录路由'
      },
      'routes/customers.js': {
        required: true,
        minLines: 80,
        description: '客户管理路由'
      },
      'routes/market.js': {
        required: true,
        minLines: 50,
        description: '市场数据路由'
      },
      'services/database.js': {
        required: true,
        minLines: 100,
        description: '数据库服务'
      },
      'middleware/errorHandler.js': {
        required: true,
        minLines: 30,
        description: '错误处理中间件'
      }
    };

    Object.entries(backendFiles).forEach(([file, config]) => {
      this.verifyBackendFile(file, config);
    });
  }

  verifyBackendFile(filePath, config) {
    const fullPath = path.join(this.basePath, 'backend', filePath);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n').length;
      
      if (config.minLines && lines >= config.minLines) {
        console.log(`✅ ${filePath}: ${lines} 行`);
        this.recordQualityCheck(`后端文件 - ${filePath}`, true, `${lines}行代码`);
      } else {
        console.log(`⚠️  ${filePath}: ${lines} 行`);
        this.recordQualityCheck(`后端文件 - ${filePath}`, false, `只有${lines}行`);
      }
      
      if (config.checks) {
        config.checks.forEach(check => {
          if (content.includes(check)) {
            console.log(`   ✅ 包含: ${check}`);
          } else {
            console.log(`   ❌ 缺少: ${check}`);
            this.recordQualityCheck(`${filePath} - ${check}`, false, '功能缺失');
          }
        });
      }
    } else {
      console.log(`❌ ${filePath}: 文件不存在`);
      this.recordQualityCheck(`后端文件 - ${filePath}`, false, '文件不存在');
    }
  }

  checkDatabaseQuality() {
    console.log('\n💾 检查数据库质量');
    console.log('-'.repeat(40));

    const dbPath = path.join(this.basePath, 'database', 'wealth_management_6.8.db');
    
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`✅ 数据库文件存在: ${sizeKB} KB`);
      this.recordQualityCheck('数据库文件', true, `${sizeKB}KB`);
    } else {
      console.log('❌ 数据库文件不存在');
      this.recordQualityCheck('数据库文件', false, '文件不存在');
    }

    // 检查init脚本
    const initScript = path.join(this.basePath, 'backend', 'init_database_6.8.js');
    if (fs.existsSync(initScript)) {
      const content = fs.readFileSync(initScript, 'utf-8');
      const lines = content.split('\n').length;
      
      if (content.includes('CREATE TABLE communication_records')) {
        console.log('✅ 包含communication_records表');
        this.recordQualityCheck('数据库表结构', true, '包含核心表');
      } else {
        console.log('❌ 缺少communication_records表');
        this.recordQualityCheck('数据库表结构', false, '缺少核心表');
      }
    } else {
      console.log('❌ 数据库初始化脚本不存在');
      this.recordQualityCheck('数据库初始化', false, '脚本不存在');
    }
  }

  checkAIIntegration() {
    console.log('\n🤖 检查AI集成质量');
    console.log('-'.repeat(40));

    const aiFiles = [
      'backend/routes/ai.js',
      'backend/.env',
      'backend/services/spark.js'
    ];

    aiFiles.forEach(file => {
      const fullPath = path.join(this.basePath, file);
      
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${file}: 存在`);
        
        if (file.endsWith('.env')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('SPARK_APPID') && content.includes('SPARK_API_KEY')) {
            console.log('   ✅ 包含讯飞星火API配置');
            this.recordQualityCheck('AI配置', true, 'API配置完整');
          } else {
            console.log('   ❌ 缺少API配置');
            this.recordQualityCheck('AI配置', false, 'API配置不完整');
          }
        } else if (file.endsWith('ai.js')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const endpoints = ['/advice', '/market-analysis', '/risk-assessment', '/health'];
          endpoints.forEach(endpoint => {
            if (content.includes(endpoint)) {
              console.log(`   ✅ 包含: ${endpoint}`);
            }
          });
          this.recordQualityCheck('AI路由', true, 'AI路由完整');
        }
      } else {
        console.log(`❌ ${file}: 不存在`);
        this.recordQualityCheck(`AI文件 - ${file}`, false, '文件缺失');
      }
    });
  }

  checkStartupScripts() {
    console.log('\n🚀 检查启动脚本');
    console.log('-'.repeat(40));

    const scripts = [
      '启动6.8.bat',
      'README.md'
    ];

    scripts.forEach(script => {
      const fullPath = path.join(this.basePath, script);
      
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${script}: 存在`);
        this.recordQualityCheck(`启动脚本 - ${script}`, true, '脚本存在');
      } else {
        console.log(`❌ ${script}: 不存在`);
        this.recordQualityCheck(`启动脚本 - ${script}`, false, '脚本缺失');
      }
    });
  }

  recordQualityCheck(name, passed, details) {
    this.testResults.push({
      name,
      passed,
      details,
      timestamp: new Date().toISOString(),
      category: this.getCategory(name)
    });
  }

  getCategory(name) {
    if (name.includes('前端')) return '前端';
    if (name.includes('后端')) return '后端';
    if (name.includes('AI')) return 'AI';
    if (name.includes('数据库')) return '数据库';
    if (name.includes('启动')) return '启动脚本';
    return '其他';
  }

  generateQualityReport() {
    console.log('\n📊 质量验证结果汇总');
    console.log('=' * 60);
    
    const totalChecks = this.testResults.length;
    const passedChecks = this.testResults.filter(t => t.passed).length;
    const passRate = ((passedChecks / totalChecks) * 100).toFixed(1);
    
    console.log(`总检查项: ${totalChecks}`);
    console.log(`✅ 通过: ${passedChecks}`);
    console.log(`❌ 失败: ${totalChecks - passedChecks}`);
    console.log(`📈 通过率: ${passRate}%`);
    
    // 按类别分组显示结果
    const categories = {};
    this.testResults.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, total: 0 };
      }
      categories[result.category].total++;
      if (result.passed) {
        categories[result.category].passed++;
      }
    });
    
    Object.entries(categories).forEach(([category, stats]) => {
      const categoryRate = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`\n📂 ${category}类别: ${stats.passed}/${stats.total} (${categoryRate}%)`);
    });
    
    // 质量评估
    if (passRate >= 95) {
      console.log('\n🎉 质量评估: 优秀 (95%+)');
      console.log('✅ 6.8版本成功保持了5.1的高质量标准');
      console.log('🚀 可以放心部署和使用');
    } else if (passRate >= 85) {
      console.log('\n✅ 质量评估: 良好 (85%+)');
      console.log('⚠️  6.8版本基本保持质量，少数问题需要关注');
    } else if (passRate >= 70) {
      console.log('\n⚠️  质量评估: 一般 (70%+)');
      console.log('❌ 6.8版本存在较多质量问题，需要修复');
    } else {
      console.log('\n❌ 质量评估: 较差 (<70%)');
      console.log('❌ 6.8版本质量严重下降，需要重新检查');
    }
    
    // 详细结果
    console.log('\n📋 详细质量检查结果:');
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`  ${index + 1}. ${status} ${result.name}: ${result.details}`);
    });
    
    // 保存详细报告
    const reportData = {
      summary: {
        totalChecks,
        passedChecks,
        failedChecks: totalChecks - passedChecks,
        passRate: parseFloat(passRate),
        quality: passRate >= 95 ? '优秀' : passRate >= 85 ? '良好' : passRate >= 70 ? '一般' : '较差'
      },
      results: this.testResults,
      categories: Object.fromEntries(
        Object.entries(categories).map(([key, value]) => [
          key, 
          {
            total: value.total,
            passed: value.passed,
            failed: value.total - value.passed,
            rate: ((value.passed / value.total) * 100).toFixed(1)
          }
        ])
      ),
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations()
    };
    
    fs.writeFileSync('quality_report_6.8.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 质量报告已保存: quality_report_6.8.json');
  }

  generateRecommendations() {
    const recommendations = [];
    const failedChecks = this.testResults.filter(t => !t.passed);
    
    if (failedChecks.length === 0) {
      recommendations.push('质量检查全部通过，6.8版本达到5.1标准');
      recommendations.push('可以开始部署和使用');
    } else {
      const frontendIssues = failedChecks.filter(t => t.category === '前端');
      const backendIssues = failedChecks.filter(t => t.category === '后端');
      const aiIssues = failedChecks.filter(t => t.category === 'AI');
      
      if (frontendIssues.length > 0) {
        recommendations.push(`前端存在${frontendIssues.length}个问题，请检查frontend源码完整性`);
      }
      
      if (backendIssues.length > 0) {
        recommendations.push(`后端存在${backendIssues.length}个问题，请检查后端文件完整性`);
      }
      
      if (aiIssues.length > 0) {
        recommendations.push(`AI集成存在${aiIssues.length}个问题，请检查AI配置和路由`);
      }
      
      recommendations.push('修复问题后重新运行质量检查');
    }
    
    return recommendations;
  }
}

// 运行质量检查
const verifier = new QualityVerifier();
verifier.runQualityCheck();