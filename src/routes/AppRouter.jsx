import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 布局和守卫组件
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// 页面组件
import HomePage from '../pages/HomePage';
import NoteDetailPage from '../pages/NoteDetailPage';
import EditNotePage from '../pages/EditNotePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * 路由配置组件（使用 Zustand 状态管理）
 * 
 * 路由结构说明：
 * 1. 公开路由（不需要登录）：
 *    - / - 首页（笔记列表）
 *    - /notes/:id - 笔记详情页
 *    - /edit/:id - 编辑笔记页
 *    - /about - 关于页面
 *    - /login - 登录页（不使用 Layout）
 * 
 * 2. 受保护路由（需要登录）：
 *    - /profile - 个人中心
 * 
 * 3. 404 路由：
 *    - * - 所有未匹配的路径
 * 
 * 优势：
 * - 不需要接收和传递 props
 * - 每个页面组件直接从 store 获取状态
 * - 代码更简洁，耦合度更低
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== 带布局的路由 ===== */}
        <Route path="/" element={<Layout />}>
          {/* 首页 - index 表示父路由的默认子路由 */}
          {/* 不需要传递 props，HomePage 直接从 store 获取状态 */}
          <Route 
            index 
            element={<HomePage />} 
          />
          
          {/* 笔记详情页 - 动态路由参数 :id */}
          <Route 
            path="notes/:id" 
            element={<NoteDetailPage />} 
          />
          
          {/* 编辑笔记页 - 动态路由参数 :id */}
          <Route 
            path="edit/:id" 
            element={<EditNotePage />} 
          />
          
          {/* 关于页面 */}
          <Route 
            path="about" 
            element={<AboutPage />} 
          />
          
          {/* ===== 受保护的路由 - 需要登录 ===== */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* ===== 不带布局的路由 ===== */}
        {/* 登录页 - 独立布局 */}
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        
        {/* ===== 404 页面 ===== */}
        {/* path="*" 会匹配所有未定义的路径 */}
        <Route 
          path="*" 
          element={<NotFoundPage />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
