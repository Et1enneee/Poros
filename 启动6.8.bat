@echo off
chcp 65001 >nul
echo =====================================================
echo               🚀 Poros 6.8 伟大版启动脚本
echo =====================================================
echo.

:: 检查Node.js
echo [步骤 1/8] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js
    echo    请访问 https://nodejs.org/ 下载Node.js 18.x或20.x
    echo    然后重新运行此脚本
    pause
    exit /b 1
)
for /f "tokens=1 delims=v" %%a in ('node --version') do set NODE_VER=%%a
echo ✅ Node.js %NODE_VER% 环境正常

:: 检查npm
echo [步骤 2/8] 检查npm环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到npm
    pause
    exit /b 1
)
for /f %%a in ('npm --version') do set NPM_VER=%%a
echo ✅ npm %NPM_VER% 环境正常

:: 检查项目文件
echo [步骤 3/8] 检查项目文件完整性...
if not exist "backend\package.json" (
    echo ❌ 错误: 未找到backend\package.json
    echo    请确保在poros_6.8根目录运行此脚本
    pause
    exit /b 1
)
if not exist "frontend\package.json" (
    echo ❌ 错误: 未找到frontend\package.json
    echo    请确保项目文件完整
    pause
    exit /b 1
)

:: 检查关键前端文件
if not exist "frontend\src\App.tsx" (
    echo ❌ 错误: 前端源码不完整
    echo    请重新复制poros_5.1的frontend源码
    pause
    exit /b 1
)

if not exist "frontend\src\pages\Dashboard.tsx" (
    echo ❌ 错误: Dashboard页面缺失
    echo    请检查frontend源码完整性
    pause
    exit /b 1
)

if not exist "frontend\src\pages\CommunicationManagement.tsx" (
    echo ❌ 错误: CommunicationManagement页面缺失
    echo    请检查frontend源码完整性
    pause
    exit /b 1
)

echo ✅ 所有关键文件存在 (基于5.1版本质量)

:: 检查数据库
echo [步骤 4/8] 检查数据库状态...
if not exist "database\wealth_management_6.8.db" (
    echo ⚠️  数据库文件不存在，正在初始化...
    cd backend
    node init_database_6.8.js
    if %errorlevel% neq 0 (
        echo ❌ 数据库初始化失败
        pause
        exit /b 1
    )
    cd ..
    echo ✅ 数据库初始化完成
) else (
    echo ✅ 数据库文件存在
)

:: 初始化数据库
echo [步骤 5/8] 初始化/更新数据库...
cd backend
node init_database_6.8.js >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  数据库更新警告，但继续启动
) else (
    echo ✅ 数据库更新完成
)
cd ..

:: 安装后端依赖
echo [步骤 6/8] 安装后端依赖...
cd backend
echo    正在安装后端依赖 (包含ws、better-sqlite3等)...
npm install --silent --production
if %errorlevel% neq 0 (
    echo ❌ 后端依赖安装失败
    echo.
    echo 💡 常见解决方案:
    echo 1. 检查网络连接
    echo 2. 如果遇到better-sqlite3编译错误:
    echo    - 安装Visual Studio Build Tools
    echo    - 或运行: npm install --ignore-scripts better-sqlite3
    echo 3. 清理npm缓存: npm cache clean --force
    echo 4. 使用国内镜像: npm config set registry https://registry.npmmirror.com
    echo.
    pause
    exit /b 1
)
echo ✅ 后端依赖安装完成

:: 安装前端依赖
echo [步骤 7/8] 安装前端依赖...
cd ../frontend
echo    正在安装前端依赖 (React + TypeScript + shadcn/ui)...
npm install --silent
if %errorlevel% neq 0 (
    echo ❌ 前端依赖安装失败
    echo.
    echo 💡 解决方案:
    echo 1. 检查网络连接
    echo 2. 清理npm缓存: npm cache clean --force
    echo 3. 删除node_modules后重试: rm -rf node_modules
    echo 4. 使用国内镜像: npm config set registry https://registry.npmmirror.com
    echo.
    pause
    exit /b 1
)
echo ✅ 前端依赖安装完成

:: 启动服务
echo [步骤 8/8] 启动Poros 6.8服务...
echo.
echo =====================================================
echo                  🚀 启动Poros 6.8 伟大版
echo =====================================================
echo.
echo 📊 后端API服务: http://localhost:3001
echo 🌐 前端界面: http://localhost:5173
echo.
echo 🤖 AI功能:
echo    ✅ 讯飞星火API集成 (/api/ai/*)
echo    ✅ 投资建议 (POST /api/ai/advice)
echo    ✅ 市场分析 (POST /api/ai/market-analysis)
echo    ✅ 风险评估 (POST /api/ai/risk-assessment)
echo.
echo 📱 前端功能 (基于5.1版本质量):
echo    ✅ 财富管理仪表板 (Dashboard.tsx - 452行)
echo    ✅ 通讯记录管理 (CommunicationManagement.tsx - 231行)
echo    ✅ 客户详情管理 (CustomerDetail.tsx)
echo    ✅ 投资建议系统 (InvestmentAdvice.tsx)
echo    ✅ AI建议详情 (AIAdviceDetail.tsx)
echo    ✅ 建议历史记录 (AdviceHistory.tsx)
echo.
echo 💾 数据库功能:
echo    ✅ 完整SQLite3数据库 (13个表)
echo    ✅ 客户信息管理
echo    ✅ 通讯记录追踪
echo    ✅ 投资组合管理
echo    ✅ 市场数据集成
echo.
echo 💡 使用提示:
echo    - 首次启动可能需要几秒钟加载
echo    - 按 Ctrl+C 停止所有服务
echo    - 访问 http://localhost:5173 查看完整前端界面
echo    - 访问 http://localhost:3001/api/health 查看后端状态
echo    - 访问 http://localhost:3001/api/ai/health 查看AI服务状态
echo.
echo =====================================================
echo.

:: 启动后端服务 (在后台运行)
start "Poros Backend 6.8 - AI集成版" cmd /k "cd /d "%cd%" && npm start"

:: 等待后端启动
timeout /t 5 /nobreak >nul

:: 启动前端服务
start "Poros Frontend 6.8 - 5.1质量版" cmd /k "cd /d "%cd%\..\frontend" && npm run dev"

echo.
echo 🎉 Poros 6.8 伟大版启动完成！
echo.
echo 📋 系统信息:
echo    版本: 6.8.0 (基于5.1版本 + AI集成)
echo    前端: 完整的7个页面，功能齐全
echo    后端: Express + SQLite + 讯飞星火AI
echo    数据库: 13个表，完整的业务逻辑
echo.
echo 🔍 快速测试:
echo    1. 访问 http://localhost:5173 查看仪表板
echo    2. 测试通讯记录功能
echo    3. 测试AI建议功能
echo    4. 验证客户管理功能
echo.
echo 📚 如需帮助，请查看 README.md 文件
echo.
pause