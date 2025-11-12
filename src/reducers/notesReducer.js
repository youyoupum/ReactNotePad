// ========== 📋 笔记应用的 Reducer 状态管理 ==========
// 这个文件包含了所有与状态管理相关的代码
// 导出：ACTION_TYPES（动作类型）、initialState（初始状态）、notesReducer（reducer函数）

// ========== Action Types（动作类型常量） ==========
// 定义所有 Action 类型常量
// 使用常量的好处：避免拼写错误、便于代码提示、易于维护
export const ACTION_TYPES = {
  // 笔记操作
  ADD_NOTE: 'ADD_NOTE',           // 添加笔记
  UPDATE_NOTE: 'UPDATE_NOTE',     // 更新笔记
  DELETE_NOTE: 'DELETE_NOTE',     // 删除笔记
  TOGGLE_STAR: 'TOGGLE_STAR',     // 切换星标
  REORDER_NOTES: 'REORDER_NOTES', // 🎯 拖拽重排序笔记
  
  // UI 状态
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',       // 设置搜索词
  SET_SELECTED_TAG: 'SET_SELECTED_TAG',     // 设置选中的标签
  SET_SORT_BY: 'SET_SORT_BY',               // 设置排序字段
  TOGGLE_SORT_ORDER: 'TOGGLE_SORT_ORDER',   // 切换排序顺序
  TOGGLE_FORM_VISIBLE: 'TOGGLE_FORM_VISIBLE', // 切换表单可见性
  
  // 复合操作
  START_EDIT: 'START_EDIT',       // 开始编辑（同时设置编辑笔记并展开表单）
  CANCEL_EDIT: 'CANCEL_EDIT',     // 取消编辑（同时清空编辑状态并关闭表单）
};

// ========== Initial State（初始状态） ==========
// 定义应用的初始状态结构
// 这个对象描述了应用在首次加载时的状态
export const initialState = {
  notes: [],              // 笔记列表（数组）
  editingNote: null,      // 正在编辑的笔记（对象或null）
  searchTerm: '',         // 搜索关键词（字符串）
  selectedTag: 'all',     // 选中的标签（字符串）
  sortBy: 'createdAt',    // 排序字段（'createdAt' | 'updatedAt' | 'title' | 'custom'）
  sortOrder: 'desc',      // 排序顺序（'asc' | 'desc'）
  isFormVisible: false    // 表单是否可见（布尔值）
};

