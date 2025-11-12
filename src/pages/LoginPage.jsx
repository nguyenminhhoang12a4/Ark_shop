import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // 1. THÊM ICON

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await logIn(email, password);
      // Đăng nhập thành công, điều hướng về chợ đen
      navigate('/blackmarket');
    } catch (err) {
      console.error(err.message);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      {/* 1. NÚT QUAY LẠI ĐƯỢC ĐẶT NGOÀI CARD VÀ DÙNG FIXED */}
      <button
        onClick={() => navigate(-1)} // Quay lại trang trước
        className="fixed top-6 left-6 text-slate-400 hover:text-yellow-400 transition-colors z-20"
        title="Quay lại"
      >
        <ArrowLeftIcon className="h-8 w-8" /> {/* Tăng kích thước icon lên 8 */}
      </button>

      {/* 2. CARD FORM - ĐÃ XÓA CLASS "relative" */}
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        
        <h2 className="text-3xl font-bold text-center text-yellow-400 uppercase">
          Đăng nhập
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 mt-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="admin@bennshop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-300"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 mt-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-bold text-slate-900 bg-yellow-500 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;