// src/components/AdminRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Đảm bảo đường dẫn đúng

// Component này sẽ "bọc" trang Admin
// children chính là <AdminPage /> mà chúng ta truyền vào
export default function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Lấy profile của user đang đăng nhập
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('current_rank')
          .eq('id', user.id)
          .single();

        if (profile && profile.current_rank === 'Admin') {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Đang kiểm tra quyền...</div>; // Hoặc một spinner
  }

  // Nếu không phải admin, đá về trang chủ (hoặc trang shop)
  if (!isAdmin) {
    return <Navigate to="/shop" replace />;
  }

  // Nếu là admin, hiển thị trang Admin
  return children;
}