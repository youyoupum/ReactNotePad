import React, { lazy, Suspense } from 'react';  // 👈 新增：导入 lazy 和 Suspense
import type { NoteItemProps } from '../types';  // ← 新增：导入 Props 类型


// ========== 🚀 动态导入 react-markdown ==========
// 使用 lazy 按需加载，只有当有 Markdown 笔记时才加载
const ReactMarkdown = lazy(() => import('react-markdown'));

/**
 * 单个笔记项组件
 * 负责显示一条笔记的内容和操作按钮
 * @param {object} note - 笔记对象,包含 id, title, content, createdAt, isStarred, isMarkdown
 * @param {function} onDelete - 删除笔记的回调函数
 * @param {function} onEdit - 编辑笔记的回调函数
 * @param {function} onToggleStar - 切换星标的回调函数
 * @param {number} index - 笔记在列表中的索引（用于拖拽排序）
 * @param {function} onDragStart - 拖拽开始时的回调函数
 * @param {function} onDragEnd - 拖拽结束时的回调函数
 * @param {function} onDragOver - 拖拽悬停时的回调函数
 * @param {function} onDrop - 拖拽放置时的回调函数
 * @param {boolean} isDragging - 是否正在被拖拽
 * @param {boolean} isDragOver - 是否有元素悬停在此
 * @param {function} onViewNote - 查看笔记详情
 * @param {function} onEditNote - 编辑笔记（路由跳转）
 */
