import { create } from 'zustand';
import type { AuthStore, User } from '../store';  // ← 添加导入

const useAuthStore = create<AuthStore>((set) => ({
//                           ^^^^^^^^^^ 添加泛型
  isAuthenticated: false,
  user: null,
  
  login: (username: string, password: string): boolean => {
    //     ^^^^^^^^  ^^^^^^  ^^^^^^^^  ^^^^^^   ^^^^^^^ 添加返回类型
    if (username && password) {
      const user: User = { username, email: `${username}@example.com` };
      //          ^^^^
      set({ isAuthenticated: true, user });
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user }));
      return true;
    }
    return false;
  },
  
  logout: (): void => {
    //      ^^^^^^ 添加返回类型
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('auth');
  },
  
  initialize: (): void => {
    try {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        set(authData);
      }
    } catch (error) {
      console.error('认证数据加载失败:', error as Error);
    }
  }
}));

export default useAuthStore;