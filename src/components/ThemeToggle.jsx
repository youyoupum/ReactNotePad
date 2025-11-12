import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ========== 🌓 主题切换按钮组件 ==========
function ThemeToggle() {
  // 使用 useTheme Hook 获取主题状态和切换函数
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={themeToggleButtonStyle}
      title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      aria-label="切换主题"
    >
      {/* 根据当前主题显示不同的图标 */}
      <span style={iconStyle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span style={textStyle}>
        {theme === 'light' ? '深色模式' : '浅色模式'}
      </span>
    </button>
  );
}

// ========== 🎨 样式定义 ==========
const themeToggleButtonStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--note-text)',
  border: '2px solid var(--card-border)',
  borderRadius: '25px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  backdropFilter: 'blur(10px)'
};

const iconStyle = {
  fontSize: '1.3rem',
  display: 'inline-flex',
  alignItems: 'center'
};

const textStyle = {
  fontSize: '0.95rem'
};

// 🚀 性能优化：使用 React.memo 避免不必要的重新渲染
// ThemeToggle 使用 Context，只有 theme 变化时才需要重新渲染
export default React.memo(ThemeToggle);

