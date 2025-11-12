# Zustand 快速入门 - 15分钟上手 🚀

> 最简单的 React 状态管理库，15分钟就能学会！

---

## 目录

1. [什么是 Zustand](#什么是-zustand)
2. [基础用法](#基础用法)
3. [常用模式](#常用模式)
4. [实战示例](#实战示例)

---

## 什么是 Zustand？

### 一句话介绍

**Zustand** = 德语"状态"的意思，一个超级简单的 React 状态管理库

### 特点

- 🚀 **简单**：15分钟就能学会
- 📦 **轻量**：只有 1KB（压缩后）
- ⚡ **快速**：性能优秀
- 🎯 **直观**：API 简洁明了
- 🔧 **灵活**：不需要 Provider
- ✨ **功能全**：支持中间件、持久化、DevTools

---

## 基础用法

### 1️⃣ 安装

```bash
npm install zustand
# 或
yarn add zustand
```

### 2️⃣ 创建 Store（仓库）

```jsx
// src/store/useStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
  // 👇 定义状态
  count: 0,
  
  // 👇 定义方法
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

export default useStore;
```

**理解**：
- `create` 函数创建一个 store
- `set` 函数用于更新状态
- 返回的 `useStore` 是一个 React Hook

### 3️⃣ 使用 Store

```jsx
// 任何组件中
import useStore from './store/useStore';

function Counter() {
  // 👇 获取状态和方法
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  
  return (
    <div>
      <h1>计数: {count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}
```

**就这么简单**！✨

---

## 常用模式

### 模式1️⃣: 获取单个值

```jsx
// 只获取 count
const count = useStore((state) => state.count);

// 组件只在 count 变化时重新渲染
```

### 模式2️⃣: 获取多个值

```jsx
// 方法1：分别获取
const count = useStore((state) => state.count);
const user = useStore((state) => state.user);

// 方法2：一次性获取
const { count, user } = useStore((state) => ({
  count: state.count,
  user: state.user
}));

// 方法3：获取整个 state（不推荐，会导致不必要的重新渲染）
const state = useStore();
```

### 模式3️⃣: 更新状态

```jsx
const useStore = create((set) => ({
  count: 0,
  
  // 方法1：基于当前状态更新
  increment: () => set((state) => ({ count: state.count + 1 })),
  
  // 方法2：直接设置新值
  setCount: (newCount) => set({ count: newCount }),
  
  // 方法3：更新多个值
  updateMultiple: () => set({
    count: 10,
    name: '张三'
  })
}));
```

### 模式4️⃣: 异步操作

```jsx
const useStore = create((set) => ({
  notes: [],
  isLoading: false,
  
  // 异步获取笔记
  fetchNotes: async () => {
    set({ isLoading: true });
    
    try {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  }
}));
```

### 模式5️⃣: 嵌套状态更新

```jsx
const useStore = create((set) => ({
  user: {
    name: '张三',
    age: 25,
    settings: {
      theme: 'light'
    }
  },
  
  // 更新嵌套对象
  updateTheme: (theme) => set((state) => ({
    user: {
      ...state.user,
      settings: {
        ...state.user.settings,
        theme
      }
    }
  }))
}));
```

---

## 实战示例

### 示例1️⃣: 简单计数器

```jsx
// store/counterStore.js
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

export default useCounterStore;

// Counter.jsx
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

---

### 示例2️⃣: 待办事项

```jsx
// store/todoStore.js
import { create } from 'zustand';

const useTodoStore = create((set) => ({
  todos: [],
  
  // 添加待办
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      completed: false
    }]
  })),
  
  // 切换完成状态
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  // 删除待办
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  }))
}));

export default useTodoStore;

// TodoList.jsx
function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const [input, setInput] = useState('');
  
  const handleAdd = () => {
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };
  
  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="添加待办事项"
      />
      <button onClick={handleAdd}>添加</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 示例3️⃣: 用户认证

```jsx
// store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  
  // 登录
  login: (username, password) => {
    // 模拟登录
    const user = { id: 1, username };
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },
  
  // 退出
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isLoggedIn: false });
  },
  
  // 初始化（从 localStorage 恢复）
  initialize: () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      set({ user: JSON.parse(savedUser), isLoggedIn: true });
    }
  }
}));

export default useAuthStore;

// Header.jsx
function Header() {
  const { user, isLoggedIn, logout } = useAuthStore();
  
  return (
    <header>
      {isLoggedIn ? (
        <>
          <span>欢迎, {user.username}</span>
          <button onClick={logout}>退出</button>
        </>
      ) : (
        <Link to="/login">登录</Link>
      )}
    </header>
  );
}
```

---

### 示例4️⃣: 笔记应用（完整）

