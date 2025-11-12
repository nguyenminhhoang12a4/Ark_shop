import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CreatePostForm from '../components/CreatePostForm'; // Đảm bảo đường dẫn đúng
import { XCircleIcon } from '@heroicons/react/24/solid'; // Import icon Xóa

export default function FleaMarketPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [activePostCount, setActivePostCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null); // State mới để lưu ID user
  const [error, setError] = useState(''); // State mới để báo lỗi cho user

  // Cải tiến: Lấy ID user trước
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      } else {
        setLoading(false); // Không có user, dừng loading
      }
    };
    fetchUser();
  }, []);

  // Hàm fetch vật phẩm (giữ nguyên)
  const fetchItems = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('flea_market_items')
      .select('*, profiles(username)')
      .or('expires_at.gt.now(),expires_at.is.null')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching items:', fetchError);
      setError('Lỗi tải vật phẩm: ' + fetchError.message);
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  // Cải tiến: Tách hàm fetch profile
  const fetchUserProfile = async () => {
    if (!currentUserId) return; // Chỉ chạy nếu đã có user ID (fix lỗi race condition)

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*, ranks(post_limit)')
      .eq('id', currentUserId)
      .single();
      
    if (profileData) {
      setUserProfile(profileData);
      // Đếm số tin đang active
      const { count, error: countError } = await supabase
        .from('flea_market_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .or('expires_at.gt.now(),expires_at.is.null');

      if (!countError) setActivePostCount(count || 0);
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Có thể user đã đăng nhập nhưng chưa có trong bảng 'profiles'
      setError('Không tìm thấy thông tin profile. Vui lòng liên hệ Admin.');
    }
  };

  // Cải tiến: Tách useEffect
  // Chạy fetchItems 1 lần, và chạy lại fetchUserProfile BẤT CỨ KHI NÀO currentUserId thay đổi
  useEffect(() => {
    fetchItems();
    fetchUserProfile(); // Sẽ tự động return nếu chưa có currentUserId
  }, [currentUserId]); // Phụ thuộc vào currentUserId

  // --- HÀM XÓA MỚI (Từ Bước 11) ---
  const handleDeleteItem = async (item) => {
    // 1. Xác nhận
    if (!window.confirm(`Bạn có chắc muốn xóa vật phẩm "${item.item_name}"?`)) {
      return;
    }

    try {
      // 2. Xóa ảnh khỏi Storage trước
      const imageUrl = new URL(item.image_url);
      const imagePath = imageUrl.pathname.split('/').slice(2).join('/'); 

      const { error: storageError } = await supabase.storage
        .from('flea_market_images')
        .remove([imagePath]);

      if (storageError && storageError.message !== 'The resource was not found') {
        throw storageError;
      }

      // 3. Xóa tin đăng khỏi Database
      const { error: dbError } = await supabase
        .from('flea_market_items')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      // 4. Cập nhật lại UI (thay vì alert)
      setError(''); // Xóa lỗi cũ (nếu có)
      // Tải lại mọi thứ
      fetchItems();
      fetchUserProfile();

    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      setError('Lỗi khi xóa: ' + err.message);
      alert('Lỗi khi xóa: ' + err.message); // Vẫn alert cho lỗi xóa
    }
  };

  // Check xem user có được phép đăng bài không
  const canPost = userProfile && ['Normal', 'Silver', 'Gold', 'Admin'].includes(userProfile.current_rank);
  const hasReachedLimit = userProfile && userProfile.ranks && activePostCount >= userProfile.ranks.post_limit;

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Chợ Trời</h1>

      {/* Cải tiến: Hiển thị lỗi rõ ràng */}
      {error && <p className="text-red-500 text-center mb-4 p-3 bg-red-100 rounded">{error}</p>}

      {/* Phần Form Đăng bài */}
      {currentUserId ? ( // Check xem đã đăng nhập chưa
        canPost ? (
          hasReachedLimit ? (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4 max-w-lg mx-auto rounded">
              <p>Bạn đã đạt giới hạn {activePostCount} tin đăng cho hạng <b>{userProfile.current_rank}</b>. Bạn không thể đăng thêm.</p>
            </div>
          ) : (
            <CreatePostForm onPostSuccess={() => {
              fetchItems();
              fetchUserProfile();
            }} />
          )
        ) : (
          // userProfile đã được tải nhưng không có rank hợp lệ
          userProfile && (
            <div className="p-4 bg-gray-100 text-center mb-4 max-w-lg mx-auto rounded shadow">
              <p>Bạn không có quyền đăng bán. Vui lòng liên hệ Admin.</p>
            </div>
          )
        )
      ) : (
        // Chưa đăng nhập
        !loading && ( // Chỉ hiện khi không loading
          <div className="p-4 bg-gray-100 text-center mb-4 max-w-lg mx-auto rounded shadow">
            <p>Vui lòng <a href="/login" className="text-blue-600 underline">đăng nhập</a> để đăng bán.</p>
          </div>
        )
      )}


      {/* Phần Hiển thị Vật phẩm */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Các vật phẩm đang bán</h2>
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg shadow-lg overflow-hidden bg-white relative">
              
              {/* --- NÚT XÓA MỚI --- */}
              {currentUserId === item.user_id && (
                <button
                  onClick={() => handleDeleteItem(item)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 z-10"
                  title="Xóa vật phẩm này"
                >
                  <XCircleIcon className="h-6 w-6" /> 
                </button>
              )}

              <img src={item.image_url} alt={item.item_name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold">{item.item_name}</h3>
                <p className="text-gray-600 text-sm mt-1 h-10 truncate" title={item.description}>{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Người đăng: {item.profiles?.username || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}