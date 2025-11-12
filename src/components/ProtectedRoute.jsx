import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// ========== 📦 导入 Zustand Store ==========
import { useAuthStore } from '../store';

/**
 * 路由守卫组件 - 保护需要登录才能访问的路由（使用 Zustand 状态管理）
 * 
 * 工作原理：
 * 1. 检查用户是否已登录（从 Zustand store 读取登录状态）
 * 2. 如果已登录，渲染子组件（受保护的页面）
 * 3. 如果未登录，重定向到登录页，并保存原路径用于登录后跳转
 * 
 * 使用方式：
 * <Route 
 *   path="/profile" 
 *   element={
 *     <ProtectedRoute>
 *       <ProfilePage />
 *     </ProtectedRoute>
 *   } 
 * />
 * 
 * 优势：
 * - 使用 Zustand store 统一管理认证状态
 * - 不需要直接访问 localStorage
 * - 状态更新时组件会自动重新渲染
 * 
 * @param {ReactNode} children - 受保护的页面组件
 */
function ProtectedRoute({ children }) {
  // 🎯 useLocation - 获取当前路径，用于保存用户原本想访问的页面
  const location = useLocation();
  
  // ========== 📦 从 Zustand Store 获取认证状态 ==========
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // 📌 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    // 🎯 保存当前路径到 state 中
    // 登录成功后，LoginPage 可以从 location.state.from 获取原路径
    // 然后重定向回来，提供更好的用户体验
    return <Navigate 
      to="/login" 
      state={{ from: location }}  // 传递原路径
      replace  // 替换历史记录，防止用户点击后退回到受保护页面
    />;
  }
  
  // ✅ 如果已登录，渲染受保护的页面
  return children;
}

export default ProtectedRoute;
