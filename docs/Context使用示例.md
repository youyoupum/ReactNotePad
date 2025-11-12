# 在子组件中使用 Reducer - Context API 完整示例

## 📚 什么是 Context API？

Context API 是 React 提供的一种**跨组件传递数据**的方式，可以避免 props 层层传递（props drilling）。

### **问题场景：Props Drilling**

```
App (有 state 和 dispatch)
  └─ Header (不需要，但必须传递)
      └─ SearchBar (需要 state.searchTerm 和 dispatch)
          └─ SearchInput (需要)

❌ 问题：Header 不需要这些数据，但必须接收并传递给子组件
```

### **解决方案：Context API**

```
App (有 state 和 dispatch，存在 Context 中)
  ├─ Header
  │   └─ SearchBar (直接从 Context 获取)
  │       └─ SearchInput (直接从 Context 获取)
  └─ NotesList (直接从 Context 获取)

✅ 解决：任何组件都可以直接从 Context 获取数据
```

---

## 🚀 完整实现步骤

### **第 1 步：已创建的文件**

✅ `src/reducers/notesReducer.js` - Reducer 逻辑（已完成）  
✅ `src/context/NotesContext.js` - Context 配置（已完成）

---

### **第 2 步：修改入口文件**

#### **方案 A：在 index.js 中包裹（推荐）**

```javascript
// ========== src/index.js ==========
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NotesProvider } from './context/NotesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 👇 用 NotesProvider 包裹整个应用 */}
    <NotesProvider>
      <App />
    </NotesProvider>
  </React.StrictMode>
);
```

#### **方案 B：在 App.js 中包裹**

```javascript
// ========== src/App.js ==========
import React from 'react';
import { NotesProvider } from './context/NotesContext';
import MainContent from './MainContent';

function App() {
  return (
    <NotesProvider>
      <MainContent />
    </NotesProvider>
  );
}

export default App;
```

---

### **第 3 步：在子组件中使用**

#### **示例 1：获取状态（只读）**

```javascript
// ========== components/NoteCounter.jsx ==========
import React from 'react';
import { useNotesState } from '../context/NotesContext';

function NoteCounter() {
  // 👇 直接获取状态，不需要 props！
  const state = useNotesState();
  
  return (
    <div>
      <h2>笔记统计</h2>
      <p>总共 {state.notes.length} 条笔记</p>
      <p>已星标 {state.notes.filter(n => n.isStarred).length} 条</p>
      <p>当前搜索词：{state.searchTerm || '无'}</p>
    </div>
  );
}

export default NoteCounter;
```

#### **示例 2：派发 Action（修改状态）**

```javascript
// ========== components/QuickAddButton.jsx ==========
import React from 'react';
import { useNotesDispatch, ACTION_TYPES } from '../context/NotesContext';

function QuickAddButton() {
  // 👇 直接获取 dispatch
  const dispatch = useNotesDispatch();
  
  const handleQuickAdd = () => {
    dispatch({
      type: ACTION_TYPES.ADD_NOTE,
      payload: {
        title: `快速笔记 ${Date.now()}`,
        content: '这是一条快速创建的笔记',
        tags: ['快速']
      }
    });
  };
  
  return (
    <button onClick={handleQuickAdd}>
      ⚡ 快速添加笔记
    </button>
  );
}

export default QuickAddButton;
```

#### **示例 3：同时使用状态和 Dispatch**

```javascript
// ========== components/SearchBar.jsx ==========
import React from 'react';
import { useNotesState, useNotesDispatch, ACTION_TYPES } from '../context/NotesContext';

function SearchBar() {
  // 👇 同时获取状态和 dispatch
  const state = useNotesState();
  const dispatch = useNotesDispatch();
  
  // 或者使用便捷方式：
  // const [state, dispatch] = useNotes();
  
  const handleSearch = (e) => {
    dispatch({
      type: ACTION_TYPES.SET_SEARCH_TERM,
      payload: e.target.value
    });
  };
  
  const handleClear = () => {
    dispatch({
      type: ACTION_TYPES.SET_SEARCH_TERM,
      payload: ''
    });
  };
  
  return (
    <div>
      <input
        type="search"
        value={state.searchTerm}
        onChange={handleSearch}
        placeholder="搜索笔记..."
      />
      {state.searchTerm && (
        <button onClick={handleClear}>清空</button>
      )}
      {state.searchTerm && (
        <p>找到 {state.notes.filter(n => 
          n.title.includes(state.searchTerm) || 
          n.content.includes(state.searchTerm)
        ).length} 条结果</p>
      )}
    </div>
  );
}

export default SearchBar;
```

#### **示例 4：笔记列表组件**

