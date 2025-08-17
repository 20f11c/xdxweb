import { createContext, useContext } from 'react';

/**
 * 认证上下文
 */
const AuthContext = createContext();

/**
 * 使用认证上下文的Hook
 * @returns {Object} 认证上下文值
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;