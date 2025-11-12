import { useState, useEffect } from 'react';

/**
 * ========== 🎣 自定义 Hook：useLocalStorage ==========
 * 
 * 📌 作用：
 * 将 React 状态与 localStorage 同步，实现数据持久化
 * 
 * 📌 参数：
 * @param {string} key - localStorage 的键名
 * @param {any} initialValue - 默认初始值
 * 
 * 📌 返回值：
 * @returns {Array} [storedValue, setValue] - 类似 useState 的返回值
 *   - storedValue: 当前存储的值
 *   - setValue: 更新值的函数
 * 
 * 📌 核心概念：
 * 1. 闭包（Closure）：内部函数可以访问外部函数的变量
 *    - setValue 函数形成闭包，可以访问 key 参数
 * 
 * 2. 惰性初始化（Lazy Initialization）：
 *    - useState 的初始值使用函数形式
 *    - 只在组件首次渲染时执行一次，避免重复读取 localStorage
 * 
 * 3. 副作用（Side Effect）：
 *    - useEffect 在状态变化时同步到 localStorage
 */
function useLocalStorage(key, initialValue) {
  // ========== 1. 状态初始化：从 localStorage 读取或使用默认值 ==========
  const [storedValue, setStoredValue] = useState(() => {
    // 🔍 为什么用函数形式？
    // 函数形式的初始化只在组件首次挂载时执行一次
    // 如果直接传值：useState(localStorage.getItem(key))
    // 则每次组件重新渲染都会读取 localStorage（性能浪费）

    try {
      // 1.1 尝试从 localStorage 获取数据
      const item = window.localStorage.getItem(key);
      
      // 1.2 解析 JSON 字符串
      // item 存在时解析，不存在时返回 initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 1.3 如果解析失败（数据损坏），打印错误并返回默认值
      console.error(`❌ 读取 localStorage 键 "${key}" 时出错:`, error);
      return initialValue;
    }
  });

  // ========== 2. 自定义 setValue 函数：支持函数式更新 ==========
  const setValue = (value) => {
    try {
      // 2.1 支持函数式更新（类似 setState）
      // 如果 value 是函数，则调用它获取新值
      // 例如：setValue(prev => prev + 1)
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      // 2.2 更新 React 状态（触发重新渲染）
      setStoredValue(valueToStore);
      
      // 2.3 同步到 localStorage
      // 注意：localStorage 只能存储字符串，所以需要 JSON.stringify
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // 2.4 如果写入失败（可能是存储空间满了），打印错误
      console.error(`❌ 保存到 localStorage 键 "${key}" 时出错:`, error);
    }
  };

  // ========== 3. 副作用：监听其他标签页的变化（可选功能） ==========
  useEffect(() => {
    // 3.1 定义 storage 事件处理函数
    // 当其他标签页修改了 localStorage 时，同步更新当前页面的状态
    const handleStorageChange = (e) => {
      // 只处理当前 key 的变化
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`❌ 同步 localStorage 键 "${key}" 时出错:`, error);
        }
      }
    };

    // 3.2 添加事件监听器
    window.addEventListener('storage', handleStorageChange);

    // 3.3 清理函数：组件卸载时移除监听器（防止内存泄漏）
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]); // 依赖项：只有 key 变化时才重新绑定事件

  // ========== 4. 返回值：类似 useState ==========
  return [storedValue, setValue];
}

export default useLocalStorage;

/**
 * ========== 📖 使用示例 ==========
 * 
 * import useLocalStorage from './hooks/useLocalStorage';
 * 
 * function App() {
 *   // 用法和 useState 完全一样
 *   const [name, setName] = useLocalStorage('username', '');
 *   const [notes, setNotes] = useLocalStorage('notes', []);
 * 
 *   return (
 *     <div>
 *       <input 
 *         value={name} 
 *         onChange={e => setName(e.target.value)} 
 *       />
 *     </div>
 *   );
 * }
 * 
 * ========== 🔑 核心知识点总结 ==========
 * 
 * 1. 闭包（Closure）：
 *    - setValue 函数内部可以访问 key 和 storedValue
 *    - 即使 useLocalStorage 函数执行完毕，这些变量仍然被保留
 * 
 * 2. 惰性初始化：
 *    - useState(() => {...}) 函数形式
 *    - 避免每次渲染都执行昂贵的计算
 * 
 * 3. 自定义 Hook 规则：
 *    - 名称必须以 "use" 开头
 *    - 内部可以调用其他 Hooks
 *    - 只能在函数组件或其他 Hook 中调用
 */

