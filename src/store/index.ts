/**
 * Store 统一导出文件
 * 方便在其他文件中导入多个 store
 */

export { default as useNotesStore } from './useNotesStore';
export { default as useAuthStore } from './useAuthStore';

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

