import React, { createContext, useState, useContext, useEffect } from 'react';

// ========== 📦 创建主题 Context ==========
// createContext 创建一个新的 Context 对象
// 这个对象包含 Provider（提供者）和 Consumer（消费者）
export const ThemeContext = createContext();

// ========== 🎨 主题配置 ==========
// 定义深色和浅色两种主题的 CSS 变量
export const themes = {
  light: {
    name: 'light',
    colors: {
      // 背景渐变
      primaryBg: '#667eea',
      secondaryBg: '#764ba2',
      
      // 文字颜色
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      textHint: 'rgba(255, 255, 255, 0.85)',
      
      // 卡片/容器背景
      cardBg: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(255, 255, 255, 0.3)',
      
      // 表单元素
      inputBg: 'rgba(255, 255, 255, 0.9)',
      inputBorder: 'rgba(255, 255, 255, 0.3)',
      
      // 按钮颜色
      buttonPrimary: '#667eea',
      buttonSuccess: '#4CAF50',
      buttonDanger: '#f44336',
      buttonWarning: '#ff9800',
      
      // 标签筛选器
      tagButtonBg: 'rgba(255, 255, 255, 0.2)',
      tagButtonActive: '#667eea',
      
      // 排序面板
      sortContainerBg: 'rgba(255, 255, 255, 0.15)',
      
      // 笔记卡片文字颜色（深色）
      noteText: '#333',
      noteMeta: '#666',
      
      // 👈 新增：Markdown 代码高亮颜色
      codeBg: 'rgba(0, 0, 0, 0.05)',
      codeText: '#c7254e'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      // 背景渐变（深色）
      primaryBg: '#1a1a2e',
      secondaryBg: '#16213e',
      
      // 文字颜色
      textPrimary: '#e0e0e0',
      textSecondary: 'rgba(224, 224, 224, 0.9)',
      textHint: 'rgba(224, 224, 224, 0.7)',
      
      // 卡片/容器背景（深色）
      cardBg: 'rgba(30, 30, 46, 0.95)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      
      // 表单元素（深色）
      inputBg: 'rgba(40, 40, 56, 0.9)',
      inputBorder: 'rgba(255, 255, 255, 0.2)',
      
      // 按钮颜色（深色模式下稍微调亮）
      buttonPrimary: '#7c8ff0',
      buttonSuccess: '#66bb6a',
      buttonDanger: '#ef5350',
      buttonWarning: '#ffa726',
      
      // 标签筛选器（深色）
      tagButtonBg: 'rgba(255, 255, 255, 0.1)',
      tagButtonActive: '#7c8ff0',
      
      // 排序面板（深色）
      sortContainerBg: 'rgba(255, 255, 255, 0.05)',
      
      // 笔记卡片文字颜色（浅色）
      noteText: '#e0e0e0',
      noteMeta: '#a0a0a0',
      
      // 👈 新增：Markdown 代码高亮颜色（深色模式）
      codeBg: 'rgba(0, 0, 0, 0.3)',
      codeText: '#98c379'
    }
  }
};

// ========== 🎨 ThemeProvider 组件 ==========
// 这是一个高阶组件，用于包裹整个应用，提供主题上下文
export function ThemeProvider({ children }) {
  // 从 localStorage 读取保存的主题，如果没有则默认使用浅色主题
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // ========== 💾 保存主题到 localStorage ==========
  // 当主题变化时，保存到 localStorage，实现持久化
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ========== 🎨 应用 CSS 变量 ==========
  // 当主题变化时，更新 CSS 变量
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    
    // 遍历当前主题的所有颜色配置，设置为 CSS 变量
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      // 将驼峰命名转换为短横线命名
      // 例如：primaryBg -> --primary-bg
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }, [theme]);

  // ========== 🔄 切换主题函数 ==========
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Context 提供的值
  const value = {
    theme,           // 当前主题名称（'light' 或 'dark'）
    setTheme,        // 设置主题的函数
    toggleTheme,     // 切换主题的函数
    themeColors: themes[theme].colors  // 当前主题的颜色配置
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========== 🎣 自定义 Hook：useTheme ==========
// 这是一个便捷的 Hook，用于在组件中使用主题上下文
// 使用这个 Hook 比直接使用 useContext(ThemeContext) 更简洁
export function useTheme() {
  const context = useContext(ThemeContext);
  
  // 如果在 ThemeProvider 之外使用这个 Hook，抛出错误
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  
  return context;
}

