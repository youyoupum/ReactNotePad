# Git 推送到远程仓库脚本
# 使用方法：在 PowerShell 中执行 .\push-to-github.ps1

Write-Host "🚀 开始推送到 GitHub 仓库..." -ForegroundColor Green

# 1. 检查远程仓库配置
Write-Host "`n📋 检查远程仓库配置..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  远程仓库未配置，正在添加..." -ForegroundColor Yellow
    git remote add origin https://github.com/youyoupum/ReactNotePad.git
    Write-Host "✅ 远程仓库已添加" -ForegroundColor Green
} else {
    Write-Host "✅ 远程仓库已配置: $remoteUrl" -ForegroundColor Green
    # 检查是否需要更新远程仓库地址
    if ($remoteUrl -ne "https://github.com/youyoupum/ReactNotePad.git") {
        Write-Host "⚠️  远程仓库地址不匹配，正在更新..." -ForegroundColor Yellow
        git remote set-url origin https://github.com/youyoupum/ReactNotePad.git
        Write-Host "✅ 远程仓库地址已更新" -ForegroundColor Green
    }
}

# 2. 检查当前分支
Write-Host "`n📋 检查当前分支..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "✅ 当前分支: $currentBranch" -ForegroundColor Green

# 3. 检查 node_modules 是否被跟踪
Write-Host "`n🔍 检查 node_modules 是否被跟踪..." -ForegroundColor Yellow
$nodeModulesFiles = git ls-files | Select-String "node_modules"
if ($nodeModulesFiles) {
    Write-Host "⚠️  警告: node_modules 中有文件被 Git 跟踪!" -ForegroundColor Red
    Write-Host "   正在从 Git 中移除 node_modules..." -ForegroundColor Yellow
    git rm -r --cached node_modules 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ node_modules 已从 Git 跟踪中移除" -ForegroundColor Green
    }
} else {
    Write-Host "✅ node_modules 没有被 Git 跟踪" -ForegroundColor Green
}

# 4. 添加所有文件（node_modules 会被 .gitignore 忽略）
Write-Host "`n📦 添加所有文件到 Git..." -ForegroundColor Yellow
Write-Host "   注意: node_modules 会被 .gitignore 自动忽略，不会被提交" -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 文件已添加到暂存区" -ForegroundColor Green
} else {
    Write-Host "❌ 添加文件失败" -ForegroundColor Red
    exit 1
}

# 5. 验证 node_modules 不会被提交
Write-Host "`n🔍 验证 node_modules 不会被提交..." -ForegroundColor Yellow
$stagedFiles = git diff --cached --name-only
$nodeModulesInStaged = $stagedFiles | Select-String "node_modules"
if ($nodeModulesInStaged) {
    Write-Host "⚠️  警告: 暂存区中有 node_modules 相关的文件!" -ForegroundColor Red
    Write-Host "   正在从暂存区移除..." -ForegroundColor Yellow
    git reset HEAD node_modules 2>$null
    Write-Host "✅ node_modules 已从暂存区移除" -ForegroundColor Green
} else {
    Write-Host "✅ 确认: node_modules 不会被提交" -ForegroundColor Green
}

# 6. 检查是否有更改需要提交
Write-Host "`n📋 检查是否有更改需要提交..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  没有更改需要提交" -ForegroundColor Cyan
} else {
    # 7. 提交更改
    Write-Host "`n💾 提交更改..." -ForegroundColor Yellow
    $commitMessage = "feat: 完成 React 笔记本应用开发

- 实现笔记 CRUD 功能
- 集成 Zustand 状态管理
- 添加 React Router 路由导航
- 实现 Markdown 编辑器
- 添加主题切换功能
- 实现用户认证功能
- 添加搜索、筛选、排序功能
- 实现拖拽排序功能
- 完善项目文档"

    git commit -m $commitMessage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 更改已提交" -ForegroundColor Green
    } else {
        Write-Host "❌ 提交失败" -ForegroundColor Red
        exit 1
    }
}

# 8. 推送到远程仓库
Write-Host "`n🚀 推送到远程仓库..." -ForegroundColor Yellow
Write-Host "⚠️  如果是第一次推送，可能需要设置上游分支" -ForegroundColor Yellow
git push -u origin $currentBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 代码已成功推送到 GitHub!" -ForegroundColor Green
    Write-Host "🌐 仓库地址: https://github.com/youyoupum/ReactNotePad" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ 推送失败" -ForegroundColor Red
    Write-Host "💡 提示: 如果是第一次推送，可能需要先拉取远程更改" -ForegroundColor Yellow
    Write-Host "💡 可以尝试执行: git pull origin $currentBranch --allow-unrelated-histories" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎉 完成!" -ForegroundColor Green

