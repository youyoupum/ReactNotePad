import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Note } from '../types';

/**
 * 笔记详情页组件
 * 
 * 功能：
 * 1. 通过 URL 参数获取笔记 ID
 * 2. 从 localStorage 读取笔记数据
 * 3. 显示笔记的详细信息
 * 4. 提供编辑、删除、返回等操作
 * 
 * 路由参数：
 * - :id - 笔记的唯一标识符
 */
const NoteDetailPage: React.FC = () => {
  // 🎯 useParams - 获取 URL 中的动态参数
  // 例如：URL 为 /notes/123 时，id = "123"
  const { id } = useParams<{id: string}>();
  
  // 🎯 useNavigate - 用于编程式导航
  const navigate = useNavigate();
  
  // 本地状态管理
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 从 localStorage 加载笔记数据
  useEffect(() => {
    try {
      const notes:Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
      // 注意：URL 参数是字符串，需要转换为数字进行比较
      const foundNote = notes.find(n => n.id === parseInt(id || '0' ));
      
      if (foundNote) {
        setNote(foundNote);
      }
    } catch (error) {
      console.error('加载笔记失败:', error);
    } finally {
      setLoading(false);
    }
  }, [id]); // 依赖项：当 ID 变化时重新加载

  // 删除笔记
  const handleDelete = () => {
    if (window.confirm('确定要删除这篇笔记吗？')) {
      try {
        const notes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
        const updatedNotes = notes.filter(n => n.id !== parseInt(id || '0'));
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        
        // 删除成功后返回首页
        navigate('/', { 
          replace: true,  // 替换历史记录，防止用户返回到已删除的笔记
          state: { message: '笔记已删除' }
        });
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="note-detail-container" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>⏳ 加载中...</h2>
        </div>
      </div>
    );
  }

  // 笔记不存在
  if (!note) {
    return (
      <div className="note-detail-container" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>😕 笔记不存在</h2>
          <p>ID 为 {id} 的笔记未找到</p>
          <Link to="/" style={{ 
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 正常显示笔记详情
  return (
    <div className="note-detail-container" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      {/* 面包屑导航 */}
      <nav style={{ 
        marginBottom: '20px', 
        fontSize: '14px',
        color: '#666'
      }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          首页
        </Link>
        <span> / </span>
        <span>笔记详情</span>
      </nav>

      {/* 笔记内容 */}
      <article style={{
        background: 'var(--note-bg)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 标题 */}
        <h1 style={{ marginTop: 0, marginBottom: '10px' }}>
          {note.isStarred && <span style={{ color: '#ffc107' }}>⭐ </span>}
          {note.title}
        </h1>

        {/* 元信息 */}
        <div style={{ 
          fontSize: '14px', 
          color: '#666',
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <span>📅 创建: {note.createdAt}</span>
          {note.updatedAt && <span>✏️ 更新: {note.updatedAt}</span>}
          {note.tags && note.tags.length > 0 && (
            <span>
              🏷️ 标签: {note.tags.join(', ')}
            </span>
          )}
        </div>

        {/* 笔记内容 - 支持 Markdown 渲染 */}
        <div style={{ 
          lineHeight: '1.8',
          fontSize: '16px',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </article>

      {/* 操作按钮 */}
      <div style={{ 
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => navigate(`/edit/${id}`)}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✏️ 编辑笔记
        </button>

        <button 
          onClick={handleDelete}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🗑️ 删除笔记
        </button>

        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ⬅️ 返回
        </button>
      </div>
    </div>
  );
}

export default NoteDetailPage;
