import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ========== 📦 导入 Zustand Stores ==========
import { useAuthStore, useNotesStore } from '../store';

/**
 * 个人中心页面组件（使用 Zustand 状态管理）
 * 
 * 功能：
 * 1. 显示用户基本信息
 * 2. 显示笔记统计信息
 * 3. 提供退出登录功能
 * 
 * 优势：
 * - 使用 Zustand store 统一管理状态
 * - 不需要直接访问 localStorage
 * - 状态更新时组件会自动重新渲染
 */
function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ========== 📦 从 Zustand Store 获取用户信息和退出登录方法 ==========
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  // ========== 📦 从 Zustand Store 获取笔记数据 ==========
  const notes = useNotesStore(state => state.notes);
  const getStarredNotes = useNotesStore(state => state.getStarredNotes);
  const getAllTags = useNotesStore(state => state.getAllTags);

  // 显示登录成功消息
  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
    }
  }, [location.state]);

  // 计算笔记统计信息
  const noteStats = useMemo(() => {
    const starredNotes = getStarredNotes();
    const allTags = getAllTags();
    
    return {
      total: notes.length,
      starred: starredNotes.length,
      tags: allTags
    };
  }, [notes, getStarredNotes, getAllTags]);

  // 退出登录
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();  // 调用 store 的 logout 方法
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>👤 个人中心</h1>

      <div style={{
        background: 'var(--note-bg)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>基本信息</h2>
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          <p><strong>👤 用户名：</strong>{user?.username || '未知'}</p>
          <p><strong>📧 邮箱：</strong>{user?.email || '未知'}</p>
        </div>
      </div>

      <div style={{
        background: 'var(--note-bg)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📊 笔记统计</h2>
        <div style={{ fontSize: '16px', lineHeight: '2' }}>
          <p><strong>📝 笔记总数：</strong>{noteStats.total} 篇</p>
          <p><strong>⭐ 收藏数：</strong>{noteStats.starred} 篇</p>
          <p><strong>🏷️ 标签数：</strong>{noteStats.tags.length} 个</p>
          {noteStats.tags.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>标签列表：</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {noteStats.tags.map((tag, index) => (
                  <span key={index} style={{
                    padding: '4px 12px',
                    background: '#007bff',
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '14px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 30px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          返回首页
        </button>
        <button onClick={handleLogout} style={{
          padding: '12px 30px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          🚪 退出登录
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