```javascript
// ========== components/NoteListWithContext.jsx ==========
import React from 'react';
import { useNotesState, useNotesDispatch, ACTION_TYPES } from '../context/NotesContext';

function NoteListWithContext() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();
  
  const handleDelete = (id) => {
    if (window.confirm('确定要删除吗？')) {
      dispatch({
        type: ACTION_TYPES.DELETE_NOTE,
        payload: id
      });
    }
  };
  
  const handleToggleStar = (id) => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_STAR,
      payload: id
    });
  };
  
  const handleEdit = (note) => {
    dispatch({
      type: ACTION_TYPES.START_EDIT,
      payload: note
    });
  };
  
  return (
    <div>
      <h2>笔记列表</h2>
      {state.notes.length === 0 ? (
        <p>暂无笔记</p>
      ) : (
        <ul>
          {state.notes.map(note => (
            <li key={note.id}>
              <h3>
                {note.isStarred && '⭐ '}
                {note.title}
              </h3>
              <p>{note.content}</p>
              <div>
                <button onClick={() => handleToggleStar(note.id)}>
                  {note.isStarred ? '取消星标' : '添加星标'}
                </button>
                <button onClick={() => handleEdit(note)}>编辑</button>
                <button onClick={() => handleDelete(note.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NoteListWithContext;
```

---

## 📊 Context API vs Props 对比

### **使用 Props（原来的方式）**

```javascript
// App.js
function App() {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  
  return (
    <div>
      {/* 必须传递 props */}
      <Header notes={state.notes} />
      <SearchBar 
        searchTerm={state.searchTerm} 
        dispatch={dispatch} 
      />
      <NoteList 
        notes={state.notes} 
        onDelete={(id) => dispatch({...})}
        onEdit={(note) => dispatch({...})}
      />
    </div>
  );
}

// 子组件必须接收 props
function SearchBar({ searchTerm, dispatch }) {
  return <input value={searchTerm} onChange={...} />;
}
```

### **使用 Context（新方式）**

```javascript
// App.js
function App() {
  return (
    <div>
      {/* 不需要传递任何 props！ */}
      <Header />
      <SearchBar />
      <NoteList />
    </div>
  );
}

// 子组件直接从 Context 获取
function SearchBar() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();
  
  return <input value={state.searchTerm} onChange={...} />;
}
```

---

## 🎯 你的项目改造方案

### **选项 1：保持当前方式（Props）**
✅ 优点：简单直接，数据流清晰  
❌ 缺点：组件嵌套多时会有 props drilling  
👉 适合：组件层级不深的项目

### **选项 2：迁移到 Context（推荐）**
✅ 优点：任何组件都能访问，避免 props drilling  
✅ 优点：更容易添加新的子组件  
❌ 缺点：稍微复杂一点  
👉 适合：组件层级深的项目，或计划扩展的项目

---

## 🔧 迁移步骤（如果你想改用 Context）

### **1. 已完成的部分**
- ✅ `src/reducers/notesReducer.js` 已创建
- ✅ `src/context/NotesContext.js` 已创建

### **2. 需要修改的部分**

#### **修改 src/index.js：**

```javascript
import { NotesProvider } from './context/NotesContext';

root.render(
  <React.StrictMode>
    <NotesProvider>
      <App />
    </NotesProvider>
  </React.StrictMode>
);
```

#### **修改 src/App.js：**

```javascript
// ❌ 删除这些：
// const [state, dispatch] = useReducer(notesReducer, initialState);
// const { notes, editingNote, ... } = state;

// ✅ 改用 Context：
import { useNotesState, useNotesDispatch, ACTION_TYPES } from './context/NotesContext';

function App() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();
  
  // 其他逻辑保持不变
  // ...
}
```

#### **修改子组件（如 NoteForm.jsx、NoteList.jsx）：**

```javascript
// 不再从 props 接收数据，而是从 Context 获取
import { useNotesState, useNotesDispatch, ACTION_TYPES } from '../context/NotesContext';

function NoteForm() {
  const state = useNotesState();
  const dispatch = useNotesDispatch();
  
  // 使用 state.editingNote 而不是 props.editingNote
  // 使用 dispatch 而不是 props.onSubmit
}
```

---

## ✅ 总结

### **三种方式对比**

| 方式 | 代码示例 | 优点 | 缺点 |
|------|----------|------|------|
| **独立 Reducer** | `const [state, dispatch] = useReducer(...)` | 简单，状态隔离 | 无法共享 |
| **Props 传递** | `<Child state={state} dispatch={dispatch} />` | 数据流清晰 | Props drilling |
| **Context API** | `const state = useNotesState()` | 避免 drilling | 稍复杂 |

### **推荐使用场景**

- 📝 **小项目、简单组件** → Props 传递
- 🏗️ **中大型项目、深层嵌套** → Context API ✅
- 🔧 **单个组件独立状态** → 独立 useReducer

### **记忆口诀**

```
浅层传递用 Props
深层共享用 Context
独立状态用 Reducer
```

希望这个详细的说明能帮助你理解！如果你想迁移到 Context，我可以帮你具体操作。🚀

