# 🎣 自定义 Hooks 实现详解

本文档详细介绍了在 React 记事本应用中实现的两个自定义 Hooks：`useLocalStorage` 和 `useDebounce`。

---

## 📚 目录

1. [什么是自定义 Hook？](#什么是自定义-hook)
2. [useLocalStorage Hook](#uselocalStorage-hook)
3. [useDebounce Hook](#usedebounce-hook)
4. [核心概念详解](#核心概念详解)
5. [实际应用效果](#实际应用效果)
6. [性能优化对比](#性能优化对比)

---

## 什么是自定义 Hook？

### 📖 定义

**自定义 Hook** 是以 "use" 开头的函数，它可以调用其他 Hooks（如 `useState`、`useEffect` 等），用于封装和复用组件逻辑。

### 🎯 为什么需要自定义 Hook？

1. **逻辑复用**：将重复的逻辑提取到独立的函数中
2. **代码简洁**：让组件代码更清晰，关注点分离
3. **易于测试**：可以单独测试 Hook 的逻辑
4. **提升维护性**：一处修改，多处生效

### ✅ 自定义 Hook 规则

1. 名称必须以 "use" 开头（如 `useLocalStorage`）
2. 只能在函数组件或其他 Hook 中调用
3. 不能在条件语句、循环或嵌套函数中调用
4. 可以调用其他 Hooks

---

## useLocalStorage Hook

### 📝 功能说明

将 React 状态与浏览器的 `localStorage` 自动同步，实现数据持久化。

### 💻 完整代码

```javascript
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 1. 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage 键 "${key}" 时出错:`, error);
      return initialValue;
    }
  });

  // 2. 自定义 setter 函数，支持函数式更新
  const setValue = (value) => {
    try {
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`保存到 localStorage 键 "${key}" 时出错:`, error);
    }
  };

  // 3. 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`同步 localStorage 键 "${key}" 时出错:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
```

### 🔑 核心知识点

#### 1. 惰性初始化（Lazy Initialization）

```javascript
const [storedValue, setStoredValue] = useState(() => {
  // 这个函数只在组件首次挂载时执行一次
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : initialValue;
});
```

**为什么用函数形式？**
- ❌ 直接传值：`useState(localStorage.getItem(key))` 
  - 每次组件重新渲染都会读取 localStorage（浪费性能）
- ✅ 函数形式：`useState(() => {...})`
  - 只在首次挂载时执行一次
  - 后续渲染会跳过这个函数

#### 2. 闭包（Closure）

```javascript
const setValue = (value) => {
  // setValue 函数可以访问外部的 key 和 storedValue
  // 即使 useLocalStorage 执行完毕，这些变量仍然被保留
  const valueToStore = value instanceof Function ? value(storedValue) : value;
  window.localStorage.setItem(key, JSON.stringify(valueToStore));
};
```

**什么是闭包？**
- 函数 + 函数能访问的外部变量
- `setValue` 形成闭包，可以访问 `key` 和 `storedValue`

#### 3. 函数式更新

```javascript
// 支持两种使用方式：
setValue('新值');           // 直接传值
setValue(prev => prev + 1); // 函数式更新
```

#### 4. 多标签页同步

```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === key && e.newValue) {
      setStoredValue(JSON.parse(e.newValue));
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [key]);
```

**效果：** 在一个标签页修改数据，其他标签页自动同步！

### 📊 使用对比

#### ❌ 传统方式

```javascript
function App() {
  // 1. 手动读取 localStorage
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 手动保存到 localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // 代码分散在两处，容易遗漏
}
```

#### ✅ 使用自定义 Hook

```javascript
function App() {
  // 一行代码搞定！自动读取、自动保存、自动同步
  const [notes, setNotes] = useLocalStorage('notes', []);
  
  // 用法和 useState 完全一样
  setNotes([...notes, newNote]);
}
```

---

## useDebounce Hook

### 📝 功能说明

延迟更新值，避免频繁触发操作（如搜索、API 请求），提升性能。

### 💻 完整代码

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置延迟定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：清除上一个定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

### 🔑 核心知识点

#### 1. 防抖原理（Debounce）

```
用户输入 "React"：

时间轴：
0ms:   输入 'R'  -> 启动 500ms 定时器 A
100ms: 输入 'e'  -> 清除定时器 A，启动 500ms 定时器 B
200ms: 输入 'a'  -> 清除定时器 B，启动 500ms 定时器 C
300ms: 输入 'c'  -> 清除定时器 C，启动 500ms 定时器 D
400ms: 输入 't'  -> 清除定时器 D，启动 500ms 定时器 E
900ms: 定时器 E 触发 -> debouncedValue 更新为 "React"

