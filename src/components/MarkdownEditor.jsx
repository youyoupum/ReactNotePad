import React, { useState, lazy, Suspense } from 'react';

// ========== 🚀 动态导入优化 ==========
// 使用 React.lazy 实现按需加载
// 只有当用户切换到预览模式时，才加载 react-markdown 库
// 这样可以减少首屏加载时间，提升性能
const ReactMarkdown = lazy(() => import('react-markdown'));

/**
 * Markdown 编辑器组件
 * @param {Object} props
 * @param {string} props.value - 当前内容值
 * @param {Function} props.onChange - 内容变化回调
 * @param {string} props.placeholder - 占位符文本
 */
function MarkdownEditor({ value, onChange, placeholder = '请输入笔记内容...' }) {
  // ========== 📝 预览模式状态管理 ==========
  // 'edit': 编辑模式（显示 textarea）
  // 'preview': 预览模式（显示渲染后的 Markdown）
  // 'split': 分屏模式（同时显示编辑和预览）
  const [viewMode, setViewMode] = useState('edit');

  // ========== 🎨 渲染工具栏 ==========
  const renderToolbar = () => (
    <div style={toolbarStyle}>
      <div style={toolbarTitleStyle}>✍️ Markdown 编辑器</div>
      <div style={buttonGroupStyle}>
        <button
          type="button"
          onClick={() => setViewMode('edit')}
          style={viewMode === 'edit' ? activeButtonStyle : buttonStyle}
          title="编辑模式"
        >
          📝 编辑
        </button>
        <button
          type="button"
          onClick={() => setViewMode('preview')}
          style={viewMode === 'preview' ? activeButtonStyle : buttonStyle}
          title="预览模式"
        >
          👁️ 预览
        </button>
        <button
          type="button"
          onClick={() => setViewMode('split')}
          style={viewMode === 'split' ? activeButtonStyle : buttonStyle}
          title="分屏模式"
        >
          ⚡ 分屏
        </button>
      </div>
      
      {/* 快速插入 Markdown 语法提示 */}
      <div style={markdownHelpStyle}>
        <small>
          💡 支持 Markdown 语法：
          <code style={helpCodeStyle}>**粗体**</code>
          <code style={helpCodeStyle}>*斜体*</code>
          <code style={helpCodeStyle}>`代码`</code>
          <code style={helpCodeStyle}>[链接](url)</code>
        </small>
      </div>
    </div>
  );

  // ========== 🖊️ 渲染编辑区域 ==========
  const renderEditor = () => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={textareaStyle}
    />
  );

  // ========== 👁️ 渲染预览区域 ==========
  const renderPreview = () => (
    <div style={previewStyle}>
      {/* 使用 Suspense 包裹懒加载组件 */}
      <Suspense fallback={<div style={loadingStyle}>⏳ 加载预览中...</div>}>
        {value ? (
          <ReactMarkdown
            // 自定义组件样式
            components={{
              // 标题样式
              h1: ({ node, ...props }) => <h1 style={h1Style} {...props} />,
              h2: ({ node, ...props }) => <h2 style={h2Style} {...props} />,
              h3: ({ node, ...props }) => <h3 style={h3Style} {...props} />,
              // 代码块样式
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code style={inlineCodeStyle} {...props} />
                ) : (
                  <code style={codeBlockStyle} {...props} />
                ),
              // 链接样式
              a: ({ node, ...props }) => (
                <a style={linkStyle} target="_blank" rel="noopener noreferrer" {...props} />
              ),
              // 列表样式
              ul: ({ node, ...props }) => <ul style={listStyle} {...props} />,
              ol: ({ node, ...props }) => <ol style={listStyle} {...props} />,
              // 段落样式
              p: ({ node, ...props }) => <p style={paragraphStyle} {...props} />,
            }}
          >
            {value}
          </ReactMarkdown>
        ) : (
          <div style={emptyPreviewStyle}>✨ 开始输入以查看预览效果</div>
        )}
      </Suspense>
    </div>
  );

  // ========== 🎯 根据模式渲染不同布局 ==========
  return (
    <div style={containerStyle}>
      {renderToolbar()}
      
      <div style={contentContainerStyle}>
        {/* 编辑模式：只显示编辑器 */}
        {viewMode === 'edit' && (
          <div style={fullWidthStyle}>
            {renderEditor()}
          </div>
        )}

        {/* 预览模式：只显示预览 */}
        {viewMode === 'preview' && (
          <div style={fullWidthStyle}>
            {renderPreview()}
          </div>
        )}

        {/* 分屏模式：同时显示编辑器和预览 */}
        {viewMode === 'split' && (
          <>
            <div style={halfWidthStyle}>
              {renderEditor()}
            </div>
            <div style={halfWidthStyle}>
              {renderPreview()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ========== 🎨 样式定义 ==========
const containerStyle = {
  width: '100%',
  border: '2px solid var(--input-border)',
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: 'var(--input-bg)',
};

const toolbarStyle = {
  padding: '15px',
  backgroundColor: 'var(--card-bg)',
  borderBottom: '2px solid var(--input-border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const toolbarTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: 'var(--tag-button-bg)',
  color: 'var(--text-primary)',
  border: '2px solid transparent',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'all 0.3s',
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'var(--button-primary)',
  borderColor: 'var(--text-primary)',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
};

const markdownHelpStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const helpCodeStyle = {
  backgroundColor: 'var(--code-bg)',
  color: 'var(--code-text)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.85em',
  fontFamily: "'Consolas', 'Monaco', monospace",
  marginLeft: '6px',
};

const contentContainerStyle = {
  display: 'flex',
  minHeight: '300px',
  maxHeight: '500px',
};

const fullWidthStyle = {
  width: '100%',
};

const halfWidthStyle = {
  width: '50%',
  borderRight: '1px solid var(--input-border)',
};

const textareaStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px',
  padding: '20px',
  fontSize: '1rem',
  lineHeight: '1.6',
  border: 'none',
  outline: 'none',
  resize: 'vertical',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--note-text)',
  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
  boxSizing: 'border-box',
};

const previewStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px',
  padding: '20px',
  overflow: 'auto',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--note-text)',
  lineHeight: '1.8',
  boxSizing: 'border-box',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  color: 'var(--text-secondary)',
  fontSize: '1rem',
};

