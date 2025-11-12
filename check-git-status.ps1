# 检查 Git 状态脚本
# 用于检查 node_modules 是否会被提交

Write-Host "🔍 检查 Git 状态..." -ForegroundColor Yellow
Write-Host ""

# 检查 node_modules 是否被 git 跟踪
Write-Host "📦 检查 node_modules 是否被跟踪..." -ForegroundColor Cyan
$nodeModulesFiles = git ls-files | Select-String "node_modules"
if ($nodeModulesFiles) {
    Write-Host "⚠️  警告: node_modules 中有文件被 Git 跟踪!" -ForegroundColor Red
    Write-Host "   需要从 Git 中移除这些文件" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   执行以下命令移除:" -ForegroundColor Yellow
    Write-Host "   git rm -r --cached node_modules" -ForegroundColor Green
    Write-Host "   git commit -m 'chore: 从 Git 中移除 node_modules'" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules 没有被 Git 跟踪" -ForegroundColor Green
}

Write-Host ""

# 检查 .gitignore 是否包含 node_modules
Write-Host "📋 检查 .gitignore 配置..." -ForegroundColor Cyan
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "node_modules") {
    Write-Host "✅ .gitignore 已包含 node_modules" -ForegroundColor Green
} else {
    Write-Host "⚠️  警告: .gitignore 中没有包含 node_modules!" -ForegroundColor Red
}

Write-Host ""

# 检查将要提交的文件
Write-Host "📝 检查将要提交的文件..." -ForegroundColor Cyan
$stagedFiles = git diff --cached --name-only
$allFiles = git status --short

if ($stagedFiles) {
    Write-Host "已暂存的文件:" -ForegroundColor Yellow
    $stagedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
} else {
    Write-Host "ℹ️  没有已暂存的文件" -ForegroundColor Cyan
}

Write-Host ""

# 检查是否有 node_modules 相关的文件在暂存区
$nodeModulesInStaged = $stagedFiles | Select-String "node_modules"
if ($nodeModulesInStaged) {
    Write-Host "⚠️  警告: 暂存区中有 node_modules 相关的文件!" -ForegroundColor Red
    Write-Host "   执行以下命令从暂存区移除:" -ForegroundColor Yellow
    Write-Host "   git reset HEAD node_modules" -ForegroundColor Green
} else {
    Write-Host "✅ 暂存区中没有 node_modules 相关的文件" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 Git 状态摘要:" -ForegroundColor Cyan
git status --short

