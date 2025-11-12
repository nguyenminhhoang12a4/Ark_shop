import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo "Nhà cung cấp" (Provider)
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);       // Thông tin phiên đăng nhập
  const [profile, setProfile] = useState(null);       // Thông tin profile (rank, role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy phiên đăng nhập hiện tại ngay khi tải trang
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Nếu có đăng nhập, tải profile
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Lắng nghe các thay đổi về trạng thái đăng nhập (Login, Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUserProfile(session.user.id);
        } else {
          // Nếu logout
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Dọn dẹp listener khi component bị hủy
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Hàm tải profile (rank, role...) từ database
  const fetchUserProfile = async (userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Lỗi tải profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Các hàm đăng nhập, đăng xuất
  const logIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logOut = async () => {
    await supabase.auth.signOut();
  };
  
  // (Sẽ thêm hàm signUp sau)

  const value = {
    session,
    profile, // Đây là thông tin quan trọng nhất (chứa rank, role)
    logIn,
    logOut,
    loadingAuth: loading, // Đổi tên để đỡ trùng lặp
  };

  // Chỉ hiển thị app khi đã tải xong thông tin auth
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Tạo custom hook để dễ dàng lấy dữ liệu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};