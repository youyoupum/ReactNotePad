import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ========== 📦 导入 Zustand Store ==========
import { useAuthStore } from '../store';

/**
 * 登录页组件
 * 
 * 功能：
 * 1. 提供简单的登录表单
 * 2. 模拟登录验证（实际项目中应该调用后端 API）
 * 3. 登录成功后重定向到原页面或首页
 * 
 * 路由守卫机制：
 * - 当用户访问受保护的页面时（如 /profile），会被重定向到此登录页
 * - 登录成功后，会自动跳转回原本想访问的页面
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ========== 📦 从 Zustand Store 获取登录方法 ==========
  const login = useAuthStore(state => state.login);

  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 🎯 获取用户原本想访问的页面
  // 如果是从受保护页面跳转来的，location.state.from 会包含原路径
  const from = location.state?.from?.pathname || '/';

  // 处理登录
  const handleLogin = (e) => {
    e.preventDefault();

    // 表单验证
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    if (!password.trim()) {
      alert('请输入密码');
      return;
    }

    // 🔐 使用 Zustand Store 的 login 方法
    // 这会同时更新 store 状态和 localStorage
    const success = login(username.trim(), password.trim());
    
    if (success) {
      // 🎯 登录成功后，重定向回原页面
      // replace: true 表示替换当前历史记录，防止用户点击后退回到登录页
      navigate(from, { 
        replace: true,
        state: { message: `欢迎回来，${username.trim()}！` }
      });
    } else {
      alert('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333'
        }}>
          🔐 用户登录
        </h1>

        <form onSubmit={handleLogin}>
          {/* 用户名输入 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              👤 用户名：
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* 密码输入 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              🔑 密码：
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* 提示信息 */}
          <p style={{ 
            fontSize: '14px', 
            color: '#666',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            💡 提示：输入任意用户名和密码即可登录（这是演示版本）
          </p>

          {/* 提交按钮 */}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            登录
          </button>

          {/* 返回首页链接 */}
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center' 
          }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              返回首页
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
