import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

// ========== 📦 导入 Zustand Store ==========
import { useAuthStore } from '../store';

/**
 * 布局组件 - 提供共享的页面结构（使用 Zustand 状态管理）
 * 
 * 功能：
 * 1. 顶部导航栏 - 显示所有主要链接
 * 2. 使用 Outlet 渲染子路由的内容
 * 3. 底部页脚（可选）
 * 
 * 优势：
 * - 避免在每个页面重复写导航栏
 * - 导航栏在页面切换时不会重新渲染（性能优化）
 * - 统一的页面布局风格
 * - 从 store 获取认证状态，不直接访问 localStorage
 */
function Layout() {
  const navigate = useNavigate();
  
  // ========== 📦 从 Zustand Store 获取认证状态 ==========
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // 退出登录
  const handleLogout = () => {
    logout();  // 调用 store 的 logout 方法
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 导航栏 - 所有页面共享 */}
      <nav style={{
        background: 'var(--nav-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
        padding: '0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px'
        }}>
          {/* 左侧：Logo 和主导航 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NavLink 
              to="/" 
              style={{ 
                color: 'white',
                textDecoration: 'none',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              📝 React 笔记本
            </NavLink>

            <div style={{ display: 'flex', gap: '15px' }}>
              <NavLink 
                to="/"
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'background 0.3s'
                })}
              >
                🏠 首页
              </NavLink>

              <NavLink 
                to="/about"
                style={({ isActive }) => ({
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'background 0.3s'
                })}
              >
                📖 关于
              </NavLink>
            </div>
          </div>

          {/* 右侧：用户信息和登录/个人中心 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: 'white' }}>
                  👤 {user.username}
                </span>
                <NavLink 
                  to="/profile"
                  style={({ isActive }) => ({
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    transition: 'background 0.3s'
                  })}
                >
                  👤 个人中心
                </NavLink>
                <button
                  onClick={handleLogout}
                  style={{
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid white',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  🚪 退出
                </button>
              </>
            ) : (
              <NavLink 
                to="/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 20px',
                  borderRadius: '5px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid white',
                  transition: 'background 0.3s'
                }}
              >
                🔐 登录
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容区域 - 这里会渲染子路由的内容 */}
      <main style={{ flex: 1 }}>
        {/* 🎯 Outlet - 子路由的占位符 */}
        {/* 当访问不同路径时，对应的页面组件会在这里渲染 */}
        <Outlet />
      </main>

      {/* 页脚 - 所有页面共享 */}
      <footer style={{
        background: '#f8f9fa',
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #dee2e6',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          © 2025 React 笔记本 | 使用 React + React Router 构建
        </p>
      </footer>
    </div>
  );
}

export default Layout;
