@echo off
chcp 65001 >nul
echo 🚀 开始推送到 GitHub 仓库...
echo.

REM 1. 检查远程仓库配置
echo 📋 检查远程仓库配置...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  远程仓库未配置，正在添加...
    git remote add origin https://github.com/youyoupum/ReactNotePad.git
    echo ✅ 远程仓库已添加
) else (
    echo ✅ 远程仓库已配置
    git remote set-url origin https://github.com/youyoupum/ReactNotePad.git
    echo ✅ 远程仓库地址已更新
)

REM 2. 检查当前分支
echo.
echo 📋 检查当前分支...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo ✅ 当前分支: %CURRENT_BRANCH%

REM 3. 添加所有文件
echo.
echo 📦 添加所有文件到 Git...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件已添加到暂存区

REM 4. 检查是否有更改需要提交
echo.
echo 📋 检查是否有更改需要提交...
git diff --cached --quiet
if errorlevel 1 (
    REM 5. 提交更改
    echo.
    echo 💾 提交更改...
    git commit -m "feat: 完成 React 笔记本应用开发" -m "- 实现笔记 CRUD 功能" -m "- 集成 Zustand 状态管理" -m "- 添加 React Router 路由导航" -m "- 实现 Markdown 编辑器" -m "- 添加主题切换功能" -m "- 实现用户认证功能" -m "- 添加搜索、筛选、排序功能" -m "- 实现拖拽排序功能" -m "- 完善项目文档"
    if errorlevel 1 (
        echo ❌ 提交失败
        pause
        exit /b 1
    )
    echo ✅ 更改已提交
) else (
    echo ℹ️  没有更改需要提交
)

REM 6. 推送到远程仓库
echo.
echo 🚀 推送到远程仓库...
git push -u origin %CURRENT_BRANCH%
if errorlevel 1 (
    echo.
    echo ❌ 推送失败
    echo 💡 提示: 如果是第一次推送，可能需要先拉取远程更改
    echo 💡 可以尝试执行: git pull origin %CURRENT_BRANCH% --allow-unrelated-histories
    pause
    exit /b 1
)

echo.
echo ✅ 代码已成功推送到 GitHub!
echo 🌐 仓库地址: https://github.com/youyoupum/ReactNotePad
echo.
echo 🎉 完成!
pause

