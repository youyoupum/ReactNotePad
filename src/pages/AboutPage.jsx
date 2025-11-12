import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>📖 关于本应用</h1>

      <div style={{
        background: 'var(--note-bg)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        lineHeight: '1.8'
      }}>
        <h2>🎯 功能特点</h2>
        <ul style={{ fontSize: '16px' }}>
          <li>✏️ 创建和编辑笔记（支持 Markdown）</li>
          <li>⭐ 收藏重要笔记</li>
          <li>🏷️ 添加标签分类</li>
          <li>🔍 搜索和筛选笔记</li>
          <li>↕️ 拖拽排序</li>
          <li>🌓 深色/浅色主题切换</li>
          <li>🚀 无限滚动加载</li>
          <li>🔐 路由守卫和权限控制</li>
        </ul>

        <h2 style={{ marginTop: '30px' }}>🛠️ 技术栈</h2>
        <ul style={{ fontSize: '16px' }}>
          <li><strong>React 19</strong> - 前端框架</li>
          <li><strong>React Router v6</strong> - 路由管理</li>
          <li><strong>React Hooks</strong> - 状态管理</li>
          <li><strong>useReducer</strong> - 复杂状态管理</li>
          <li><strong>React Markdown</strong> - Markdown 渲染</li>
          <li><strong>LocalStorage</strong> - 数据持久化</li>
        </ul>

        <h2 style={{ marginTop: '30px' }}>👨‍💻 学习目标</h2>
        <p style={{ fontSize: '16px' }}>
          本项目旨在帮助初学者掌握 React 的核心概念和常用技术栈，
          包括组件化开发、状态管理、路由导航、性能优化等。
        </p>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