// ========== Reducer Function（归约器函数） ==========
// Reducer 是一个纯函数，接收当前 state 和 action，返回新的 state
// 
// 纯函数的特点：
// 1. 相同的输入总是返回相同的输出
// 2. 不会修改传入的参数（不可变性）
// 3. 不会产生副作用（如 API 调用、修改外部变量）
//
// 参数：
//   - state: 当前的状态对象
//   - action: 包含 type 和 payload 的动作对象
// 返回：
//   - 新的状态对象（必须是新对象，不能修改原 state）
export function notesReducer(state, action) {
  switch (action.type) {
    // ========== 笔记操作 ==========
    
    case ACTION_TYPES.ADD_NOTE: {
      // 添加新笔记（支持单个或批量）
      // payload: { title, content, tags, isMarkdown } 或 { notes: array }
      
      // 🆕 批量添加模式
      if (action.payload.notes && Array.isArray(action.payload.notes)) {
        return {
          ...state,
          notes: [...action.payload.notes, ...state.notes],  // 批量添加到前面
          isFormVisible: false
        };
      }
      
      // 单个添加模式
      const newNote = {
        id: Date.now(),                                    // 使用时间戳作为唯一ID
        title: action.payload.title,                       // 笔记标题
        content: action.payload.content,                   // 笔记内容
        tags: action.payload.tags || [],                   // 笔记标签（默认空数组）
        isMarkdown: action.payload.isMarkdown || false,    // 👈 新增：是否为 Markdown 格式
        createdAt: new Date().toLocaleString('zh-CN')      // 创建时间（中文格式）
      };
      
      // 返回新的 state：添加笔记到数组开头，并关闭表单
      return {
        ...state,                           // 展开原 state，保留其他属性
        notes: [newNote, ...state.notes],   // 不可变更新：创建新数组，新笔记在前
        isFormVisible: false                // 添加后自动关闭表单
      };
    }
    
    case ACTION_TYPES.UPDATE_NOTE: {
      // 更新现有笔记
      // payload: { id: number, title: string, content: string, tags: array, isMarkdown: boolean }
      
      return {
        ...state,
        notes: state.notes.map(note =>
          // 找到要更新的笔记
          note.id === action.payload.id
            ? {
                ...note,                                       // 保留原笔记的其他属性
                title: action.payload.title,                   // 更新标题
                content: action.payload.content,               // 更新内容
                tags: action.payload.tags,                     // 更新标签
                isMarkdown: action.payload.isMarkdown,         // 👈 新增：更新 Markdown 标记
                updatedAt: new Date().toLocaleString('zh-CN')  // 添加更新时间
              }
            : note  // 其他笔记保持不变
        ),
        editingNote: null,      // 更新后清空编辑状态
        isFormVisible: false    // 更新后关闭表单
      };
    }
    
    case ACTION_TYPES.DELETE_NOTE: {
      // 删除指定笔记
      // payload: id (笔记的 ID)
      
      return {
        ...state,
        // 使用 filter 过滤掉要删除的笔记
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    }
    
    case ACTION_TYPES.TOGGLE_STAR: {
      // 切换笔记的星标状态（收藏/置顶）
      // payload: id (笔记的 ID)
      
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload
            ? { 
                ...note, 
                isStarred: !note.isStarred  // 切换星标：true <-> false
              }
            : note
        )
      };
    }
    
    // ========== UI 状态操作 ==========
    
    case ACTION_TYPES.SET_SEARCH_TERM: {
      // 设置搜索关键词
      // payload: string (搜索词)
      
      return {
        ...state,
        searchTerm: action.payload
      };
    }
    
    case ACTION_TYPES.SET_SELECTED_TAG: {
      // 设置选中的标签（用于筛选）
      // payload: string (标签名称，或 'all')
      
      return {
        ...state,
        selectedTag: action.payload
      };
    }
    
    case ACTION_TYPES.SET_SORT_BY: {
      // 设置排序字段
      // payload: 'createdAt' | 'updatedAt' | 'title'
      
      return {
        ...state,
        sortBy: action.payload
      };
    }
    
    case ACTION_TYPES.TOGGLE_SORT_ORDER: {
      // 切换排序顺序（升序 <-> 降序）
      // 无需 payload
      
      return {
        ...state,
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
      };
    }
    
    case ACTION_TYPES.TOGGLE_FORM_VISIBLE: {
      // 切换表单显示/隐藏
      // 无需 payload
      
      return {
        ...state,
        isFormVisible: !state.isFormVisible
      };
    }
    
    // ========== 复合操作（同时更新多个状态） ==========
    
    case ACTION_TYPES.START_EDIT: {
      // 开始编辑：同时设置编辑笔记并展开表单
      // payload: note (要编辑的笔记对象)
      
      return {
        ...state,
        editingNote: action.payload,  // 设置当前编辑的笔记
        isFormVisible: true           // 展开表单
      };
    }
    
    case ACTION_TYPES.CANCEL_EDIT: {
      // 取消编辑：同时清空编辑状态并关闭表单
      // 无需 payload
      
      return {
        ...state,
        editingNote: null,      // 清空编辑状态
        isFormVisible: false    // 关闭表单
      };
    }
    
    case ACTION_TYPES.REORDER_NOTES: {
      // 🎯 拖拽重排序笔记
      // payload: { fromIndex: number, toIndex: number }
      // fromIndex: 被拖动笔记的原始索引
      // toIndex: 目标位置的索引
      
      const { fromIndex, toIndex } = action.payload;
      
      // 边界检查：如果索引相同或无效，不做处理
      if (fromIndex === toIndex || fromIndex === null || toIndex === null) {
        return state;
      }
      
      // 步骤1: 创建数组副本（浅拷贝）
      // 使用扩展运算符创建新数组，确保 React 能检测到状态变化
      const updatedNotes = [...state.notes];
      
      // 步骤2: 从原位置移除被拖动的笔记
      // splice(起始索引, 删除数量) 返回被删除元素的数组
      // 使用解构赋值获取被删除的笔记对象
      const [draggedNote] = updatedNotes.splice(fromIndex, 1);
      
      // 步骤3: 插入到新位置
      // splice(起始索引, 删除数量, 要插入的元素)
      // 在 toIndex 位置插入 draggedNote，不删除任何元素
      updatedNotes.splice(toIndex, 0, draggedNote);
      
      // 🔑 关键修复：拖拽后自动切换到"自定义排序"模式
      // 这样可以保持用户手动调整的顺序，不被自动排序覆盖
      return {
        ...state,
        notes: updatedNotes,  // 更新笔记数组
        sortBy: 'custom'      // 切换到自定义排序模式
      };
    }
    
    default:
      // 未知的 action 类型，返回原 state（不做任何修改）
      // 这是一个安全措施，防止意外的 action 破坏状态
      return state;
  }
}

// ========== 导出说明 ==========
// 
// 使用方式：
// 
// import { ACTION_TYPES, initialState, notesReducer } from './reducers/notesReducer';
// 
// const [state, dispatch] = useReducer(notesReducer, initialState);
// 
// dispatch({
//   type: ACTION_TYPES.ADD_NOTE,
//   payload: { title: '标题', content: '内容', tags: ['标签'] }
// });

