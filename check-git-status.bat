@echo off
chcp 65001 >nul
echo 🔍 检查 Git 状态...
echo.

REM 检查 node_modules 是否被 git 跟踪
echo 📦 检查 node_modules 是否被跟踪...
git ls-files | findstr "node_modules" >nul
if errorlevel 1 (
    echo ✅ node_modules 没有被 Git 跟踪
) else (
    echo ⚠️  警告: node_modules 中有文件被 Git 跟踪!
    echo    需要从 Git 中移除这些文件
    echo.
    echo    执行以下命令移除:
    echo    git rm -r --cached node_modules
    echo    git commit -m "chore: 从 Git 中移除 node_modules"
)

echo.

REM 检查 .gitignore 是否包含 node_modules
echo 📋 检查 .gitignore 配置...
findstr /C:"node_modules" .gitignore >nul
if errorlevel 1 (
    echo ⚠️  警告: .gitignore 中没有包含 node_modules!
) else (
    echo ✅ .gitignore 已包含 node_modules
)

echo.

REM 检查将要提交的文件
echo 📝 检查将要提交的文件...
git diff --cached --name-only >nul
if errorlevel 1 (
    echo ℹ️  没有已暂存的文件
) else (
    echo 已暂存的文件:
    git diff --cached --name-only
)

echo.

REM 检查是否有 node_modules 相关的文件在暂存区
git diff --cached --name-only | findstr "node_modules" >nul
if errorlevel 1 (
    echo ✅ 暂存区中没有 node_modules 相关的文件
) else (
    echo ⚠️  警告: 暂存区中有 node_modules 相关的文件!
    echo    执行以下命令从暂存区移除:
    echo    git reset HEAD node_modules
)

echo.
echo 📊 Git 状态摘要:
git status --short

pause

