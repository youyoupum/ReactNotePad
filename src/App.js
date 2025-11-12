
import React, { useEffect } from 'react';
import './App.css';

// ========== 🎯 导入路由配置 ==========
import AppRouter from './routes/AppRouter';

// ========== 📦 导入 Zustand Stores ==========
import { useNotesStore, useAuthStore } from './store';

function App() {
  const initializeNotes = useNotesStore(state => state.initialize);
  const initializeAuth = useAuthStore(state => state.initialize);
  useEffect(() => {
    initializeNotes();
    initializeAuth();
    console.log('应用初始化完成！');
    console.log('Zustand 状态管理已集成');
    console.log('所有组件可直接访问 store，无需 props 传递');
  }, [initializeNotes, initializeAuth]);
  return <AppRouter />;
}

export default App;