```jsx
// store/notesStore.js
import { create } from 'zustand';

const useNotesStore = create((set, get) => ({
  // ===== 状态 =====
  notes: [],
  searchTerm: '',
  selectedTag: 'all',
  editingNote: null,
  
  // ===== 笔记操作 =====
  
  // 添加笔记
  addNote: (note) => set((state) => {
    const newNote = {
      id: Date.now(),
      ...note,
      createdAt: new Date().toLocaleString(),
      starred: false
    };
    
    const newNotes = [...state.notes, newNote];
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
    return { notes: newNotes };
  }),
  
  // 删除笔记
  deleteNote: (id) => set((state) => {
    const newNotes = state.notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    return { notes: newNotes };
  }),
  
  // 更新笔记
  updateNote: (id, updates) => set((state) => {
    const newNotes = state.notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    );
    localStorage.setItem('notes', JSON.stringify(newNotes));
    return { notes: newNotes };
  }),
  
  // 切换星标
  toggleStar: (id) => set((state) => {
    const newNotes = state.notes.map(note =>
      note.id === id ? { ...note, starred: !note.starred } : note
    );
    localStorage.setItem('notes', JSON.stringify(newNotes));
    return { notes: newNotes };
  }),
  
  // ===== 搜索和筛选 =====
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  
  // ===== 编辑相关 =====
  
  startEdit: (note) => set({ editingNote: note }),
  cancelEdit: () => set({ editingNote: null }),
  
  // ===== Selectors（计算属性）=====
  
  // 获取筛选后的笔记
  getFilteredNotes: () => {
    const state = get();
    return state.notes.filter(note => {
      // 搜索过滤
      const matchSearch = note.title.toLowerCase().includes(
        state.searchTerm.toLowerCase()
      ) || note.content.toLowerCase().includes(
        state.searchTerm.toLowerCase()
      );
      
      // 标签过滤
      const matchTag = state.selectedTag === 'all' || 
        note.tags?.includes(state.selectedTag);
      
      return matchSearch && matchTag;
    });
  },
  
  // 获取所有标签
  getAllTags: () => {
    const state = get();
    const tags = new Set();
    state.notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  },
  
  // ===== 初始化 =====
  
  initialize: () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      set({ notes: JSON.parse(savedNotes) });
    }
  }
}));

export default useNotesStore;
```

**使用**：

```jsx
// HomePage.jsx
function HomePage() {
  const notes = useNotesStore(state => state.notes);
  const addNote = useNotesStore(state => state.addNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
  
  const filteredNotes = getFilteredNotes();
  
  return (
    <div>
      <NoteForm onSubmit={addNote} />
      <NoteList 
        notes={filteredNotes}
        onDelete={deleteNote}
      />
    </div>
  );
}
```

---

## 🎯 核心 API 总结

### `create()`

创建 store：

```jsx
const useStore = create((set, get) => ({
  // 状态
  value: 0,
  
  // 方法
  setValue: (v) => set({ value: v })
}));
```

### `set()`

更新状态：

```jsx
// 方式1：传对象
set({ count: 10 })

// 方式2：传函数（可以访问当前状态）
set((state) => ({ count: state.count + 1 }))

// 方式3：替换整个状态（不推荐）
set({ count: 10 }, true)  // 第二个参数为 true
```

### `get()`

获取当前状态：

```jsx
const useStore = create((set, get) => ({
  count: 0,
  
  doubleCount: () => {
    const currentCount = get().count;  // 获取当前 count
    return currentCount * 2;
  }
}));
```

---

## 📝 最佳实践

### 1. 按功能拆分 Store

```jsx
// ✅ 好：按功能拆分
stores/
├── useAuthStore.js      // 认证相关
├── useNotesStore.js     // 笔记相关
├── useUIStore.js        // UI 状态
└── useSettingsStore.js  // 设置相关

// ❌ 不好：所有状态放一个 store
stores/
└── useStore.js  // 几千行代码 😱
```

### 2. 使用 Selectors

```jsx
// ✅ 好：只获取需要的数据
const count = useStore(state => state.count);

// ❌ 不好：获取整个 state
const state = useStore();
const count = state.count;
```

### 3. 避免在 render 中创建新对象

```jsx
// ❌ 不好：每次都创建新对象
const { count, user } = useStore(state => ({
  count: state.count,
  user: state.user
}));

// ✅ 好：使用 shallow 比较
import shallow from 'zustand/shallow';

const { count, user } = useStore(
  state => ({ count: state.count, user: state.user }),
  shallow
);
```

---

## 🎓 学习检查

理解以下内容后，就可以在项目中使用了：

- [ ] 如何创建 store
- [ ] 如何在组件中使用 store
- [ ] 如何更新状态
- [ ] set() 和 get() 的用法
- [ ] 如何处理异步操作
- [ ] Selectors 的作用

**全部理解**？🎉 继续阅读下一个文档！

---

**下一步**：阅读 `03-在项目中集成Zustand.md`，学习如何在你的笔记应用中使用 Zustand
