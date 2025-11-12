# Zustand 最佳实践与高级技巧 🎯

> 让你的代码更优雅、更高效

---

## 目录

1. [性能优化](#性能优化)
2. [代码组织](#代码组织)
3. [中间件使用](#中间件使用)
4. [调试技巧](#调试技巧)
5. [常见问题](#常见问题)

---

## 性能优化

### 1️⃣ 精确订阅

**❌ 不好：订阅整个 state**

```jsx
function Component() {
  // 订阅了整个 state，任何状态变化都会重新渲染
  const state = useNotesStore();
  
  return <div>{state.notes.length}</div>;
}
```

**✅ 好：只订阅需要的数据**

```jsx
function Component() {
  // 只订阅 notes，其他状态变化不会触发重新渲染
  const notes = useNotesStore(state => state.notes);
  
  return <div>{notes.length}</div>;
}
```

### 2️⃣ 使用 Shallow 比较

当需要多个值时：

```jsx
import shallow from 'zustand/shallow';

function Component() {
  // 使用 shallow 比较，避免不必要的重新渲染
  const { notes, searchTerm, selectedTag } = useNotesStore(
    state => ({
      notes: state.notes,
      searchTerm: state.searchTerm,
      selectedTag: state.selectedTag
    }),
    shallow  // 👈 使用浅比较
  );
  
  return <div>...</div>;
}
```

### 3️⃣ 使用 Selectors

**创建 Selectors**：

```jsx
// src/store/selectors.js
export const selectFilteredNotes = (state) => {
  const { notes, searchTerm, selectedTag } = state;
  
  return notes.filter(note => {
    const matchSearch = note.title.includes(searchTerm);
    const matchTag = selectedTag === 'all' || note.tags?.includes(selectedTag);
    return matchSearch && matchTag;
  });
};

export const selectStarredCount = (state) => {
  return state.notes.filter(n => n.starred).length;
};
```

**使用 Selectors**：

```jsx
import { selectFilteredNotes, selectStarredCount } from './store/selectors';

function Component() {
  const filteredNotes = useNotesStore(selectFilteredNotes);
  const starredCount = useNotesStore(selectStarredCount);
  
  return <div>...</div>;
}
```

### 4️⃣ 避免在 Selector 中创建新对象

**❌ 不好：每次都创建新数组**

```jsx
// 每次都返回新数组，导致组件总是重新渲染
const notes = useNotesStore(state => 
  state.notes.filter(n => n.starred)  // 新数组！
);
```

**✅ 好：使用 Memoization**

```jsx
import { useMemo } from 'react';

function Component() {
  const notes = useNotesStore(state => state.notes);
  
  // 使用 useMemo 缓存计算结果
  const starredNotes = useMemo(
    () => notes.filter(n => n.starred),
    [notes]
  );
  
  return <div>...</div>;
}
```

**✅ 更好：在 Store 中提供方法**

```jsx
// Store
const useNotesStore = create((set, get) => ({
  notes: [],
  
  // 提供获取方法
  getStarredNotes: () => {
    return get().notes.filter(n => n.starred);
  }
}));

// 使用
function Component() {
  const getStarredNotes = useNotesStore(state => state.getStarredNotes);
  const starredNotes = getStarredNotes();
}
```

---

## 代码组织

### 1️⃣ 按功能拆分 Store

**目录结构**：

```
src/store/
├── useNotesStore.js       # 笔记相关
├── useAuthStore.js        # 认证相关
├── useUIStore.js          # UI 状态
├── useSettingsStore.js    # 设置相关
└── index.js               # 统一导出
```

**统一导出**：

```jsx
// src/store/index.js
export { default as useNotesStore } from './useNotesStore';
export { default as useAuthStore } from './useAuthStore';
export { default as useUIStore } from './useUIStore';
export { default as useSettingsStore } from './useSettingsStore';
```

**使用**：

```jsx
import { useNotesStore, useAuthStore } from '../store';
```

### 2️⃣ 使用 Slices 模式

将大的 Store 拆分成小的 Slices：

```jsx
// src/store/slices/notesSlice.js
export const createNotesSlice = (set, get) => ({
  notes: [],
  
  addNote: (note) => set((state) => ({
    notes: [...state.notes, note]
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id)
  }))
});

// src/store/slices/searchSlice.js
export const createSearchSlice = (set, get) => ({
  searchTerm: '',
  selectedTag: 'all',
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedTag: (tag) => set({ selectedTag: tag })
});

// src/store/useNotesStore.js
import { create } from 'zustand';
import { createNotesSlice } from './slices/notesSlice';
import { createSearchSlice } from './slices/searchSlice';

const useNotesStore = create((set, get) => ({
  ...createNotesSlice(set, get),
  ...createSearchSlice(set, get)
}));

export default useNotesStore;
```

### 3️⃣ TypeScript 支持（可选）

```typescript
// src/store/useNotesStore.ts
import { create } from 'zustand';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  starred: boolean;
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  deleteNote: (id: number) => void;
}

const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  
  addNote: (note) => set((state) => ({
    notes: [...state.notes, { ...note, id: Date.now() }]
  })),
  
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id)
  }))
}));

export default useNotesStore;
```

---

## 中间件使用

### 1️⃣ Persist 中间件（持久化）

自动保存到 localStorage：

```jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: (note) => set((state) => ({
        notes: [...state.notes, note]
      }))
    }),
    {
      name: 'notes-storage',  // localStorage 的 key
      
      // 可选：只持久化部分状态
      partialize: (state) => ({
        notes: state.notes
        // 不保存 editingNote 等临时状态
      })
    }
  )
);
```

**使用后**：
- ✅ 自动保存到 localStorage
- ✅ 刷新页面后自动恢复
- ✅ 不需要手动调用 `localStorage.setItem`

### 2️⃣ Immer 中间件（简化嵌套更新）

```jsx
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    user: {
      name: '张三',
      settings: {
        theme: 'light',
        notifications: {
          email: true,
          sms: false
        }
      }
    },
    
    // 使用 Immer，可以直接"修改"嵌套对象
    updateEmailNotification: (enabled) => set((state) => {
      state.user.settings.notifications.email = enabled;
      // 不需要手动展开所有层级！
    })
  }))
);
```

### 3️⃣ DevTools 中间件（调试）

```jsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useNotesStore = create(
  devtools(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [...state.notes, note]
      }), undefined, 'addNote')  // 👈 action 名称
    }),
    { name: 'NotesStore' }  // 👈 store 名称
  )
);
```

**使用 Redux DevTools**：
1. 安装 Redux DevTools 浏览器插件
2. 打开开发者工具
3. 切换到 Redux 标签
4. 查看状态变化和时间旅行

### 4️⃣ 组合多个中间件

```jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useNotesStore = create(
  devtools(
    persist(
      immer((set) => ({
        notes: [],
        
        addNote: (note) => set((state) => {
          state.notes.push(note);
        })
      })),
      { name: 'notes-storage' }
    ),
    { name: 'NotesStore' }
  )
);
```

---

## 调试技巧

### 1️⃣ 添加日志

```jsx
const useNotesStore = create((set) => ({
  notes: [],
  
  addNote: (note) => {
    console.log('Before:', useNotesStore.getState().notes);
    
    set((state) => {
      const newState = { notes: [...state.notes, note] };
      console.log('After:', newState.notes);
      return newState;
    });
  }
}));
```

### 2️⃣ 使用 subscribe 监听变化

```jsx
// 监听所有变化
useNotesStore.subscribe((state) => {
  console.log('State changed:', state);
});

// 监听特定字段
useNotesStore.subscribe(
  (state) => state.notes,
  (notes) => console.log('Notes changed:', notes)
);
```

### 3️⃣ 获取当前状态

```jsx
// 在组件外获取状态
const currentNotes = useNotesStore.getState().notes;

// 在组件外调用方法
useNotesStore.getState().addNote({ title: '新笔记' });
```

---

## 常见问题

### Q1: 如何在组件外使用 Store？

**A: 使用 `getState()` 和直接调用方法**

```jsx
// utils/someUtil.js
import useNotesStore from '../store/useNotesStore';

export function addNoteFromOutside() {
  // 获取状态
  const notes = useNotesStore.getState().notes;
  
  // 调用方法
  useNotesStore.getState().addNote({
    title: '外部添加的笔记',
    content: '内容'
  });
}
```

### Q2: 如何在异步函数中使用最新状态？

**A: 在 set 函数内使用 get()**

```jsx
const useStore = create((set, get) => ({
  count: 0,
  
  incrementAsync: async () => {
    await delay(1000);
    
    // ✅ 获取最新的 count
    const currentCount = get().count;
    set({ count: currentCount + 1 });
  }
}));
```

### Q3: 如何重置 Store？

**A: 提供 reset 方法**

```jsx
const initialState = {
  notes: [],
  searchTerm: '',
  selectedTag: 'all'
};

const useNotesStore = create((set) => ({
  ...initialState,
  
  // 其他方法...
  
  reset: () => set(initialState)
}));

// 使用
useNotesStore.getState().reset();
```

### Q4: 如何在多个 Store 之间通信？

**A: 直接调用其他 Store 的方法**

```jsx
// useNotesStore.js
import useAuthStore from './useAuthStore';

const useNotesStore = create((set, get) => ({
  notes: [],
  
  addNote: (note) => {
    // 检查是否登录
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    
    set((state) => ({
      notes: [...state.notes, note]
    }));
  }
}));
```

### Q5: 如何测试 Zustand Store？

**A: 直接测试 Store 对象**

```jsx
// useNotesStore.test.js
import useNotesStore from './useNotesStore';

describe('NotesStore', () => {
  beforeEach(() => {
    // 重置 store
    useNotesStore.getState().reset();
  });
  
  it('should add note', () => {
    const note = { title: 'Test', content: 'Content' };
    
    useNotesStore.getState().addNote(note);
    
    const notes = useNotesStore.getState().notes;
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Test');
  });
});
```

---

## 最佳实践总结

### ✅ DO（推荐）

1. **精确订阅**
   ```jsx
   const notes = useStore(state => state.notes);
   ```

2. **拆分 Store**
   ```
   useNotesStore, useAuthStore, useUIStore
   ```

3. **使用 Selectors**
   ```jsx
   const filteredNotes = useStore(selectFilteredNotes);
   ```

4. **使用中间件**
   ```jsx
   persist(), devtools(), immer()
   ```

5. **提供初始化方法**
   ```jsx
   initialize: () => { ... }
   ```

### ❌ DON'T（避免）

1. **订阅整个 state**
   ```jsx
   const state = useStore();  // ❌
   ```

2. **在 Selector 中创建新对象**
   ```jsx
   const data = useStore(s => ({ ...s }));  // ❌
   ```

3. **在 render 中调用 set**
   ```jsx
   function Component() {
     useStore.setState({ ... });  // ❌
     return <div>...</div>;
   }
   ```

4. **过度拆分 Store**
   ```jsx
   useCountStore, useCountPlusOneStore, ...  // ❌
   ```

---

## 完整示例

### 优化后的 NotesStore

```jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useNotesStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // ===== 状态 =====
        notes: [],
        searchTerm: '',
        selectedTag: 'all',
        editingNote: null,
        
        // ===== 笔记操作 =====
        addNote: (noteData) => set((state) => {
          state.notes.push({
            id: Date.now(),
            ...noteData,
            starred: false,
            createdAt: new Date().toLocaleString()
          });
          state.editingNote = null;
        }),
        
        deleteNote: (id) => set((state) => {
          state.notes = state.notes.filter(n => n.id !== id);
        }),
        
        updateNote: (id, updates) => set((state) => {
          const note = state.notes.find(n => n.id === id);
          if (note) {
            Object.assign(note, updates);
            note.updatedAt = new Date().toLocaleString();
          }
          state.editingNote = null;
        }),
        
        toggleStar: (id) => set((state) => {
          const note = state.notes.find(n => n.id === id);
          if (note) note.starred = !note.starred;
        }),
        
        // ===== Selectors =====
        getFilteredNotes: () => {
          const { notes, searchTerm, selectedTag } = get();
          return notes.filter(note => {
            const matchSearch = 
              note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              note.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchTag = 
              selectedTag === 'all' || note.tags?.includes(selectedTag);
            return matchSearch && matchTag;
          });
        },
        
        // ===== 工具方法 =====
        reset: () => set({
          notes: [],
          searchTerm: '',
          selectedTag: 'all',
          editingNote: null
        })
      })),
      {
        name: 'notes-storage',
        partialize: (state) => ({ notes: state.notes })
      }
    ),
    { name: 'NotesStore' }
  )
);

export default useNotesStore;
```

---

## 🎓 总结

掌握这些最佳实践后，你的代码将：

- ✅ 性能更好（精确订阅）
- ✅ 更易维护（代码组织）
- ✅ 更易调试（DevTools）
- ✅ 更可靠（持久化）
- ✅ 更清晰（Selectors）

**继续学习**：实际在项目中应用这些技巧！
