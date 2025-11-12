import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import ThemeToggle from '../components/ThemeToggle';

// ========== 📦 导入 Zustand Store ==========
import { useNotesStore } from '../store';

/**
 * 首页组件 - 笔记列表页（使用 Zustand 状态管理）
 * 
 * 功能：
 * 1. 显示所有笔记列表
 * 2. 提供创建笔记的表单
 * 3. 点击笔记可以跳转到详情页
 * 4. 点击编辑可以跳转到编辑页
 * 
 * 优势：
 * - 不需要从 props 接收状态和方法
 * - 直接从 store 获取，代码更简洁
 * - 性能更好（只订阅需要的数据）
 */
function HomePage() {
  const navigate = useNavigate();
  
  // ========== 📦 从 Zustand Store 获取状态和方法 ==========
  // 使用 selector 精确订阅，只有相关数据变化时才重新渲染
  
  // 获取笔记相关状态
  const editingNote = useNotesStore(state => state.editingNote);
  const draggedNoteId = useNotesStore(state => state.draggedNoteId);
  const dragOverIndex = useNotesStore(state => state.dragOverIndex);
  
  // 获取计算方法（Selectors）
  const getFilteredNotes = useNotesStore(state => state.getFilteredNotes);
  const getAllTags = useNotesStore(state => state.getAllTags);
  
  // 获取笔记操作方法
  const addNote = useNotesStore(state => state.addNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const startEdit = useNotesStore(state => state.startEdit);
  const cancelEdit = useNotesStore(state => state.cancelEdit);
  const toggleStar = useNotesStore(state => state.toggleStar);
  
  // 获取拖拽相关方法
  const setDraggedNoteId = useNotesStore(state => state.setDraggedNoteId);
  const setDragOverIndex = useNotesStore(state => state.setDragOverIndex);
  const handleDrop = useNotesStore(state => state.handleDrop);
  
  // 计算筛选后的笔记
  const displayedNotes = getFilteredNotes();
  const uniqueTags = getAllTags();

  // 查看笔记详情 - 点击标题时跳转
  const handleViewNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  // 编辑笔记 - 点击编辑按钮时跳转（路由方式）
  const handleEditNote = (noteId) => {
    navigate(`/edit/${noteId}`);
  };
  
  // 拖拽开始
  const handleDragStart = (noteId) => {
    setDraggedNoteId(noteId);
  };
  
  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedNoteId(null);
    setDragOverIndex(null);
  };
  
  // 拖拽悬停
  const handleDragOver = (index) => {
    if (draggedNoteId !== null) {
      setDragOverIndex(index);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px'
        }}>
          <h1>📝 React 笔记本</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="App-main">
        {/* 笔记表单组件 */}
        <NoteForm 
          onSubmit={(noteData) => addNote(noteData)}
          editingNote={editingNote}
          onCancel={cancelEdit}
          availableTags={uniqueTags}
        />

        {/* 笔记列表组件 */}
        <NoteList 
          notes={displayedNotes}         // ✅ 传递 notes 属性
          onDelete={deleteNote}          // ✅ 删除笔记
          onEdit={startEdit}             // ✅ 编辑笔记（打开表单）
          onToggleStar={toggleStar}      // ✅ 切换星标
          onDragStart={handleDragStart}  // ✅ 拖拽开始
          onDragEnd={handleDragEnd}      // ✅ 拖拽结束
          onDragOver={handleDragOver}    // ✅ 拖拽悬停
          onDrop={handleDrop}            // ✅ 拖拽放置
          draggedNoteId={draggedNoteId}  // ✅ 被拖拽的笔记 ID
          dragOverIndex={dragOverIndex}  // ✅ 拖拽悬停索引
          onViewNote={handleViewNote}    // ✅ 查看详情（路由跳转）
          onEditNote={handleEditNote}    // ✅ 编辑笔记（路由跳转）
        />
      </main>
    </div>
  );
}

export default HomePage;
