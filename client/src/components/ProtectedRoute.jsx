import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  console.log(user)

  // اگر کاربر لاگین نکرده، به صفحه لاگین هدایت می‌شه
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // اگر لاگین کرده، محتوای مسیر (مثل داشبورد) نمایش داده می‌شه
  return children;
}

export default ProtectedRoute;