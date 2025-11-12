
/**
 * 笔记对象的类型定义
 * interface 用于定义对象的"形状"
 */
export interface Note {
    id: number;
    title: string;
    content: string;
    tags: string[];
    starred: boolean;
    isStarred?: boolean;
    isMarkdown?: boolean;
    createdAt: string;
    updatedAt: string; 
}

/**
 * 新建笔记的数据类型
 * 使用 Omit 工具类型：排除不需要的属性
 */
export type NewNoteData = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'starred'>;

/**
 * 笔记更新的数据类型
 * 使用 Partial 工具类型：所有属性变为可选
 */
export type NoteUpdate = Partial<Omit<Note, 'id' | 'createdAt'>>;

/**
 * 排序方式的类型
 * 使用联合类型：只能是这几个值之一
 */
export type SortBy = 'newest' | 'oldest' | 'title' | 'updated';

/**
 * 筛选标签类型
 */
export type FilterTag = 'all' | string;

// ==================== Store 类型 ====================

/**
 * 笔记 Store 的状态部分
 */
export interface NotesState {
    notes: Note[];
    searchTerm: string;
    selectedTag: FilterTag;
    sortBy: SortBy;
    editingNote: Note | null;
    draggedNoteId: number | null;
    dragOverIndex: number | null;
  }
  
  /**
   * 笔记 Store 的操作部分（方法）
   */
  export interface NotesActions {
    // CRUD 操作
    addNote: (noteData: NewNoteData) => void;
    deleteNote: (id: number) => void;
    updateNote: (id: number, updates: NoteUpdate) => void;
    toggleStar: (id: number) => void;
    
    // 编辑相关
    startEdit: (note: Note) => void;
    cancelEdit: () => void;
    
    // 搜索和筛选
    setSearchTerm: (term: string) => void;
    setSelectedTag: (tag: FilterTag) => void;
    setSortBy: (sortBy: SortBy) => void;
    
    // 拖拽相关
    setDraggedNoteId: (id: number | null) => void;
    setDragOverIndex: (index: number | null) => void;
    handleDrop: (dropIndex: number) => void;
    
    // Selectors（查询方法）
    getFilteredNotes: () => Note[];
    getAllTags: () => string[];
    getStarredNotes: () => Note[];
    getNoteById: (id: number) => Note | null;
    
    // 批量操作
    deleteAllNotes: () => void;
    generateTestNotes: (count?: number) => void;
    
    // 初始化
    initialize: () => void;
    reset: () => void;
  }

  // 在 types/index.ts 文件末尾添加

// ==================== 认证相关类型 ====================

/**
 * 用户接口
 */
export interface User {
  username: string;
  email?: string;
  avatar?: string;
}

/**
 * 认证 Store 状态
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

/**
 * 认证 Store 操作
 */
export interface AuthActions {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  initialize: () => void;
}

/**
 * 完整的认证 Store
 */
export type AuthStore = AuthState & AuthActions;
  
  /**
   * 完整的 Store 类型 = 状态 + 操作
   * 使用 & 合并两个接口
   */
export type NotesStore = NotesState & NotesActions;

/**
 * NoteItem 组件的 Props
 * 定义组件接收的所有属性
 */
export interface NoteItemProps {
  note: Note;                               // 笔记对象
  index: number;                            // 索引（用于拖拽）
  onDelete: (id: number) => void;           // 删除回调
  onEdit: (note: Note) => void;             // 编辑回调
  onToggleStar: (id: number) => void;       // 切换星标回调
  onDragStart: (id: number) => void;        // 拖拽开始
  onDragEnd: () => void;                    // 拖拽结束
  onDragOver: (index: number) => void;      // 拖拽悬停
  onDrop: (index: number) => void;          // 拖拽放置
  isDragging: boolean;                      // 是否正在拖拽
  isDragOver: boolean;                      // 是否有拖拽悬停
  onViewNote?: (id: number) => void;        // 查看详情（可选）
  onEditNote?: (id: number) => void;        // 编辑笔记（可选）
}

/**
 * NoteList 组件的 Props
 * 这个组件负责显示笔记列表，并处理各种交互
 */
export interface NoteListProps {
  notes: Note[];                                // 笔记数组
  onDelete: (id: number) => void;               // 删除笔记回调
  onEdit: (note: Note) => void;                 // 编辑笔记回调
  onToggleStar: (id: number) => void;           // 切换星标回调
  draggedNoteId: number | null;                 // 当前被拖拽的笔记 ID
  dragOverIndex: number | null;                 // 拖拽悬停的位置索引
  onDragStart: (id: number) => void;            // 拖拽开始
  onDragEnd: () => void;                        // 拖拽结束
  onDragOver: (index: number) => void;          // 拖拽悬停
  onDrop: (index: number) => void;              // 拖拽放置
  onViewNote?: (id: number) => void;            // 查看笔记详情（可选）
  onEditNote?: (id: number) => void;            // 编辑笔记（可选）
}

/**
 * NoteForm 组件的 Props
 * 这个组件负责创建和编辑笔记
 */
export interface NoteFormProps {
  editingNote: Note | null;                     // 正在编辑的笔记（null 表示新建）
  onSave: (noteData: NewNoteData) => void;      // 保存笔记回调
  onUpdate: (id: number, updates: NoteUpdate) => void;  // 更新笔记回调
  onCancel: () => void;                         // 取消编辑回调
}
