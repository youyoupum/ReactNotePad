# React Router 和多页面导航详解 🚀

## 📚 目录
1. [什么是路由](#什么是路由)
2. [安装和配置](#安装和配置)
3. [路由配置](#路由配置)
4. [动态路由参数](#动态路由参数)
5. [编程式导航](#编程式导航)
6. [路由守卫](#路由守卫)
7. [常用 Hooks](#常用-hooks)
8. [完整实战示例](#完整实战示例)
9. [最佳实践](#最佳实践)

---

## 什么是路由

### 🎯 路由的概念

**路由**（Routing）是指根据不同的 URL 地址，展示不同的页面内容。

### 传统多页面 vs 单页面应用（SPA）

| 特性 | 传统多页面应用 | React 单页面应用 |
|------|--------------|-----------------|
| **页面加载** | 每次切换都重新加载整个页面 | 只加载一次，切换时更新组件 |
| **用户体验** | 页面闪烁，加载慢 | 流畅，无刷新 |
| **服务器压力** | 每次都请求 HTML | 只请求数据（API） |
| **SEO** | 友好 | 需要额外配置（SSR） |

### React Router 的优势

- ⚡ **性能优异**：无需重新加载整个页面
- 🎯 **用户体验好**：页面切换流畅
- 📱 **支持浏览器历史**：前进/后退按钮正常工作
- 🔗 **可分享链接**：每个"页面"都有独立的 URL
- 🎨 **灵活的布局**：可以实现嵌套路由

---

## 安装和配置

### 📦 安装 React Router

```bash
npm install react-router-dom
```

### 📌 版本说明

- **React Router v6**（推荐）：API 更简洁，性能更好
- **React Router v5**（旧版）：部分 API 不同

**本教程使用 React Router v6**

---

## 路由配置

### 1️⃣ 基础路由配置

#### 文件结构

```
src/
  ├── App.js                  # 主应用
  ├── routes/
  │   └── AppRouter.jsx       # 路由配置
  ├── pages/                  # 页面组件
  │   ├── HomePage.jsx
  │   ├── AboutPage.jsx
  │   └── NotFoundPage.jsx
  └── components/             # 共享组件
      └── Layout.jsx
```

#### 基础示例

```jsx
// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<HomePage />} />
        
        {/* 关于页面 */}
        <Route path="/about" element={<AboutPage />} />
        
        {/* 404 页面 - 必须放在最后 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

### 2️⃣ 嵌套路由和布局

使用 `<Outlet>` 组件实现共享布局：

```jsx
// src/components/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* 导航栏 - 所有页面共享 */}
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      
      {/* 子路由的内容会在这里渲染 */}
      <main>
        <Outlet />
      </main>
      
      {/* 页脚 - 所有页面共享 */}
      <footer>
        <p>© 2025 我的应用</p>
      </footer>
    </div>
  );
}

export default Layout;
```

**在路由中使用布局：**

```jsx
<Routes>
  {/* 布局路由 */}
  <Route path="/" element={<Layout />}>
    {/* index 路由 - 相当于父路由的默认子路由 */}
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
  </Route>
  
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 3️⃣ 导航链接

#### `<Link>` 组件 - 声明式导航

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* 基础用法 */}
      <Link to="/">首页</Link>
      
      {/* 带查询参数 */}
      <Link to="/search?q=react">搜索</Link>
      
      {/* 带状态传递 */}
      <Link to="/profile" state={{ from: 'home' }}>
        个人资料
      </Link>
    </nav>
  );
}
```

#### `<NavLink>` 组件 - 自动高亮当前路由

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/"
        // 当路由激活时，会自动应用这个样式
        style={({ isActive }) => ({
          color: isActive ? 'blue' : 'black',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        首页
      </NavLink>
      
      {/* 使用 className */}
      <NavLink 
        to="/about"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        关于
      </NavLink>
    </nav>
  );
}
```

---

## 动态路由参数

### 🎯 什么是动态路由？

动态路由允许在 URL 中使用变量，例如：
- `/notes/1` - 查看 ID 为 1 的笔记
- `/notes/2` - 查看 ID 为 2 的笔记
- `/users/john` - 查看用户名为 john 的用户

### 1️⃣ 定义动态路由

```jsx
<Routes>
  {/* :id 是动态参数，可以匹配任何值 */}
  <Route path="/notes/:id" element={<NoteDetailPage />} />
  
  {/* 多个动态参数 */}
  <Route path="/users/:userId/posts/:postId" element={<PostDetail />} />
  
  {/* 可选参数（使用 ? 标记） */}
  <Route path="/products/:id/:variant?" element={<ProductPage />} />
</Routes>
```

### 2️⃣ 获取动态参数 - `useParams()`

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function NoteDetailPage() {
  // 🎯 useParams - 获取 URL 中的动态参数
  const { id } = useParams();
  
  // id 是字符串类型，如果需要数字，要转换
  const noteId = parseInt(id);
  
  // 根据 ID 获取数据
  const note = getNoteById(noteId);
  
  return (
    <div>
      <h1>笔记详情 - ID: {id}</h1>
      <p>{note.content}</p>
    </div>
  );
}
```

### 3️⃣ 完整示例：笔记详情页

```jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function NoteDetailPage() {
  const { id } = useParams(); // 获取路由参数
  const navigate = useNavigate(); // 用于编程式导航
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟从 API 或 localStorage 获取数据
    const fetchNote = () => {
      try {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const foundNote = notes.find(n => n.id === parseInt(id));
        
        if (foundNote) {
          setNote(foundNote);
        } else {
          // 笔记不存在，3秒后自动跳转到首页
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('加载笔记失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [id, navigate]);
  
  // 加载中状态
  if (loading) {
    return <div>⏳ 加载中...</div>;
  }
  
  // 笔记不存在
  if (!note) {
    return (
      <div>
        <h2>😕 笔记不存在</h2>
        <p>ID 为 {id} 的笔记未找到</p>
        <Link to="/">返回首页</Link>
      </div>
    );
  }
  
  // 正常显示笔记
  return (
    <div>
      {/* 面包屑导航 */}
      <nav>
        <Link to="/">首页</Link> / 笔记详情
      </nav>
      
      <article>
        <h1>{note.title}</h1>
        <p>{note.content}</p>
        
        <div>
          <button onClick={() => navigate(`/edit/${id}`)}>
            ✏️ 编辑
          </button>
          <button onClick={() => navigate(-1)}>
            ⬅️ 返回
          </button>
        </div>
      </article>
    </div>
  );
}

export default NoteDetailPage;
```

---

## 编程式导航

### 🎯 什么是编程式导航？

在代码逻辑中通过 JavaScript 控制路由跳转，而不是通过点击 `<Link>` 组件。

### 1️⃣ `useNavigate()` Hook

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // ========== 基础用法 ==========
  
  // 跳转到指定路径
  const goToHome = () => {
    navigate('/');
  };
  
  // 跳转到动态路由
  const viewNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };
  
  // 返回上一页（相当于浏览器的后退按钮）
  const goBack = () => {
    navigate(-1);
  };
  
  // 前进一页
  const goForward = () => {
    navigate(1);
  };
  
  // ========== 高级用法 ==========
  
  // 替换当前历史记录（不可后退到当前页）
  const replaceToHome = () => {
    navigate('/', { replace: true });
  };
  
  // 传递状态数据
  const goToProfile = () => {
    navigate('/profile', {
      state: {
        from: 'home',
        message: '欢迎回来！'
      }
    });
  };
  
  return (
    <div>
      <button onClick={goToHome}>首页</button>
      <button onClick={() => viewNote(123)}>查看笔记 123</button>
      <button onClick={goBack}>返回</button>
    </div>
  );
}
```

### 2️⃣ 接收传递的状态 - `useLocation()`

```jsx
import { useLocation } from 'react-router-dom';

function ProfilePage() {
  const location = useLocation();
  
  // 获取通过 navigate 传递的状态
  const { from, message } = location.state || {};
  
  return (
    <div>
      <h1>个人资料</h1>
      {from && <p>来自: {from}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
```

### 3️⃣ 实战示例：表单提交后跳转

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateNotePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 创建笔记
    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    
    // 保存到 localStorage
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.unshift(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    // 🎯 保存成功后，跳转到笔记详情页
    navigate(`/notes/${newNote.id}`, {
      state: { message: '笔记创建成功！' }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
        required
      />
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="内容"
        required
      />
      <button type="submit">创建笔记</button>
      <button type="button" onClick={() => navigate(-1)}>
        取消
      </button>
    </form>
  );
}
```

---

## 路由守卫

### 🎯 什么是路由守卫？

路由守卫用于控制访问权限，例如：
- 未登录用户不能访问个人中心
- 普通用户不能访问管理员页面
- 未完成实名认证不能访问某些功能

### 1️⃣ 基础路由守卫组件

```jsx
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * 路由守卫组件 - 保护需要登录才能访问的路由
 */
function ProtectedRoute({ children }) {
  // 检查用户是否已登录
  // 实际项目中，可以从 Context、Redux 或 localStorage 获取
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    alert('⚠️ 请先登录！');
    // replace: true 表示替换当前历史记录，防止用户点击后退按钮回到受保护页面
    return <Navigate to="/login" replace />;
  }
  
  // 如果已登录，渲染子组件
  return children;
}

export default ProtectedRoute;
```

### 2️⃣ 在路由中使用守卫

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Routes>
  {/* 公开路由 */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  
  {/* 受保护的路由 - 需要登录 */}
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } 
  />
  
  <Route 
    path="/settings" 
    element={
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    } 
  />
  
  {/* 管理员路由 - 需要管理员权限 */}
  <Route 
    path="/admin" 
    element={
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    } 
  />
</Routes>
```

### 3️⃣ 高级守卫：基于角色的权限控制

```jsx
// src/components/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * 基于角色的路由守卫
 * @param {string} requiredRole - 需要的角色（'admin', 'user', 'guest'）
 */
function RoleBasedRoute({ children, requiredRole }) {
  // 获取当前用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';
  
  // 检查是否已登录
  if (!user.id) {
    return <Navigate to="/login" replace />;
  }
  
  // 检查角色权限
  if (userRole !== requiredRole) {
    alert('⚠️ 您没有访问权限！');
    return <Navigate to="/" replace />;
  }
  
  // 权限验证通过，渲染子组件
  return children;
}

export default RoleBasedRoute;
```

**使用示例：**

```jsx
<Routes>
  {/* 普通用户路由 */}
  <Route 
    path="/profile" 
    element={
      <RoleBasedRoute requiredRole="user">
        <ProfilePage />
      </RoleBasedRoute>
    } 
  />
  
  {/* 管理员路由 */}
  <Route 
    path="/admin" 
    element={
      <RoleBasedRoute requiredRole="admin">
        <AdminPage />
      </RoleBasedRoute>
    } 
  />
</Routes>
```

### 4️⃣ 登录后重定向回原页面

```jsx
// src/components/ProtectedRoute.jsx（改进版）
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  
  if (!isAuthenticated) {
    // 🎯 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}
```

**登录页面处理重定向：**

```jsx
// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  
  // 获取用户原本想访问的页面
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 模拟登录
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({ username }));
    
    // 🎯 登录成功后，重定向回原页面
    navigate(from, { replace: true });
  };
  
  return (
    <form onSubmit={handleLogin}>
      <h2>登录</h2>
      <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="用户名"
        required
      />
      <button type="submit">登录</button>
    </form>
  );
}
```

---

## 常用 Hooks

### 📌 Hooks 速查表

| Hook | 用途 | 返回值 |
|------|------|--------|
| `useNavigate()` | 编程式导航 | 导航函数 |
| `useParams()` | 获取动态路由参数 | 参数对象 |
| `useLocation()` | 获取当前路由信息 | location 对象 |
| `useSearchParams()` | 获取/设置查询参数 | [params, setParams] |
| `useMatch()` | 匹配当前路由 | match 对象或 null |

### 1️⃣ `useSearchParams()` - 处理查询参数

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  // 类似 useState，返回 [参数对象, 设置函数]
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 读取查询参数
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort') || 'newest';
  
  // 设置查询参数
  const handleSearch = (newQuery) => {
    // 方法1：直接设置对象
    setSearchParams({ q: newQuery, page: '1' });
    
    // 方法2：更新现有参数
    setSearchParams(prev => {
      prev.set('q', newQuery);
      prev.set('page', '1');
      return prev;
    });
  };
  
  // 清除某个参数
  const clearSort = () => {
    setSearchParams(prev => {
      prev.delete('sort');
      return prev;
    });
  };
  
  return (
    <div>
      <h1>搜索: {query}</h1>
      <p>页码: {page}</p>
      <p>排序: {sort}</p>
      
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      <button onClick={clearSort}>清除排序</button>
    </div>
  );
}
```

**URL 示例：**
- `/search?q=react&page=1&sort=newest`
- `searchParams.get('q')` → `"react"`
- `searchParams.get('page')` → `"1"`

### 2️⃣ `useLocation()` - 获取路由信息

```jsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  console.log(location.pathname);  // '/notes/123'
  console.log(location.search);    // '?sort=newest'
  console.log(location.hash);      // '#section1'
  console.log(location.state);     // { from: 'home' }
  console.log(location.key);       // 唯一标识符
  
  return <div>当前路径: {location.pathname}</div>;
}
```

### 3️⃣ `useMatch()` - 匹配路由模式

```jsx
import { useMatch } from 'react-router-dom';

function Navigation() {
  // 检查当前路由是否匹配指定模式
  const isHomePage = useMatch('/');
  const isNotePage = useMatch('/notes/:id');
  const isEditPage = useMatch('/edit/:id');
  
  return (
    <nav>
      <Link to="/" className={isHomePage ? 'active' : ''}>
        首页
      </Link>
      
      {/* 根据当前路由显示不同内容 */}
      {isNotePage && <span>正在查看笔记</span>}
      {isEditPage && <span>正在编辑笔记</span>}
    </nav>
  );
}
```

---

## 完整实战示例

### 📝 笔记应用的路由结构

```
/                           → 笔记列表（首页）
/notes/:id                  → 笔记详情页
/create                     → 创建笔记
/edit/:id                   → 编辑笔记
/search?q=xxx               → 搜索结果页
/tags/:tagName              → 按标签筛选
/login                      → 登录页
/profile                    → 个人中心（需要登录）
/settings                   → 设置（需要登录）
/about                      → 关于页面
*                           → 404 页面
```

### 完整路由配置

```jsx
// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 布局组件
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// 页面组件
import HomePage from '../pages/HomePage';
import NoteDetailPage from '../pages/NoteDetailPage';
import CreateNotePage from '../pages/CreateNotePage';
import EditNotePage from '../pages/EditNotePage';
import SearchPage from '../pages/SearchPage';
import TagNotesPage from '../pages/TagNotesPage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 - 带布局 */}
        <Route path="/" element={<Layout />}>
          {/* 首页 */}
          <Route index element={<HomePage />} />
          
          {/* 笔记相关 */}
          <Route path="notes/:id" element={<NoteDetailPage />} />
          <Route path="create" element={<CreateNotePage />} />
          <Route path="edit/:id" element={<EditNotePage />} />
          
          {/* 搜索和筛选 */}
          <Route path="search" element={<SearchPage />} />
          <Route path="tags/:tagName" element={<TagNotesPage />} />
          
          {/* 关于 */}
          <Route path="about" element={<AboutPage />} />
          
          {/* 受保护的路由 - 需要登录 */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 登录页 - 不带布局 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 404 页面 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
```

### 修改 NoteList 组件支持路由

```jsx
// src/components/NoteItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoteItem({ note, onDelete, onToggleStar }) {
  const navigate = useNavigate();
  
  // 点击标题跳转到详情页
  const handleTitleClick = () => {
    navigate(`/notes/${note.id}`);
  };
  
  // 点击编辑按钮跳转到编辑页
  const handleEdit = () => {
    navigate(`/edit/${note.id}`);
  };
  
  return (
    <div className="note-item">
      {/* 可点击的标题 */}
      <h3 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        {note.isStarred && '⭐ '}
        {note.title}
      </h3>
      
      <p>{note.content.substring(0, 100)}...</p>
      
      <div className="note-actions">
        <button onClick={handleEdit}>✏️ 编辑</button>
        <button onClick={() => onToggleStar(note.id)}>
          {note.isStarred ? '⭐' : '☆'}
        </button>
        <button onClick={() => onDelete(note.id)}>🗑️ 删除</button>
      </div>
    </div>
  );
}

export default NoteItem;
```

---

## 最佳实践

### ✅ 推荐做法

1. **路由配置集中管理**
   ```jsx
   // ✅ 好 - 所有路由在一个文件中
   src/routes/AppRouter.jsx
   
   // ❌ 差 - 路由配置分散在各个组件中
   ```

2. **使用嵌套路由实现布局复用**
   ```jsx
   // ✅ 好 - 使用 Layout + Outlet
   <Route path="/" element={<Layout />}>
     <Route index element={<HomePage />} />
     <Route path="about" element={<AboutPage />} />
   </Route>
   
   // ❌ 差 - 每个页面都重复写导航栏和页脚
   ```

3. **动态导入页面组件（代码分割）**
   ```jsx
   // ✅ 好 - 使用懒加载
   import { lazy, Suspense } from 'react';
   const HomePage = lazy(() => import('../pages/HomePage'));
   
   <Suspense fallback={<div>加载中...</div>}>
     <Routes>
       <Route path="/" element={<HomePage />} />
     </Routes>
   </Suspense>
   ```

4. **路径常量化**
   ```jsx
   // src/constants/routes.js
   export const ROUTES = {
     HOME: '/',
     NOTE_DETAIL: '/notes/:id',
     CREATE_NOTE: '/create',
     EDIT_NOTE: '/edit/:id',
     LOGIN: '/login',
     PROFILE: '/profile'
   };
   
   // 使用
   <Route path={ROUTES.HOME} element={<HomePage />} />
   navigate(ROUTES.CREATE_NOTE);
   ```

5. **404 页面放在最后**
   ```jsx
   // ✅ 好 - 放在最后，捕获所有未匹配的路由
   <Route path="*" element={<NotFoundPage />} />
   ```

### ⚠️ 常见错误

1. **忘记包裹 `<BrowserRouter>`**
   ```jsx
   // ❌ 错误
   function App() {
     return (
       <Routes>
         <Route path="/" element={<HomePage />} />
       </Routes>
     );
   }
   
   // ✅ 正确
   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<HomePage />} />
         </Routes>
       </BrowserRouter>
     );
   }
   ```

2. **在 `<BrowserRouter>` 外部使用路由 Hooks**
   ```jsx
   // ❌ 错误 - useNavigate 在 BrowserRouter 外部
   function App() {
     const navigate = useNavigate(); // 报错！
     return <BrowserRouter>...</BrowserRouter>;
   }
   
   // ✅ 正确 - useNavigate 在 BrowserRouter 内部
   function App() {
     return (
       <BrowserRouter>
         <MyComponent />
       </BrowserRouter>
     );
   }
   
   function MyComponent() {
     const navigate = useNavigate(); // 正确
     // ...
   }
   ```

3. **动态参数忘记转换类型**
   ```jsx
   // ❌ 错误 - id 是字符串，比较会出错
   const { id } = useParams();
   const note = notes.find(n => n.id === id); // 找不到
   
   // ✅ 正确 - 转换为数字
   const { id } = useParams();
   const note = notes.find(n => n.id === parseInt(id));
   ```

4. **使用 `<a>` 而不是 `<Link>`**
   ```jsx
   // ❌ 错误 - 会导致页面刷新
   <a href="/about">关于</a>
   
   // ✅ 正确 - 不会刷新页面
   <Link to="/about">关于</Link>
   ```

---

## 🎯 总结

### 核心概念

- **路由配置**：使用 `<Routes>` 和 `<Route>` 定义路由映射
- **动态路由**：使用 `:param` 语法定义，用 `useParams()` 获取
- **编程式导航**：使用 `useNavigate()` 在代码中控制跳转
- **路由守卫**：创建守卫组件，控制访问权限

### 常用 API

| API | 用途 |
|-----|------|
| `<BrowserRouter>` | 路由容器（使用 HTML5 History API） |
| `<Routes>` | 路由集合 |
| `<Route>` | 单个路由定义 |
| `<Link>` | 声明式导航链接 |
| `<NavLink>` | 自动高亮的导航链接 |
| `<Outlet>` | 嵌套路由的占位符 |
| `<Navigate>` | 编程式重定向组件 |
| `useNavigate()` | 编程式导航 Hook |
| `useParams()` | 获取动态参数 Hook |
| `useLocation()` | 获取路由信息 Hook |
| `useSearchParams()` | 获取/设置查询参数 Hook |

### 下一步

1. **实践**：在你的笔记应用中添加路由
2. **优化**：使用代码分割提升性能
3. **进阶**：学习 React Router v6 的新特性（`<Outlet context>`、数据路由等）

---

## 📚 相关资源

- [React Router 官方文档](https://reactrouter.com/)
- [React Router v6 迁移指南](https://reactrouter.com/en/main/upgrading/v5)
- [React Router 实战教程](https://www.robinwieruch.de/react-router/)

---

**🎉 恭喜你！现在你已经掌握了 React Router 的核心知识！**

如果有任何疑问，欢迎随时提问！😊

