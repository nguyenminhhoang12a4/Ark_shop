import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Đây là mấu chốt: Gửi username qua metadata
          // Trigger SQL của chúng ta sẽ tự động đọc nó
          data: {
            username: formData.username,
            avatar_url: '', // Có thể thêm link avatar mặc định
          }
        }
      });

      if (error) throw error;

      // Nếu thành công
      setMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      // Bạn có thể tự động chuyển về trang Login sau vài giây
      // setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-3xl font-bold text-center text-yellow-400 uppercase">Tạo tài khoản</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tên Thương nhân (Username)</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-500"
              placeholder="Ví dụ: BennShop"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-bold rounded-lg hover:from-yellow-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        {error && <p className="text-center text-red-500">{error}</p>}
        {message && <p className="text-center text-green-500">{message}</p>}
        <p className="text-center text-slate-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-yellow-500 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;