import React from 'react';
import NoteItem from './NoteItem';
import type { NoteListProps } from '../types';

/**
 * 笔记列表组件 - TypeScript 版本
 * 负责显示所有笔记，或空状态提示
 */
const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  onDelete, 
  onEdit, 
  onToggleStar,
  // 拖拽相关的 props
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  draggedNoteId,
  dragOverIndex,
  // 路由导航相关的 props
  onViewNote,  // 查看笔记详情的回调
  onEditNote   // 编辑笔记的回调（路由跳转）
}) => {
  return (
    <div style={listContainerStyle}>
      <h2 style={listTitleStyle}> 我的笔记</h2>
      
      {/* 条件渲染: 根据是否有笔记显示不同内容 */}
      {notes.length === 0 ? (
        // 空状态: 没有笔记时显示
        <div style={emptyStateStyle}>
          <p style={emptyIconStyle}>📭</p>
          <p style={emptyTextStyle}>还没有笔记</p>
          <p style={emptySubTextStyle}>快去上面创建你的第一条笔记吧!</p>
        </div>
      ) : (
        // 有笔记: 使用网格布局显示所有笔记
        <div style={notesGridStyle}>
          {notes.map((note, index) => (
            // 列表渲染: 为每条笔记创建一个 NoteItem 组件
            // key 是必须的,帮助 React 识别哪些元素变化了
            // index 用于拖拽排序
            <NoteItem
              key={note.id}
              note={note}
              index={index}  // 🎯 传递索引（用于视觉反馈）
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleStar={onToggleStar}
              // 🎯 传递拖拽相关的回调和状态
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isDragging={draggedNoteId === note.id}  // 判断当前笔记是否正在被拖拽（通过 ID 比较）
              isDragOver={dragOverIndex === index}  // 判断是否有笔记悬停在此
              // 🎯 传递路由导航相关的回调
              onViewNote={onViewNote}
              onEditNote={onEditNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ========== 组件样式 ==========

const listContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
};

const listTitleStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  fontSize: '1.8rem',
  marginBottom: '20px',
  textAlign: 'center'
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: 'var(--tag-button-bg)',
  borderRadius: '15px',
  backdropFilter: 'blur(10px)'
};

const emptyIconStyle = {
  fontSize: '4rem',
  marginBottom: '15px'
};

const emptyTextStyle = {
  color: 'var(--text-primary)',
  fontSize: '1.3rem',
  marginBottom: '8px',
  fontWeight: '500'
};

const emptySubTextStyle = {
  color: 'var(--text-secondary)',
  fontSize: '1rem'
};

const notesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px'
};

// 🚀 性能优化：使用 React.memo 避免不必要的重新渲染
// 当 notes 数组和回调函数引用没有变化时，列表组件会跳过渲染
export default React.memo(NoteList);