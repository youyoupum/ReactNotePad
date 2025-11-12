# React Router 实战完整教程 🚀

> **适合人群**：React 初学者
> **学习目标**：掌握 React Router v6 的核心用法，实现多页面单页应用

---

## 📑 教程大纲

1. [项目改造总览](#项目改造总览)
2. [核心概念速查](#核心概念速查)
3. [实现步骤详解](#实现步骤详解)
4. [常见问题](#常见问题)
5. [最佳实践](#最佳实践)

---

## 项目改造总览

### 🎯 我们做了什么？

将单页面笔记应用改造为多页面应用，实现：
- ✅ 首页（笔记列表）
- ✅ 笔记详情页（动态路由）
- ✅ 编辑笔记页（动态路由）
- ✅ 登录页（独立布局）
- ✅ 个人中心页（需要登录）
- ✅ 关于页
- ✅ 404 页面

### 📁 新增文件结构

```
src/
├── routes/
│   └── AppRouter.jsx          # 路由配置
├── pages/                      # 页面组件
│   ├── HomePage.jsx
│   ├── NoteDetailPage.jsx
│   ├── EditNotePage.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   ├── AboutPage.jsx
│   └── NotFoundPage.jsx
└── components/
    ├── Layout.jsx              # 布局组件（导航栏+页脚）
    └── ProtectedRoute.jsx      # 路由守卫
```

---

## 核心概念速查

### 🎣 常用 Hooks

| Hook | 作用 | 返回值 | 示例 |
|------|------|--------|------|
| `useNavigate` | 编程式导航 | 导航函数 | `navigate('/about')` |
| `useParams` | 获取URL参数 | 参数对象 | `const { id } = useParams()` |
| `useLocation` | 获取路由信息 | location对象 | `location.pathname` |
| `useSearchParams` | 查询参数 | [params, setParams] | `searchParams.get('q')` |

### 📦 常用组件

| 组件 | 作用 | 用法 |
|------|------|------|
| `<BrowserRouter>` | 路由容器 | 包裹整个应用 |
| `<Routes>` | 路由集合 | 包裹所有 Route |
| `<Route>` | 路由定义 | `<Route path="/" element={<Home />} />` |
| `<Link>` | 声明式导航 | `<Link to="/about">关于</Link>` |
| `<NavLink>` | 自动高亮链接 | 自动给当前路由添加样式 |
| `<Navigate>` | 重定向 | `<Navigate to="/login" replace />` |
| `<Outlet>` | 子路由占位符 | 在嵌套路由中使用 |

---

## 实现步骤详解

### 步骤 1️⃣: 安装依赖

```bash
npm install react-router-dom
```

### 步骤 2️⃣: 创建路由配置

**文件**: `src/routes/AppRouter.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
// ... 导入所有页面

function AppRouter(appProps) {
  return (
    <BrowserRouter>
      <Routes>
        {/* 带布局的路由 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage {...appProps} />} />
          <Route path="notes/:id" element={<NoteDetailPage />} />
          <Route path="edit/:id" element={<EditNotePage />} />
          <Route path="about" element={<AboutPage />} />
          
          {/* 受保护路由 */}
          <Route path="profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
        </Route>
        
        {/* 独立布局路由 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**💡 关键点**：
- `<Route path="/" element={<Layout />}>` - 父路由，提供共享布局
- `<Route index element={<HomePage />} />` - 默认子路由
- `<Route path="notes/:id" />` - 动态路由，`:id` 是参数
- `<Route path="*" />` - 捕获所有未匹配路径，必须放最后

### 步骤 3️⃣: 创建布局组件

**文件**: `src/components/Layout.jsx`

```jsx
import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* 导航栏 */}
      <nav>
        <NavLink to="/">首页</NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/profile">个人中心</NavLink>
      </nav>
      
      {/* 👇 子路由在这里渲染 */}
      <main>
        <Outlet />
      </main>
      
      {/* 页脚 */}
      <footer>© 2025 React 笔记本</footer>
    </div>
  );
}
```

**💡 关键点**：
- `<Outlet />` - 子路由的占位符
- `<NavLink>` - 自动高亮当前路由

### 步骤 4️⃣: 创建路由守卫

**文件**: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 已登录，渲染页面
  return children;
}
```

**💡 关键点**：
- `state={{ from: location }}` - 保存原路径，登录后跳回
- `replace` - 替换历史记录，防止循环重定向

### 步骤 5️⃣: 创建页面组件

#### 首页（HomePage）

```jsx
import { useNavigate } from 'react-router-dom';

function HomePage({ state, ...otherProps }) {
  const navigate = useNavigate();
  
  const handleViewNote = (noteId) => {
    navigate(`/notes/${noteId}`);  // 跳转到详情页
  };
  
  const handleEditNote = (noteId) => {
    navigate(`/edit/${noteId}`);   // 跳转到编辑页
  };
  
  return (
    <div>
      <NoteList 
        onViewNote={handleViewNote}
        onEditNote={handleEditNote}
        {...otherProps}
      />
    </div>
  );
}
```

#### 笔记详情页（NoteDetailPage）

```jsx
import { useParams, useNavigate } from 'react-router-dom';

function NoteDetailPage() {
  const { id } = useParams();  // 获取 URL 参数
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  
  useEffect(() => {
    // 从 localStorage 加载笔记
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const foundNote = notes.find(n => n.id === parseInt(id));
    setNote(foundNote);
  }, [id]);
  
  return (
    <div>
      <h1>{note?.title}</h1>
      <p>{note?.content}</p>
      <button onClick={() => navigate(`/edit/${id}`)}>编辑</button>
      <button onClick={() => navigate(-1)}>返回</button>
    </div>
  );
}
```

**💡 关键点**：
- `useParams()` 获取 `:id` 参数
- `parseInt(id)` - useParams 返回字符串，需转换
- `navigate(-1)` - 返回上一页

#### 登录页（LoginPage）

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取用户原本想访问的页面
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 保存登录状态
    localStorage.setItem('isLoggedIn', 'true');
    
    // 跳转回原页面
    navigate(from, { replace: true });
  };
  
  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="用户名" required />
      <input type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
  );
}
```

### 步骤 6️⃣: 修改 App.js

```jsx
import AppRouter from './routes/AppRouter';

