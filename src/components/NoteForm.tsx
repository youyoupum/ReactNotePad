import React, { useEffect, useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import type { NoteFormProps } from '../types';

/**
 * 笔记表单组件 - TypeScript 版本
 * 负责收集用户输入的标题和内容，支持标签和 Markdown 编辑
 */
interface NoteFormPropsExtended extends NoteFormProps {
  onSubmit: (title: string, content: string, tags: string[], isMarkdown: boolean) => void;
  availableTags?: string[];
}

const NoteForm: React.FC<NoteFormPropsExtended> = ({ onSubmit, editingNote, onCancel, availableTags = [] }) => {
  // 状态管理: 标题输入框的值
  const [title, setTitle] = useState<string>('');

  // 状态管理: 内容输入框的值
  const [content, setContent] = useState<string>('');

  // 标签管理状态
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  // ========== 🎛️ 新增：编辑器模式切换 ==========
  // 'plain': 纯文本模式（普通 textarea）
  // 'markdown': Markdown 模式（Markdown 编辑器）
  const [editorMode, setEditorMode] = useState<'plain' | 'markdown'>('plain');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setTags(editingNote.tags || []); // 加载标签
      // 👈 新增：如果笔记是 Markdown 格式，自动切换到 Markdown 模式
      if (editingNote.isMarkdown) {
        setEditorMode('markdown');
      } else {
        setEditorMode('plain');
      }
    } else {
      // 新增模式:清空表单
      setTitle('');
      setContent('');
      setTags([]); // 清空标签
      setEditorMode('plain'); // 👈 新增：重置为纯文本模式
    }
  }, [editingNote]);

  /**
   * 添加标签
   */
  const addTag = (): void => {
    const trimmedTag = tagInput.trim();

    // 验证：非空且不重复
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput(''); // 清空输入框
    }
  };

  /**
   * 删除标签
   */
  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * 处理按键事件：按 Enter 添加标签
   */
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 阻止表单提交
      addTag();
    }
  };

  /**
   * 快速添加已有标签
   */
  const quickAddTag = (tag: string): void => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    // 阻止表单默认提交行为(阻止页面刷新)
    e.preventDefault();

    // 表单验证: 去除首尾空格后检查是否为空
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空!');
      return; // 如果验证失败,直接返回,不执行后面的代码
    }

    // 调用父组件传入的 onSubmit 函数,传递标题、内容、标签和编辑器模式
    onSubmit(title, content, tags, editorMode === 'markdown');
    setTitle('');
    setContent('');
    setTags([]); // 清空标签
    setEditorMode('plain'); // 重置模式
  };

  const handleCancel = (): void => {
    onCancel();
    setTitle('');
    setContent('');
    setTags([]);
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={formTitleStyle}>
        {editingNote ? '编辑笔记' : '添加笔记'}
      </h2>

      {/* 表单元素,onSubmit 绑定提交事件 */}
      <form onSubmit={handleSubmit}>

        {/* 标题输入框 */}
        <div style={formGroupStyle}>
          <label htmlFor="title" style={labelStyle}>
            标题
          </label>
          <input
            type="text"
            id="title"
            placeholder="请输入笔记标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            style={inputStyle}
          />
          {/* 字数统计 */}
          <small style={charCountStyle}>{title.length}/50</small>
        </div>

        {/* ========== ✨ 新增：编辑器模式切换 ========== */}
        <div style={editorModeContainerStyle}>
          <label style={labelStyle}>✍️ 编辑模式</label>
          <div style={editorModeButtonGroupStyle}>
            <button
              type="button"
              onClick={() => setEditorMode('plain')}
              style={
                editorMode === 'plain'
                  ? activeEditorModeButtonStyle
                  : editorModeButtonStyle
              }
              title="纯文本模式"
            >
              📄 纯文本
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('markdown')}
              style={
                editorMode === 'markdown'
                  ? activeEditorModeButtonStyle
                  : editorModeButtonStyle
              }
              title="Markdown 模式"
            >
              🎨 Markdown
            </button>
          </div>
        </div>

        {/* ========== 📝 内容输入区域（根据模式渲染） ========== */}
        <div style={formGroupStyle}>
          <label htmlFor="content" style={labelStyle}>
            内容
          </label>

          {/* 纯文本模式 */}
          {editorMode === 'plain' && (
            <>
              <textarea
                id="content"
                placeholder="请输入笔记内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={8}
                style={textareaStyle}
              />
              {/* 字数统计 */}
              <small style={charCountStyle}>{content.length}/500</small>
            </>
          )}

          {/* Markdown 模式 */}
          {editorMode === 'markdown' && (
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="请输入笔记内容（支持 Markdown 语法）..."
            />
          )}
        </div>

        {/* 👇 新增：标签输入区域 */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>🏷️ 标签</label>

          {/* 标签输入框和按钮 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="添加标签（按 Enter）"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              maxLength={15}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={addTag}
              style={addTagButtonStyle}
            >
              ➕ 添加
            </button>
          </div>

          {/* 👇 新增：快捷标签选择 */}
          {availableTags.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <small style={{ color: 'var(--note-meta)', fontSize: '0.85rem' }}>
                常用标签：
              </small>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {availableTags
                  .filter(tag => !tags.includes(tag)) // 只显示未添加的标签
                  .map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => quickAddTag(tag)}
                      style={quickTagButtonStyle}
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 已添加的标签列表 */}
          {tags.length > 0 && (
            <div style={tagsDisplayStyle}>
              {tags.map(tag => (
                <span key={tag} style={tagChipStyle}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={tagRemoveButtonStyle}
                    title="删除标签"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 按钮组 */}
        <div style={buttonGroupStyle}>
          <button type="submit" style={submitButtonStyle}>
            {editingNote ? '💾 保存修改' : '➕ 添加笔记'}
          </button>

          {/* 条件渲染: 只在编辑模式显示取消按钮 */}
          {editingNote && (
            <button
              type="button"
              onClick={handleCancel}
              style={cancelButtonStyle}
            >
              ❌ 取消编辑
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ========== 组件样式 ==========

const formContainerStyle = {
  backgroundColor: 'var(--card-bg)',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  marginBottom: '30px',
  maxWidth: '600px',
  margin: '0 auto 30px'
};

const formTitleStyle = {
  color: 'var(--note-text)',
  marginBottom: '20px',
  fontSize: '1.5rem'
};

const formGroupStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: 'var(--note-meta)',
  fontSize: '0.95rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '2px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--note-text)'
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, // 继承 inputStyle 的所有样式
  resize: 'vertical', // 只允许垂直调整大小
  minHeight: '120px'
};

const charCountStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '5px',
  color: 'var(--note-meta)',
  fontSize: '0.85rem',
  textAlign: 'right'
};

const submitButtonStyle = {
  flex: 1,
  padding: '14px',
  backgroundColor: 'var(--button-primary)',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px'
};

const cancelButtonStyle = {
  flex: 1,
  padding: '14px',
  backgroundColor: 'var(--sort-container-bg)',
  color: 'var(--note-text)',
  border: '2px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s'
};

const addTagButtonStyle = {
  padding: '12px 20px',
  backgroundColor: 'var(--button-success)',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const tagsDisplayStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px'
};

const tagChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  backgroundColor: 'var(--button-primary)',
  color: 'var(--text-primary)',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '500'
};

const tagRemoveButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  cursor: 'pointer',
  padding: '0 2px',
  lineHeight: 1
};

// 新增：快捷标签按钮样式
const quickTagButtonStyle = {
  padding: '4px 10px',
  backgroundColor: 'var(--tag-button-bg)',
  color: 'var(--note-text)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

// ========== 新增：编辑器模式切换样式 ==========
const editorModeContainerStyle = {
  marginBottom: '15px',
};

const editorModeButtonGroupStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '8px',
};

const editorModeButtonStyle = {
  padding: '10px 20px',
  backgroundColor: 'var(--tag-button-bg)',
  color: 'var(--note-text)',
  border: '2px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s',
};

const activeEditorModeButtonStyle = {
  ...editorModeButtonStyle,
  backgroundColor: 'var(--button-primary)',
  color: 'var(--text-primary)',
  borderColor: 'var(--text-primary)',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
};

// 🚀 性能优化：使用 React.memo 避免不必要的重新渲染
// 当 editingNote、onSubmit、onCancel、availableTags 没有变化时，表单不会重新渲染
export default React.memo(NoteForm);