const emptyPreviewStyle = {
  textAlign: 'center',
  padding: '40px',
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  fontStyle: 'italic',
};

// Markdown 渲染样式
const h1Style = {
  color: 'var(--text-primary)',
  borderBottom: '2px solid var(--input-border)',
  paddingBottom: '10px',
  marginTop: '20px',
  marginBottom: '15px',
  fontSize: '1.8rem',
};

const h2Style = {
  color: 'var(--text-primary)',
  marginTop: '18px',
  marginBottom: '12px',
  fontSize: '1.5rem',
};

const h3Style = {
  color: 'var(--text-primary)',
  marginTop: '16px',
  marginBottom: '10px',
  fontSize: '1.2rem',
};

const inlineCodeStyle = {
  backgroundColor: 'var(--code-bg)',
  color: 'var(--code-text)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.9em',
  fontFamily: "'Consolas', 'Monaco', monospace",
};

const codeBlockStyle = {
  display: 'block',
  backgroundColor: 'var(--code-bg)',
  color: 'var(--code-text)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '0.9em',
  fontFamily: "'Consolas', 'Monaco', monospace",
  overflow: 'auto',
  margin: '10px 0',
};

const linkStyle = {
  color: '#667eea',
  textDecoration: 'none',
  borderBottom: '1px solid #667eea',
  transition: 'all 0.3s',
};

const listStyle = {
  marginLeft: '20px',
  marginTop: '10px',
  color: 'var(--note-text)',
};

const paragraphStyle = {
  margin: '10px 0',
  color: 'var(--note-text)',
};

export default MarkdownEditor;

