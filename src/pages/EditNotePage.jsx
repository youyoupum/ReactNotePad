import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';

/**
 * 编辑笔记页组件
 * 
 * 功能：
 * 1. 通过 URL 参数获取要编辑的笔记 ID
 * 2. 加载现有笔记数据到表单
 * 3. 提供编辑器让用户修改笔记
 * 4. 保存后跳转回详情页
 * 
 * 路由参数：
 * - :id - 要编辑的笔记 ID
 */
function EditNotePage() {
  // 获取路由参数
  const { id } = useParams();
  const navigate = useNavigate();

  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载笔记数据
  useEffect(() => {
    try {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const note = notes.find(n => n.id === parseInt(id));

      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags ? note.tags.join(', ') : '');
      } else {
        setError('笔记不存在');
      }
    } catch (err) {
      console.error('加载笔记失败:', err);
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();

    // 表单验证
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    try {
      // 读取所有笔记
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      
      // 找到要更新的笔记
      const noteIndex = notes.findIndex(n => n.id === parseInt(id));
      
      if (noteIndex === -1) {
        alert('笔记不存在');
        return;
      }

      // 更新笔记
      notes[noteIndex] = {
        ...notes[noteIndex],
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
        updatedAt: new Date().toLocaleString('zh-CN')
      };

      // 保存到 localStorage
      localStorage.setItem('notes', JSON.stringify(notes));

      // 🎯 跳转到笔记详情页
      navigate(`/notes/${id}`, {
        state: { message: '笔记更新成功！' }
      });
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⏳ 加载中...</h2>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>😕 {error}</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          返回首页
        </button>
      </div>
    );
  }

  // 编辑表单
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <h1 style={{ marginBottom: '20px' }}>✏️ 编辑笔记</h1>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--note-bg)',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 标题输入 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            📝 标题：
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入笔记标题"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 标签输入 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            🏷️ 标签（用逗号分隔）：
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如：工作, 学习, React"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Markdown 编辑器 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            📄 内容（支持 Markdown）：
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>

        {/* 操作按钮 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button 
            type="submit"
            style={{
              padding: '12px 30px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            💾 保存修改
          </button>

          <button 
            type="button"
            onClick={() => navigate(`/notes/${id}`)}
            style={{
              padding: '12px 30px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ❌ 取消
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNotePage;