结果：只在用户停止输入 500ms 后，才执行一次搜索
```

#### 2. 闭包在清理函数中的应用

```javascript
useEffect(() => {
  const handler = setTimeout(() => {...}, delay); // 外层变量
  
  return () => {
    clearTimeout(handler); // 内层函数访问外层变量 -> 闭包
  };
}, [value, delay]);
```

**闭包的作用：**
- 即使 `useEffect` 执行完毕，`handler` 变量仍然被清理函数保留
- 下次清理时可以正确访问到上一次的定时器 ID

#### 3. 清理函数的执行时机

```javascript
return () => {
  clearTimeout(handler); // 在下次 effect 执行前调用
};
```

**清理函数何时执行？**
1. 组件卸载时
2. 下次 `useEffect` 执行之前
3. 依赖项 `[value, delay]` 变化时

### 📊 使用对比

#### ❌ 没有防抖

```javascript
function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // 用户每输入一个字符，都会重新计算
  const filteredNotes = notes.filter(note => 
    note.title.includes(searchTerm)
  );

  // 假设有 1000 条笔记：
  // 用户输入 "React"（5 个字符）
  // 会执行 5 次过滤，每次遍历 1000 条 = 5000 次操作！
}
```

#### ✅ 使用防抖

```javascript
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 只有用户停止输入 300ms 后，才会重新计算
  const filteredNotes = notes.filter(note => 
    note.title.includes(debouncedSearchTerm)
  );

  // 假设有 1000 条笔记：
  // 用户输入 "React"（5 个字符）
  // 只执行 1 次过滤 = 1000 次操作！
  // 性能提升 5 倍！
}
```

### 🆚 防抖 vs 节流

| 特性 | 防抖（Debounce） | 节流（Throttle） |
|------|-----------------|-----------------|
| 执行时机 | 延迟执行，重新计时 | 固定间隔执行 |
| 触发规则 | 停止操作后执行 | 定期执行 |
| 应用场景 | 搜索框、表单验证 | 滚动事件、鼠标移动 |
| 形象比喻 | 电梯门（有人进来就重新计时） | 地铁（固定间隔发车） |

---

## 核心概念详解

### 1. 闭包（Closure）

#### 📖 定义

闭包 = 函数 + 函数能访问的外部变量

#### 🌰 例子

```javascript
function createCounter() {
  let count = 0; // 外部变量
  
  return function increment() {
    count++; // 内层函数访问外层变量 -> 形成闭包
    console.log(count);
  };
}

const counter1 = createCounter();
counter1(); // 1
counter1(); // 2
// count 变量被保留了！即使 createCounter 执行完毕
```

#### 在 Hooks 中的应用

**useLocalStorage 中的闭包：**
```javascript
function useLocalStorage(key, initialValue) {
  // key 是外部变量
  
  const setValue = (value) => {
    // setValue 可以访问 key -> 闭包
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  return [storedValue, setValue];
}
```

**useDebounce 中的闭包：**
```javascript
useEffect(() => {
  const handler = setTimeout(...); // 外部变量
  
  return () => {
    clearTimeout(handler); // 清理函数访问 handler -> 闭包
  };
}, [value]);
```

### 2. 惰性初始化（Lazy Initialization）

#### 📖 定义

`useState` 的初始值使用函数形式，只在组件首次挂载时执行一次。

#### 🌰 对比

```javascript
// ❌ 不好：每次渲染都会执行
const [state, setState] = useState(expensiveComputation());

// ✅ 好：只在首次挂载时执行
const [state, setState] = useState(() => expensiveComputation());
```

#### 为什么需要？

```javascript
// 假设读取 localStorage 很慢（比如数据很大）
const [notes, setNotes] = useState(() => {
  console.log('读取 localStorage...');
  const saved = localStorage.getItem('notes');
  return saved ? JSON.parse(saved) : [];
});

// 首次渲染：输出 "读取 localStorage..."
// 后续渲染：不会输出（函数不执行）
```

### 3. 副作用清理（Cleanup）

#### 📖 定义

`useEffect` 返回的函数，用于清理副作用（如定时器、事件监听器）。

#### 🌰 例子

```javascript
useEffect(() => {
  // 副作用：创建定时器
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // 清理函数：清除定时器
  return () => {
    clearInterval(timer);
  };
}, []);
```

#### 清理函数何时执行？

1. **组件卸载时**
2. **下次 effect 执行之前**
3. **依赖项变化时**

#### 为什么需要清理？

```javascript
// ❌ 不清理：内存泄漏
useEffect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  // 组件卸载后，定时器仍在运行！
}, []);

// ✅ 清理：防止内存泄漏
useEffect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  return () => clearInterval(timer); // 组件卸载时清除定时器
}, []);
```

---

## 实际应用效果

### 📝 在记事本应用中的使用

#### 1. useLocalStorage 的应用

**位置：** `src/App.js` 第 54 行

```javascript
// 使用 useLocalStorage Hook 管理笔记持久化
const [savedNotes, setSavedNotes] = useLocalStorage('notes', []);

const [state, dispatch] = useReducer(
  notesReducer,
  {
    ...initialState,
    notes: savedNotes  // 从 localStorage 读取初始值
  }
);

