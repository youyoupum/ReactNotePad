# 🧪 自定义 Hooks 测试指南

本指南帮助你验证 `useLocalStorage` 和 `useDebounce` Hook 的功能是否正常工作。

---

## 🎯 测试清单

### ✅ useLocalStorage Hook 测试

#### 测试 1: 数据持久化
1. 打开应用，创建几条笔记
2. 刷新页面（F5）
3. **预期结果：** 笔记仍然存在（没有丢失）

#### 测试 2: 关闭浏览器后恢复
1. 创建一些笔记
2. 完全关闭浏览器
3. 重新打开浏览器，访问应用
4. **预期结果：** 笔记仍然存在

#### 测试 3: 多标签页同步
1. 在一个标签页打开应用
2. 在另一个标签页也打开应用
3. 在第一个标签页添加一条笔记
4. **预期结果：** 第二个标签页自动显示新笔记

#### 测试 4: 查看 localStorage
1. 打开浏览器开发者工具（F12）
2. 切换到 "Application" 或 "存储" 标签
3. 展开 "Local Storage"
4. **预期结果：** 能看到 `notes` 键及其对应的 JSON 数据

---

### ✅ useDebounce Hook 测试

#### 测试 1: 防抖提示显示
1. 在搜索框中快速输入 "测试"
2. 观察搜索框下方的提示文字
3. **预期结果：** 
   - 输入时显示 "⌛ 正在输入中..."（黄色斜体）
   - 停止输入 300ms 后显示 "🔍 找到 X 条相关笔记"

#### 测试 2: 防抖延迟效果
1. 在搜索框中输入一个字符（如 "a"）
2. 立即观察笔记列表
3. 等待约 300ms
4. **预期结果：**
   - 输入后列表不会立即变化
   - 300ms 后列表才会更新

#### 测试 3: 快速输入测试
1. 打开浏览器控制台（F12）
2. 在搜索框中快速输入 "React"（5 个字符）
3. 观察控制台（如果你之前有添加日志）
4. **预期结果：** 只执行一次搜索（而不是 5 次）

#### 测试 4: 性能对比
1. 创建至少 10 条笔记
2. 快速在搜索框中输入一长串文字
3. 观察界面是否流畅
4. **预期结果：** 界面不会卡顿或闪烁

---

## 🛠️ 调试技巧

### 1. 查看 localStorage 数据

```javascript
// 在浏览器控制台执行：
console.log(localStorage.getItem('notes'));
```

### 2. 清空 localStorage

```javascript
// 在浏览器控制台执行：
localStorage.clear();
// 然后刷新页面
```

### 3. 添加调试日志

如果想看到防抖的详细过程，可以在 `useDebounce.js` 中添加日志：

```javascript
useEffect(() => {
  console.log('⏰ 设置定时器，等待', delay, 'ms');
  
  const handler = setTimeout(() => {
    console.log('✅ 定时器触发，更新值为:', value);
    setDebouncedValue(value);
  }, delay);

  return () => {
    console.log('🧹 清理上一个定时器');
    clearTimeout(handler);
  };
}, [value, delay]);
```

### 4. 观察 React DevTools

1. 安装 React DevTools 浏览器扩展
2. 打开 DevTools，切换到 "Components" 标签
3. 选择 App 组件
4. 观察右侧的 Hooks 列表
5. **预期结果：** 能看到 `State`、`Reducer`、`Effect` 等 Hooks

---

## 📊 性能测试

### 测试搜索性能

1. 创建 50+ 条笔记（可以复制粘贴）
2. 打开浏览器性能监控（F12 -> Performance 标签）
3. 点击 "Record" 开始录制
4. 在搜索框中快速输入 "测试"
5. 等待 1 秒后停止录制
6. 查看性能火焰图

**预期结果：**
- 应该只看到一次明显的计算峰值（在停止输入 300ms 后）
- 输入过程中不应该有频繁的计算

---

## 🐛 常见问题排查

### 问题 1: 刷新页面后笔记丢失

**可能原因：**
- localStorage 被禁用（隐私模式）
- 浏览器不支持 localStorage

**解决方法：**
```javascript
// 在控制台测试 localStorage 是否可用
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage 可用');
} catch (e) {
  console.error('❌ localStorage 不可用:', e);
}
```

### 问题 2: 搜索没有延迟效果

**可能原因：**
- delay 参数设置太小
- 浏览器性能过快，看不出延迟

**解决方法：**
```javascript
// 增大延迟时间以便观察
const debouncedSearchTerm = useDebounce(searchTerm, 1000); // 1 秒
```

### 问题 3: 多标签页不同步

**可能原因：**
- 在同一标签页修改不会触发 storage 事件
- 需要在不同标签页之间测试

**验证方法：**
1. 打开两个不同的浏览器标签页
2. 在标签页 A 添加笔记
3. 切换到标签页 B 查看

---

## ✅ 验收标准

所有以下功能都正常工作，表示实现成功：

- ✅ 刷新页面后数据不丢失
- ✅ 关闭浏览器后数据仍然存在
- ✅ 多标签页数据自动同步
- ✅ 搜索时显示 "正在输入中..." 提示
- ✅ 停止输入 300ms 后才执行搜索
- ✅ 快速输入时界面不卡顿
- ✅ 搜索结果正确显示

---

## 🎉 测试完成！

如果所有测试都通过，恭喜你成功实现了两个实用的自定义 Hooks！

**下一步：**
- 尝试创建更多自定义 Hooks
- 优化现有 Hooks 的性能
- 为 Hooks 编写单元测试

Happy Coding! 🚀

