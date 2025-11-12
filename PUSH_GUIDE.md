# 🚀 推送到 GitHub 仓库指南

## 远程仓库地址
https://github.com/youyoupum/ReactNotePad

## 推送步骤

### 方法一：使用 PowerShell 脚本（推荐）

1. 在项目根目录打开 PowerShell
2. 执行以下命令：
```powershell
.\push-to-github.ps1
```

### 方法二：手动执行命令

#### 1. 检查并配置远程仓库

```bash
# 检查是否已配置远程仓库
git remote -v

# 如果没有配置，添加远程仓库
git remote add origin https://github.com/youyoupum/ReactNotePad.git

# 如果已配置但地址不对，更新远程仓库地址
git remote set-url origin https://github.com/youyoupum/ReactNotePad.git
```

#### 2. 添加所有文件到 Git

```bash
git add .
```

#### 3. 提交更改

```bash
git commit -m "feat: 完成 React 笔记本应用开发

- 实现笔记 CRUD 功能
- 集成 Zustand 状态管理
- 添加 React Router 路由导航
- 实现 Markdown 编辑器
- 添加主题切换功能
- 实现用户认证功能
- 添加搜索、筛选、排序功能
- 实现拖拽排序功能
- 完善项目文档"
```

#### 4. 推送到远程仓库

```bash
# 推送到远程仓库（第一次推送需要设置上游分支）
git push -u origin wjx

# 或者推送到 main 分支
git push -u origin main
```

#### 5. 如果是第一次推送且远程仓库不为空

如果远程仓库已经有内容（比如 README），可能需要先拉取：

```bash
# 拉取远程更改并合并
git pull origin wjx --allow-unrelated-histories

# 然后再推送
git push -u origin wjx
```

## 注意事项

1. **node_modules 不会被提交**：
   - `.gitignore` 文件中已配置 `/node_modules`，确保 `node_modules` 目录不会被提交
   - 推送脚本会自动检查并确保 `node_modules` 不会被提交
   - 如果 `node_modules` 已经被 Git 跟踪，脚本会自动从 Git 中移除
   - ✅ **你可以放心使用推送脚本，`node_modules` 不会被上传到 GitHub**

2. **分支名称**：当前分支是 `wjx`，如果你想推送到 `main` 分支，需要：
   ```bash
   # 切换到 main 分支
   git checkout -b main
   # 或者重命名当前分支
   git branch -M main
   ```

3. **认证**：如果推送时提示需要认证，可能需要：
   - 使用 Personal Access Token（推荐）
   - 或者使用 SSH 密钥

4. **.gitignore**：已配置忽略以下文件/目录：
   - `node_modules/` - 依赖包（不会被提交）
   - `build/` - 构建文件（不会被提交）
   - `*.backup` - 备份文件
   - `.vscode/`, `.idea/` - IDE 配置文件
   - 其他临时文件

## 验证推送

推送成功后，可以访问以下地址查看：
- https://github.com/youyoupum/ReactNotePad

## 常见问题

### Q: 推送失败，提示 "remote: Permission denied"
A: 需要配置 GitHub 认证，使用 Personal Access Token 或 SSH 密钥

### Q: 推送失败，提示 "Updates were rejected"
A: 远程仓库有新的提交，需要先拉取：
```bash
git pull origin wjx --rebase
git push -u origin wjx
```

### Q: 推送失败，提示 "fatal: 'origin' does not appear to be a git repository"
A: 远程仓库未配置，执行：
```bash
git remote add origin https://github.com/youyoupum/ReactNotePad.git
```

### Q: node_modules 会被提交吗？
A: **不会**。`.gitignore` 文件中已配置 `/node_modules`，推送脚本也会自动检查并确保 `node_modules` 不会被提交。如果你担心，可以运行 `check-git-status.bat` 或 `check-git-status.ps1` 检查。

### Q: 如何确认 node_modules 不会被提交？
A: 可以运行检查脚本：
```bash
# Windows 批处理文件
check-git-status.bat

# PowerShell 脚本
.\check-git-status.ps1
```

或者手动检查：
```bash
# 检查 .gitignore 是否包含 node_modules
cat .gitignore | grep node_modules

# 检查是否有 node_modules 被跟踪
git ls-files | grep node_modules

# 检查暂存区是否有 node_modules
git diff --cached --name-only | grep node_modules
```