// 自动同步到 localStorage
useEffect(() => {
  setSavedNotes(notes);
}, [notes, setSavedNotes]);
```

**效果：**
- ✅ 刷新页面，笔记不会丢失
- ✅ 关闭浏览器重新打开，笔记仍然存在
- ✅ 在多个标签页打开，数据自动同步

#### 2. useDebounce 的应用

**位置：** `src/App.js` 第 154 行

```javascript
// 使用 useDebounce Hook 实现搜索防抖
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// 使用防抖后的值进行过滤
const filteredNotes = useMemo(() => {
  let result = notes;
  
  if (debouncedSearchTerm.trim()) {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    result = result.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(lowerSearchTerm);
      const contentMatch = note.content.toLowerCase().includes(lowerSearchTerm);
      return titleMatch || contentMatch;
    });
  }
  
  return result;
}, [notes, debouncedSearchTerm, selectedTag, sortBy, sortOrder]);
```

**效果：**
- ✅ 用户快速输入时，不会频繁触发搜索
- ✅ 等待 300ms 后才执行搜索，减少计算次数
- ✅ 界面不会频繁闪烁，体验更流畅

#### 3. 防抖提示效果

**位置：** `src/App.js` 第 442 行

```javascript
{/* 当用户正在输入时，显示提示 */}
{searchTerm && searchTerm !== debouncedSearchTerm && (
  <small style={{ color: '#ffd700', fontStyle: 'italic' }}>
    ⌛ 正在输入中...
  </small>
)}

{/* 防抖完成后，显示搜索结果 */}
{debouncedSearchTerm && (
  <small>
    🔍 找到 {filteredNotes.length} 条相关笔记
  </small>
)}
```

**效果：**
- ✅ 用户输入时显示 "⌛ 正在输入中..."
- ✅ 停止输入 300ms 后显示搜索结果

---

## 性能优化对比

### 📊 搜索性能测试

假设有 **1000 条笔记**，用户搜索 "React"（输入 5 个字符）：

#### ❌ 没有防抖

```
输入 'R': 过滤 1000 条笔记
输入 'e': 过滤 1000 条笔记
输入 'a': 过滤 1000 条笔记
输入 'c': 过滤 1000 条笔记
输入 't': 过滤 1000 条笔记

总计：5 次过滤，5000 次比较操作
```

#### ✅ 使用防抖（300ms）

```
输入 'R': 启动定时器 A
输入 'e': 清除 A，启动定时器 B
输入 'a': 清除 B，启动定时器 C
输入 'c': 清除 C，启动定时器 D
输入 't': 清除 D，启动定时器 E
等待 300ms
定时器 E 触发: 过滤 1000 条笔记

总计：1 次过滤，1000 次比较操作
性能提升：5 倍！
```

### 📊 localStorage 性能优化

#### ❌ 传统方式

```javascript
// 每次组件渲染都会读取（即使不需要）
const saved = localStorage.getItem('notes');

// 手动处理 JSON 解析（容易出错）
const notes = saved ? JSON.parse(saved) : [];

// 手动保存（代码分散）
useEffect(() => {
  localStorage.setItem('notes', JSON.stringify(notes));
}, [notes]);
```

#### ✅ 使用 useLocalStorage

```javascript
// 只在首次挂载时读取（惰性初始化）
const [notes, setNotes] = useLocalStorage('notes', []);

// 自动处理 JSON 序列化/反序列化
// 自动错误处理
// 自动多标签页同步
```

---

## 🎓 学习总结

### ✅ 你学到了什么？

1. **自定义 Hook 设计**
   - 如何封装可复用的逻辑
   - 如何设计简洁的 API
   - 如何处理边界情况（错误处理）

2. **逻辑复用**
   - 将重复的代码提取到 Hook 中
   - 让组件代码更简洁、更易维护
   - 提高代码的可测试性

3. **闭包概念**
   - 闭包是如何工作的
   - 闭包在 Hooks 中的实际应用
   - 清理函数如何通过闭包访问变量

4. **性能优化**
   - 惰性初始化避免重复计算
   - 防抖减少不必要的操作
   - useMemo 缓存计算结果

### 🚀 进阶练习

1. **创建 useThrottle Hook**（节流）
2. **创建 useSessionStorage Hook**（使用 sessionStorage）
3. **创建 useAsync Hook**（处理异步操作）
4. **创建 useClickOutside Hook**（检测点击外部）

### 📚 推荐阅读

- [React 官方文档 - 自定义 Hook](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [MDN - 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [防抖和节流详解](https://css-tricks.com/debouncing-throttling-explained-examples/)

---

## 📝 代码位置索引

| 文件 | 说明 |
|------|------|
| `src/hooks/useLocalStorage.js` | useLocalStorage Hook 实现 |
| `src/hooks/useDebounce.js` | useDebounce Hook 实现 |
| `src/App.js` (第 54 行) | useLocalStorage 的使用 |
| `src/App.js` (第 154 行) | useDebounce 的使用 |
| `src/App.js` (第 309 行) | 防抖搜索的实现 |
| `src/App.js` (第 442 行) | 防抖提示 UI |

---

## 🎉 完成！

恭喜你完成了自定义 Hooks 的学习和实践！

你现在已经掌握了：
- ✅ 如何设计和实现自定义 Hooks
- ✅ 闭包在实际开发中的应用
- ✅ 性能优化的实用技巧
- ✅ 逻辑复用的最佳实践

继续加油！💪