const NoteItem: React.FC<NoteItemProps> = ({
    note,
    onDelete,
    onEdit,
    onToggleStar,
    // 拖拽相关的 props
    index,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    isDragging,
    isDragOver,
    // 路由导航相关的 props
    onViewNote,  // 查看笔记详情
    onEditNote   // 编辑笔记（路由跳转）
}) => {
    /**
     * 处理删除按钮点击
     * 调用父组件传入的 onDelete 函数,并传递笔记 ID
     */
    const handleDelete = (): void => {
        onDelete(note.id);
    };

    /**
     * 处理编辑按钮点击
     * 如果提供了 onEditNote（路由跳转），使用它；否则使用旧的 onEdit
     */
    const handleEdit = (): void => {
        if (onEditNote) {
            onEditNote(note.id);  // 路由跳转到编辑页
        } else {
            onEdit(note);  // 旧的内联编辑方式
        }
    };

    /**
     * 🎯 处理标题点击 - 跳转到笔记详情页
     */
    const handleTitleClick = (): void => {
        if (onViewNote) {
            onViewNote(note.id);
        }
    };

    /**
     * ⭐ 处理星标按钮点击
     * 调用父组件传入的 onToggleStar 函数,并传递笔记 ID
     */
    const handleToggleStar = (): void => {
        onToggleStar(note.id);
    };

    /**
     * 处理拖拽开始
     * 记录被拖动笔记的 ID，设置拖拽效果
     */
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        onDragStart(note.id);  // 👈 传递 note.id 而不是 index
        // 设置拖拽效果为"移动"
        e.dataTransfer.effectAllowed = 'move';
        // 添加拖拽数据（可选，用于跨组件拖拽）
        e.dataTransfer.setData('text/plain', note.id.toString());
    };

    /**
     * 处理拖拽结束
     * 清空拖拽状态
     */
    const handleDragEnd = (): void => {
        onDragEnd();
    };

    /**
     * 处理拖拽悬停
     * 阻止默认行为，允许放置
     */
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        // 设置放置效果为"移动"
        e.dataTransfer.dropEffect = 'move';
        onDragOver(index);
    };

    /**
     * 处理拖拽放置
     * 执行排序逻辑
     */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        onDrop(index);
    };

    // ========== 🎨 渲染笔记内容（支持 Markdown） ==========
    const renderContent = () => {
        // 如果笔记是 Markdown 格式
        if (note.isMarkdown) {
            return (
                <div style={markdownContentStyle}>
                    <Suspense fallback={<div style={loadingStyle}>⏳ 加载中...</div>}>
                        <ReactMarkdown
                            components={{
                                // 自定义 Markdown 组件样式
                                h1: ({ node, ...props }) => <h1 style={mdH1Style} {...props} />,
                                h2: ({ node, ...props }) => <h2 style={mdH2Style} {...props} />,
                                h3: ({ node, ...props }) => <h3 style={mdH3Style} {...props} />,
                                code: ({ node, className, ...props }) => {
                                    return !className ? (
                                        <code style={mdInlineCodeStyle} {...props} />
                                    ) : (
                                        <code style={mdCodeBlockStyle} {...props} />
                                    )
                                },
                                a: ({ node, ...props }) => (
                                    <a style={mdLinkStyle} target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                                p: ({ node, ...props }) => <p style={mdParagraphStyle} {...props} />,
                                ul: ({ node, ...props }) => <ul style={mdListStyle} {...props} />,
                                ol: ({ node, ...props }) => <ol style={mdListStyle} {...props} />,
                            }}
                        >
                            {note.content}
                        </ReactMarkdown>
                    </Suspense>
                    {/* Markdown 标识徽章 */}
                    <div style={markdownBadgeStyle}>🎨 Markdown</div>
                </div>
            );
        }

        // 普通文本格式
        return <p style={noteContentStyle}>{note.content}</p>;
    };

    return (
        <div
            style={{
                ...noteItemStyle,
                // 🎯 拖拽视觉反馈
                opacity: isDragging ? 0.4 : 1,  // 拖拽时半透明
                transform: isDragOver ? 'scale(1.02)' : 'scale(1)',  // 悬停时稍微放大
                borderLeftColor: isDragOver ? '#667eea' : 'var(--button-primary)',  // 悬停时边框高亮
                borderLeftWidth: isDragOver ? '6px' : '4px',  // 悬停时边框加粗
                cursor: 'move',  // 鼠标指针显示为移动图标
                transition: 'all 0.2s ease',  // 平滑过渡
                boxShadow: isDragOver
                    ? '0 8px 20px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'  // 悬停时阴影加深
            }}
            // 🎯 HTML5 拖拽属性和事件
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* 标题和星标按钮的容器 */}
            <div style={titleContainerStyle}>
                {/* 🎯 笔记标题 - 可点击跳转到详情页 */}
                <h3
                    style={{
                        ...noteTitleStyle,
                        cursor: onViewNote ? 'pointer' : 'default',
                        transition: 'color 0.2s'
                    }}
                    onClick={handleTitleClick}
                    onMouseEnter={(e) => onViewNote && (e.currentTarget.style.color = '#667eea')}
                    onMouseLeave={(e) => onViewNote && (e.currentTarget.style.color = 'var(--text-primary)')}
                    title={onViewNote ? '点击查看详情' : ''}
                >
                    {note.title}
                </h3>

                {/* ⭐ 星标按钮 - 条件渲染不同的图标 */}
                <button
                    onClick={handleToggleStar}
                    style={starButtonStyle}
                    title={note.isStarred ? "取消收藏" : "添加收藏"}
                >
                    {/* 根据 isStarred 状态显示不同的星标图标 */}
                    {note.isStarred ? '⭐' : '☆'}
                </button>
            </div>

            {/* 👇 新增：显示标签 */}
            {note.tags && note.tags.length > 0 && (
                <div style={noteTagsContainerStyle}>
                    {note.tags.map(tag => (
                        <span key={tag} style={noteTagStyle}>
                            🏷️ {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* 笔记内容（支持 Markdown） */}
            {renderContent()}

            <div style={noteMetaStyle}>
                <small style={noteTimeStyle}>
                    🕒 创建: {note.createdAt}
                    {/* 如果有更新时间,显示更新时间 */}
                    {note.updatedAt && (
                        <span style={{ marginLeft: '10px' }}>
                            | 更新: {note.updatedAt}
                        </span>
                    )}
                </small>
            </div>

            {/* 操作按钮区域 */}
            <div style={noteActionsStyle}>
                <button
                    onClick={handleEdit}
                    style={editButtonStyle}
                    title="编辑笔记"
                >
                    ✏️ 编辑
                </button>
                <button
                    onClick={handleDelete}
                    style={deleteButtonStyle}
                    title="删除笔记"
                >
                    🗑️ 删除
                </button>
            </div>
        </div>
    );
}

// ========== 组件样式 ==========

// 标题和星标按钮的容器样式
const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '12px'
};

// 星标按钮样式
const starButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: 1,
    transition: 'transform 0.2s',
    flexShrink: 0  // 防止按钮被压缩
};

const editButtonStyle = {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: 'var(--button-success)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const noteItemStyle = {
    backgroundColor: 'var(--card-bg)',
    padding: '20px',
    borderRadius: '10px',
    borderLeft: '4px solid var(--button-primary)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'default'
};

const noteTitleStyle = {
    color: 'var(--note-text)',
    margin: 0,  // 移除 margin，因为容器已经有 marginBottom
    fontSize: '1.2rem',
    fontWeight: '600',
    wordBreak: 'break-word' as const,  // 长单词自动换行
    flex: 1  // 让标题占据剩余空间
};

const noteContentStyle = {
    color: 'var(--note-meta)',
    lineHeight: '1.6',
    marginBottom: '15px',
    wordBreak: 'break-word' as const,
    whiteSpace: 'pre-wrap'    // 保留换行符
};

const noteMetaStyle = {
    paddingTop: '10px',
    borderTop: '1px solid var(--card-border)',
    marginBottom: '12px'
};

const noteTimeStyle = {
    color: 'var(--note-meta)',
    fontSize: '0.85rem'
};

const noteActionsStyle = {
    display: 'flex',
    gap: '8px'
};

const deleteButtonStyle = {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: 'var(--button-danger)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const noteTagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '12px'
};

const noteTagStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: 'var(--tag-button-bg)',
    color: 'var(--button-primary)',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
};

// ========== 新增：Markdown 相关样式 ==========

const markdownContentStyle = {
    position: 'relative' as const,
    marginBottom: '15px',
};

const loadingStyle = {
    color: 'var(--note-meta)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '10px 0',
};

const markdownBadgeStyle = {
    display: 'inline-block',
    marginTop: '10px',
    padding: '4px 10px',
    backgroundColor: 'var(--button-primary)',
    color: 'var(--text-primary)',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
};

// Markdown 渲染样式
const mdH1Style = {
    color: 'var(--note-text)',
    fontSize: '1.5rem',
    marginTop: '15px',
    marginBottom: '10px',
    borderBottom: '2px solid var(--input-border)',
    paddingBottom: '5px',
};

const mdH2Style = {
    color: 'var(--note-text)',
    fontSize: '1.3rem',
    marginTop: '12px',
    marginBottom: '8px',
};

const mdH3Style = {
    color: 'var(--note-text)',
    fontSize: '1.1rem',
    marginTop: '10px',
    marginBottom: '6px',
};

const mdInlineCodeStyle = {
    backgroundColor: 'var(--code-bg)',
    color: 'var(--code-text)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.9em',
    fontFamily: "'Consolas', 'Monaco', monospace",
};

const mdCodeBlockStyle = {
    display: 'block',
    backgroundColor: 'var(--code-bg)',
    color: 'var(--code-text)',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '0.85em',
    fontFamily: "'Consolas', 'Monaco', monospace",
    overflow: 'auto',
    margin: '8px 0',
};

const mdLinkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    borderBottom: '1px solid #667eea',
};

const mdParagraphStyle = {
    color: 'var(--note-meta)',
    lineHeight: '1.6',
    margin: '8px 0',
};

const mdListStyle = {
    color: 'var(--note-meta)',
    marginLeft: '20px',
    lineHeight: '1.6',
};

// 🚀 性能优化：使用 React.memo 避免不必要的重新渲染
// 当 props 没有变化时，组件会跳过渲染，直接复用上次的渲染结果
export default React.memo(NoteItem);