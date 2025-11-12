# Zustand 使用指南 - 实战教程 🚀

> 学习如何在项目中使用 Zustand 状态管理

---

## 📋 目录

1. [基础使用](#基础使用)
2. [实战示例](#实战示例)
3. [最佳实践](#最佳实践)
4. [测试验证](#测试验证)
5. [常见问题](#常见问题)

---

## 基础使用

### 1️⃣ 在组件中使用 Store

#### 获取单个状态

```javascript
import { useNotesStore } from '../store';

function MyComponent() {
  // ✅ 推荐：只获取需要的状态
  const notes = useNotesStore(state => state.notes);
  
  return <div>笔记数量: {notes.length}</div>;
}
```

**优势**：
- 只有 `notes` 变化时才重新渲染
- 性能最优

#### 获取多个状态

```javascript
function MyComponent() {
  // 方式1：分别获取（推荐）
  const notes = useNotesStore(state => state.notes);
  const searchTerm = useNotesStore(state => state.searchTerm);
  
  // 方式2：一次性获取
  const { notes, searchTerm } = useNotesStore(state => ({
    notes: state.notes,
    searchTerm: state.searchTerm
  }));
  
  // ❌ 不推荐：获取整个 state
  const state = useNotesStore();  // 会导致不必要的重新渲染
}
```

#### 调用方法

```javascript
function MyComponent() {
  // 获取方法
  const addNote = useNotesStore(state => state.addNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  
  // 使用方法
  const handleAdd = () => {
    addNote({
      title: '新笔记',
      content: '内容',
      tags: ['工作']
    });
  };
  
  const handleDelete = (id) => {
    deleteNote(id);
  };
  
  return (
    <div>
      <button onClick={handleAdd}>添加笔记</button>
      <button onClick={() => handleDelete(123)}>删除</button>
    </div>
  );
}
```

#### 使用 Selectors（计算属性）

```javascript
function MyComponent() {
  // 获取 selector 方法
  const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
  const getAllTags = useNotesStore(state => state.getAllTags);
  
  // 调用获取结果
  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();
  
  return (
    <div>
      <p>筛选后的笔记: {filteredNotes.length} 条</p>
      <p>所有标签: {allTags.join(', ')}</p>
    </div>
  );
}
```

---

### 2️⃣ 认证状态使用

#### 检查登录状态

```javascript
import { useAuthStore } from '../store';

function Header() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const user = useAuthStore(state => state.user);
  
  return (
    <header>
      {isLoggedIn ? (
        <span>欢迎, {user.username}</span>
      ) : (
        <Link to="/login">登录</Link>
      )}
    </header>
  );
}
```

#### 登录操作

```javascript
function LoginPage() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    const success = login(username, password);
    
    if (success) {
      navigate('/');  // 登录成功，跳转首页
    } else {
      alert('登录失败');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="用户名" />
      <input name="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  );
}
```

#### 退出登录

```javascript
function Header() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <button onClick={handleLogout}>退出登录</button>
  );
}
```

---

## 实战示例

### 示例 1: 搜索功能

```javascript
import { useNotesStore } from '../store';

function SearchBar() {
  const searchTerm = useNotesStore(state => state.searchTerm);
  const setSearchTerm = useNotesStore(state => state.setSearchTerm);
  const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
  
  const filteredNotes = getFilteredNotes();
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索笔记..."
      />
      <p>找到 {filteredNotes.length} 条笔记</p>
    </div>
  );
}
```

### 示例 2: 标签筛选

```javascript
function TagFilter() {
  const selectedTag = useNotesStore(state => state.selectedTag);
  const setSelectedTag = useNotesStore(state => state.setSelectedTag);
  const getAllTags = useNotesStore(state => state.getAllTags);
  
  const tags = getAllTags();
  
  return (
    <div>
      <button 
        onClick={() => setSelectedTag('all')}
        style={{ 
          fontWeight: selectedTag === 'all' ? 'bold' : 'normal' 
        }}
      >
        全部
      </button>
      
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          style={{ 
            fontWeight: selectedTag === tag ? 'bold' : 'normal' 
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

### 示例 3: 笔记列表

```javascript
function NoteListPage() {
  const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const toggleStar = useNotesStore(state => state.toggleStar);
  const navigate = useNavigate();
  
  const notes = getFilteredNotes();
  
  return (
    <div>
      {notes.map(note => (
        <div key={note.id}>
          <h3 onClick={() => navigate(`/notes/${note.id}`)}>
            {note.title}
          </h3>
          
          <button onClick={() => toggleStar(note.id)}>
            {note.starred ? '⭐' : '☆'}
          </button>
          
          <button onClick={() => deleteNote(note.id)}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 示例 4: 编辑笔记

```javascript
function EditPage() {
  const { id } = useParams();
  const getNoteById = useNotesStore(state => state.getNoteById);
  const updateNote = useNotesStore(state => state.updateNote);
  const navigate = useNavigate();
  
  const note = getNoteById(id);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  
  const handleSave = () => {
    updateNote(parseInt(id), { title, content });
    navigate('/');
  };
  
  if (!note) {
    return <div>笔记不存在</div>;
  }
  
  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
      />
      
      <button onClick={handleSave}>保存</button>
    </div>
  );
}
```

---

## 最佳实践

### 1️⃣ 精确订阅

```javascript
// ✅ 好：只订阅需要的数据
const notes = useNotesStore(state => state.notes);

// ❌ 不好：订阅整个 state
const state = useNotesStore();
```

**原因**：精确订阅可以减少不必要的重新渲染，提升性能。

### 2️⃣ 使用 Selectors

```javascript
// ✅ 好：使用 Selector
const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
const filteredNotes = getFilteredNotes();

// ❌ 不好：在组件中过滤
const notes = useNotesStore(state => state.notes);
const searchTerm = useNotesStore(state => state.searchTerm);
const filteredNotes = notes.filter(n => n.title.includes(searchTerm));
```

**原因**：
- Selector 可以复用
- 逻辑集中在 store
- 代码更清晰

### 3️⃣ 避免在 render 中创建新对象

```javascript
// ❌ 不好：每次渲染都创建新对象
const { notes, searchTerm } = useNotesStore(state => ({
  notes: state.notes,
  searchTerm: state.searchTerm
}));

// ✅ 好：分别获取
const notes = useNotesStore(state => state.notes);
const searchTerm = useNotesStore(state => state.searchTerm);
```

### 4️⃣ 在组件外使用 Store

```javascript
// utils/noteUtils.js
import useNotesStore from '../store/useNotesStore';

export function exportNotes() {
  // 获取当前状态
  const notes = useNotesStore.getState().notes;
  
  // 导出为 JSON
  const json = JSON.stringify(notes, null, 2);
  return json;
}

export function importNotes(jsonString) {
  const notes = JSON.parse(jsonString);
  
  // 调用方法
  notes.forEach(note => {
    useNotesStore.getState().addNote(note);
  });
}
```

---

## 测试验证

### 功能测试清单

#### ✅ 笔记功能

**测试步骤**：

1. **创建笔记**
   ```
   - 打开首页
   - 填写标题："测试笔记"
   - 填写内容："这是测试内容"
   - 添加标签：工作、学习
   - 点击提交
   - 确认笔记出现在列表中 ✅
   ```

2. **搜索笔记**
   ```
   - 在搜索框输入："测试"
   - 确认只显示包含"测试"的笔记 ✅
   - 清空搜索框
   - 确认显示所有笔记 ✅
   ```

3. **标签筛选**
   ```
   - 点击"工作"标签
   - 确认只显示带"工作"标签的笔记 ✅
   - 点击"全部"
   - 确认显示所有笔记 ✅
   ```

4. **星标功能**
   ```
   - 点击笔记的星标按钮
   - 确认星标状态改变（空心↔实心）✅
   - 刷新页面
   - 确认星标状态保持 ✅
   ```

5. **编辑笔记**
   ```
   - 点击笔记的编辑按钮
   - 修改标题和内容
   - 点击保存
   - 确认修改生效 ✅
   ```

6. **删除笔记**
   ```
   - 点击删除按钮
   - 确认弹出确认对话框
   - 点击确定
   - 确认笔记被删除 ✅
   ```

#### ✅ 认证功能

**测试步骤**：

1. **登录**
   ```
   - 访问登录页 /login
   - 输入用户名：admin
   - 输入密码：123456
   - 点击登录
   - 确认跳转到首页 ✅
   - 确认导航栏显示用户名 ✅
   ```

2. **刷新保持登录**
   ```
   - 登录后刷新页面
   - 确认仍然保持登录状态 ✅
   - 确认用户信息仍然显示 ✅
   ```

3. **访问受保护页面**
   ```
   - 登录状态下访问 /profile
   - 确认可以正常访问 ✅
   - 退出登录后访问 /profile
   - 确认被重定向到登录页 ✅
   ```

4. **退出登录**
   ```
   - 点击退出按钮
   - 确认跳转到登录页 ✅
   - 确认导航栏不再显示用户名 ✅
   - 刷新页面
   - 确认仍然是未登录状态 ✅
   ```

#### ✅ 数据持久化

**测试步骤**：

```
1. 创建几条笔记
2. 关闭浏览器
3. 重新打开浏览器，访问应用
4. 确认笔记仍然存在 ✅
5. 确认所有笔记的属性都保存完整 ✅
```

### 控制台检查

打开浏览器控制台（F12），查看日志：

```
✅ 笔记数据加载成功，共 X 条笔记
✅ 认证状态恢复成功: admin
✅ 应用初始化完成！
📦 Zustand 状态管理已集成
🎯 所有组件可直接访问 store，无需 props 传递
```

---

## 常见问题

### Q1: 为什么有些状态变化了，组件没有重新渲染？

**A**: 检查是否使用了精确订阅

```javascript
// ❌ 问题代码
const notes = useNotesStore(state => state.notes);
const searchTerm = 'test';  // 这不是从 store 获取的
// 当 searchTerm 变化时，组件不会重新渲染

// ✅ 正确代码
const notes = useNotesStore(state => state.notes);
const searchTerm = useNotesStore(state => state.searchTerm);
// 现在 searchTerm 变化时，组件会重新渲染
```

### Q2: 如何在开发者工具中查看 store 状态？

**A**: 在控制台输入：

```javascript
// 查看笔记 store
useNotesStore.getState()

// 查看认证 store
useAuthStore.getState()

// 查看特定状态
useNotesStore.getState().notes
```

### Q3: 如何重置所有状态？

**A**: 调用 reset 方法

```javascript
// 重置笔记 store
useNotesStore.getState().reset();

// 重置认证 store
useAuthStore.getState().reset();
```

### Q4: 刷新页面后数据丢失了怎么办？

**A**: 检查以下几点：

1. 确认 `initialize` 方法被调用
   ```javascript
   // App.js
   useEffect(() => {
     initializeNotes();  // 必须调用
     initializeAuth();
   }, []);
   ```

2. 确认 localStorage 有数据
   ```javascript
   // 控制台
   localStorage.getItem('notes')
   localStorage.getItem('user')
   ```

3. 确认方法中有保存逻辑
   ```javascript
   addNote: (noteData) => set((state) => {
     const newNotes = [...state.notes, newNote];
     
     // 必须保存！
     localStorage.setItem('notes', JSON.stringify(newNotes));
     
     return { notes: newNotes };
   })
   ```

### Q5: 如何添加新功能？

**A**: 三步走

**Step 1**: 在 store 中添加状态和方法

```javascript
// src/store/useNotesStore.js
const useNotesStore = create((set) => ({
  // 现有状态...
  
  // ✨ 新增：收藏夹
  favorites: [],
  
  // ✨ 新增：添加到收藏夹
  addToFavorites: (noteId) => set((state) => {
    if (!state.favorites.includes(noteId)) {
      const newFavorites = [...state.favorites, noteId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }
    return state;
  }),
  
  // ✨ 新增：从收藏夹移除
  removeFromFavorites: (noteId) => set((state) => {
    const newFavorites = state.favorites.filter(id => id !== noteId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  })
}));
```

**Step 2**: 在组件中使用

```javascript
function NoteCard({ note }) {
  const favorites = useNotesStore(state => state.favorites);
  const addToFavorites = useNotesStore(state => state.addToFavorites);
  const removeFromFavorites = useNotesStore(state => state.removeFromFavorites);
  
  const isFavorite = favorites.includes(note.id);
  
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(note.id);
    } else {
      addToFavorites(note.id);
    }
  };
  
  return (
    <div>
      <h3>{note.title}</h3>
      <button onClick={handleToggleFavorite}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

**Step 3**: 测试功能

```
1. 点击收藏按钮
2. 确认状态变化
3. 刷新页面
4. 确认状态保持
```

---

## 🎉 总结

### 核心要点

1. **精确订阅**：只获取需要的状态
2. **使用 Selectors**：复用计算逻辑
3. **避免在组件中创建新对象**：性能优化
4. **善用 getState()**：组件外访问状态

### 学习路径

1. ✅ 理解基础用法（本文档）
2. 📖 查看实战示例（`Zustand集成实战记录.md`）
3. 🎯 阅读最佳实践（`04-Zustand最佳实践.md`）
4. 💻 开始编码实践

### 需要帮助？

- 遇到问题查看"常见问题"部分
- 参考实战示例代码
- 在控制台使用 `getState()` 调试

**祝你使用愉快！** 🚀