function App() {
  // ... 所有状态管理代码 ...
  
  // 打包所有 props
  const appProps = {
    state,
    dispatch,
    filteredNotes,
    displayedNotes,
    // ... 其他状态和方法
  };
  
  // 渲染路由
  return <AppRouter {...appProps} />;
}
```

---

## 常见问题

### ❓ useParams 获取的参数是什么类型？

**答**：字符串。需要转换：
```jsx
const { id } = useParams();  // "123"
const noteId = parseInt(id);  // 123
```

### ❓ Link 和 navigate 有什么区别？

**答**：
- `<Link>` - 用于渲染链接（JSX 中）
- `navigate()` - 用于代码逻辑中跳转（如提交表单后）

```jsx
// JSX 中用 Link
<Link to="/about">关于</Link>

// 函数中用 navigate
const handleSubmit = () => {
  // ... 保存数据
  navigate('/notes');
};
```

### ❓ 如何传递数据到下一个页面？

**方法1：通过 URL 参数**
```jsx
navigate(`/notes/${id}`);
// 下一页用 useParams() 获取
```

**方法2：通过 state**
```jsx
navigate('/profile', { state: { message: '欢迎！' } });
// 下一页用 useLocation() 获取
const location = useLocation();
const message = location.state?.message;
```

### ❓ 路由守卫如何工作？

```jsx
// 1. 定义守卫组件
function ProtectedRoute({ children }) {
  const isLoggedIn = checkAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// 2. 使用守卫
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### ❓ 404 页面怎么实现？

```jsx
// 在路由最后添加通配符路由
<Route path="*" element={<NotFoundPage />} />
```

---

## 最佳实践

### ✅ DO（推荐做法）

1. **路由配置集中管理**
   ```jsx
   // ✅ 好 - 统一在 AppRouter.jsx
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/about" element={<About />} />
   </Routes>
   ```

2. **使用嵌套路由复用布局**
   ```jsx
   // ✅ 好 - 使用 Layout + Outlet
   <Route path="/" element={<Layout />}>
     <Route index element={<Home />} />
     <Route path="about" element={<About />} />
   </Route>
   ```

3. **路径常量化**
   ```jsx
   // constants/routes.js
   export const ROUTES = {
     HOME: '/',
     NOTE_DETAIL: '/notes/:id',
     LOGIN: '/login'
   };
   
   // 使用
   <Route path={ROUTES.HOME} element={<Home />} />
   navigate(ROUTES.LOGIN);
   ```

4. **404 路由放最后**
   ```jsx
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/about" element={<About />} />
     <Route path="*" element={<NotFound />} />  {/* 👈 最后 */}
   </Routes>
   ```

### ❌ DON'T（避免的做法）

1. **❌ 使用 `<a>` 标签**
   ```jsx
   // ❌ 错误 - 会刷新页面
   <a href="/about">关于</a>
   
   // ✅ 正确 - 不会刷新
   <Link to="/about">关于</Link>
   ```

2. **❌ 忘记包裹 BrowserRouter**
   ```jsx
   // ❌ 错误
   function App() {
     return <Routes>...</Routes>;
   }
   
   // ✅ 正确
   function App() {
     return (
       <BrowserRouter>
         <Routes>...</Routes>
       </BrowserRouter>
     );
   }
   ```

3. **❌ 在 BrowserRouter 外使用 Hooks**
   ```jsx
   // ❌ 错误
   function App() {
     const navigate = useNavigate();  // 报错！
     return <BrowserRouter>...</BrowserRouter>;
   }
   
   // ✅ 正确
   function MyComponent() {
     const navigate = useNavigate();  // 在 BrowserRouter 内部
   }
   ```

---

## 📚 下一步学习

1. **懒加载优化**
   ```jsx
   const HomePage = lazy(() => import('./pages/HomePage'));
   
   <Suspense fallback={<Loading />}>
     <Routes>...</Routes>
   </Suspense>
   ```

2. **数据路由（React Router v6.4+）**
   - loader/action
   - useLoaderData
   - Form 组件

3. **搜索参数管理**
   ```jsx
   const [searchParams, setSearchParams] = useSearchParams();
   const query = searchParams.get('q');
   ```

---

## 🎓 总结

### 核心要点

1. **BrowserRouter** - 包裹整个应用
2. **Routes + Route** - 定义路由映射
3. **useNavigate** - 编程式导航
4. **useParams** - 获取动态参数
5. **Outlet** - 嵌套路由占位符
6. **ProtectedRoute** - 路由守卫

### 路由流程

```
用户点击 Link 
  ↓
URL 改变
  ↓
React Router 匹配路由
  ↓
渲染对应的组件
  ↓
不刷新页面！
```

### 项目文件导航

- `src/routes/AppRouter.jsx` - 查看完整路由配置
- `src/components/Layout.jsx` - 查看布局实现
- `src/components/ProtectedRoute.jsx` - 查看路由守卫实现
- `src/pages/` - 查看所有页面组件

---

## 💪 实战练习

1. **添加搜索页面**
   - 创建 `SearchPage.jsx`
   - 路由：`/search?q=xxx`
   - 使用 `useSearchParams()` 获取查询参数

2. **添加标签页面**
   - 创建 `TagPage.jsx`
   - 路由：`/tags/:tagName`
   - 显示该标签下的所有笔记

3. **添加设置页面**
   - 创建 `SettingsPage.jsx`
   - 路由：`/settings`
   - 添加路由守卫保护

---

**🎉 恭喜你完成 React Router 实战教程！**

现在你已经掌握了：
- ✅ 路由配置
- ✅ 动态路由
- ✅ 编程式导航
- ✅ 路由守卫
- ✅ 嵌套路由
- ✅ 布局复用

继续实践，加油！💪
