/**
 * 笔记状态管理 Store
 * 使用 Zustand 管理所有笔记相关的状态和操作
 */

import { create } from 'zustand';
import type { Note, NotesStore, NewNoteData, NoteUpdate } from '../types';

const useNotesStore = create<NotesStore>((set, get) => ({
  // ==================== 状态定义 ====================
  
  // 所有笔记数据
  notes: [],
  
  // 搜索关键词
  searchTerm: '',
  
  // 选中的标签
  selectedTag: 'all',
  
  // 排序方式
  sortBy: 'newest',
  
  // 正在编辑的笔记
  editingNote: null,
  
  // 拖拽相关状态
  draggedNoteId: null,
  dragOverIndex: null,
  
  // ==================== 笔记 CRUD 操作 ====================
  
  /**
   * 添加新笔记
   * @param {Object} noteData - 笔记数据 { title, content, tags }
   */
  addNote: (noteData) => set((state) => {
    const newNote = {
      id: Date.now(),
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags || [],
      starred: false,
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    };
    
    const newNotes = [...state.notes, newNote];
    
    // 保存到 localStorage
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
    return { 
      notes: newNotes, 
      editingNote: null  // 添加后清空编辑状态
    };
  }),
  
  /**
   * 删除笔记
   * @param {number} id - 笔记 ID
   */
  deleteNote: (id) => set((state) => {
    const newNotes = state.notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    return { notes: newNotes };
  }),
  
  /**
   * 更新笔记
   * @param {number} id - 笔记 ID
   * @param {Object} updates - 更新的数据
   */
  updateNote: (id, updates) => set((state) => {
    const newNotes = state.notes.map(note =>
      note.id === id 
        ? { 
            ...note, 
            ...updates, 
            updatedAt: new Date().toLocaleString('zh-CN')
          }
        : note
    );
    
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
    return { 
      notes: newNotes, 
      editingNote: null  // 更新后清空编辑状态
    };
  }),
  
  /**
   * 切换星标状态
   * @param {number} id - 笔记 ID
   */
  toggleStar: (id) => set((state) => {
    const newNotes = state.notes.map(note =>
      note.id === id ? { ...note, starred: !note.starred } : note
    );
    
    localStorage.setItem('notes', JSON.stringify(newNotes));
    return { notes: newNotes };
  }),
  
  // ==================== 编辑相关 ====================
  
  /**
   * 开始编辑笔记
   * @param {Object} note - 要编辑的笔记对象
   */
  startEdit: (note) => set({ editingNote: note }),
  
  /**
   * 取消编辑
   */
  cancelEdit: () => set({ editingNote: null }),
  
  // ==================== 搜索和筛选 ====================
  
  /**
   * 设置搜索关键词
   * @param {string} term - 搜索关键词
   */
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  /**
   * 设置选中的标签
   * @param {string} tag - 标签名称
   */
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  
  /**
   * 设置排序方式
   * @param {string} sortBy - 排序方式 ('newest' | 'oldest')
   */
  setSortBy: (sortBy) => set({ sortBy }),
  
  // ==================== 拖拽相关 ====================
  
  /**
   * 设置正在拖拽的笔记 ID
   */
  setDraggedNoteId: (id) => set({ draggedNoteId: id }),
  
  /**
   * 设置拖拽悬停的索引
   */
  setDragOverIndex: (index) => set({ dragOverIndex: index }),
  
  /**
   * 处理拖拽放置
   */
  handleDrop: (dropIndex) => set((state) => {
    const { draggedNoteId, notes } = state;
    
    if (draggedNoteId === null) return state;
    
    const draggedIndex = notes.findIndex(note => note.id === draggedNoteId);
    if (draggedIndex === -1) return state;
    
    // 重新排序
    const newNotes = [...notes];
    const [draggedNote] = newNotes.splice(draggedIndex, 1);
    newNotes.splice(dropIndex, 0, draggedNote);
    
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
    return {
      notes: newNotes,
      draggedNoteId: null,
      dragOverIndex: null
    };
  }),
  
  // ==================== Selectors（选择器/计算属性）====================
  
  /**
   * 获取筛选后的笔记
   * 根据搜索关键词、标签、排序方式筛选笔记
   * @returns {Array} 筛选后的笔记数组
   */
  getFilteredNotes: () => {
    const state = get();
    let filtered = [...state.notes];
    
    // 1. 搜索过滤
    if (state.searchTerm) {
      const lowerSearchTerm = state.searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(lowerSearchTerm) ||
        note.content.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // 2. 标签过滤
    if (state.selectedTag !== 'all') {
      filtered = filtered.filter(note =>
        note.tags?.includes(state.selectedTag)
      );
    }
    
    // 3. 排序
    filtered.sort((a, b) => {
      if (state.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (state.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
    
    return filtered;
  },
  
  /**
   * 获取所有标签（去重）
   * @returns {Array} 所有标签数组
   */
  getAllTags: () => {
    const state = get();
    const tags = new Set<string>();
    state.notes.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  },
  
  /**
   * 获取星标笔记
   * @returns {Array} 星标笔记数组
   */
  getStarredNotes: () => {
    const state = get();
    return state.notes.filter(note => note.starred);
  },
  
  /**
   * 根据 ID 获取笔记
   * @param {number} id - 笔记 ID
   * @returns {Object|null} 笔记对象或 null
   */
  getNoteById: (id) => {
    const state = get();
    return state.notes.find(note => note.id === id) || null;
  },
  
  // ==================== 批量操作 ====================
  
  /**
   * 删除所有笔记
   */
  deleteAllNotes: () => set(() => {
    localStorage.removeItem('notes');
    return {
      notes: [],
      editingNote: null,
      searchTerm: '',
      selectedTag: 'all'
    };
  }),
  
  /**
   * 生成测试笔记
   * @param {number} count - 生成数量
   */
  generateTestNotes: (count = 10) => set((state) => {
    const testNotes = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      title: `测试笔记 ${i + 1}`,
      content: `这是第 ${i + 1} 条测试笔记的内容`,
      tags: ['测试', `标签${i % 3 + 1}`],
      starred: i % 3 === 0,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN')
    }));
    
    const newNotes = [...state.notes, ...testNotes];
    localStorage.setItem('notes', JSON.stringify(newNotes));
    
    return { notes: newNotes };
  }),
  
  // ==================== 初始化 ====================
  
  /**
   * 从 localStorage 初始化笔记数据
   */
  initialize: () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const notes = JSON.parse(savedNotes);
        set({ notes });
        console.log('✅ 笔记数据加载成功，共', notes.length, '条笔记');
      } catch (error) {
        console.error('❌ 加载笔记数据失败:', error);
        set({ notes: [] });
      }
    } else {
      console.log('ℹ️ 没有保存的笔记数据');
    }
  },
  
  /**
   * 重置所有状态
   */
  reset: () => set({
    notes: [],
    searchTerm: '',
    selectedTag: 'all',
    sortBy: 'newest',
    editingNote: null,
    draggedNoteId: null,
    dragOverIndex: null
  })
}));

export default useNotesStore;
