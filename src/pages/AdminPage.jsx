import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// --- Component con 1: Quản lý từng User (Giữ nguyên) ---
function UserEditorRow({ userProfile, allRanks }) {
  const [currentRank, setCurrentRank] = useState(userProfile.current_rank || 'Normal');
  const [duration, setDuration] = useState(userProfile.post_duration_days || 7);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        current_rank: currentRank,
        post_duration_days: parseInt(duration, 10)
      })
      .eq('id', userProfile.id);

    setLoading(false);
    if (error) {
      setMessage(`Lỗi: ${error.message}`);
    } else {
      setMessage('Cập nhật thành công!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">{userProfile.username || userProfile.id}</td>
      <td className="p-2">
        <select 
          value={currentRank} 
          onChange={(e) => setCurrentRank(e.target.value)}
          className="border rounded p-1"
        >
          {allRanks.map(rank => (
            <option key={rank.rank_name} value={rank.rank_name}>
              {rank.rank_name}
            </option>
          ))}
          <option value="Disabled">Disabled</option> 
        </select>
      </td>
      <td className="p-2">
        <input 
          type="number" 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded p-1 w-24"
        /> 
        (ngày)
        <p className="text-xs text-gray-500">Nhập 99999 cho "Vĩnh viễn"</p>
      </td>
      <td className="p-2">
        <button 
          onClick={handleUpdate} 
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
        >
          {loading ? '...' : 'Lưu'}
        </button>
      </td>
      <td className="p-2 text-green-500 text-sm">{message}</td>
    </tr>
  );
}

// --- Component con 2: Quản lý từng Rank (MỚI) ---
function RankEditorRow({ rankData }) {
  const [postLimit, setPostLimit] = useState(rankData.post_limit);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateLimit = async () => {
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase
      .from('ranks')
      .update({ post_limit: parseInt(postLimit, 10) })
      .eq('rank_name', rankData.rank_name);

    setLoading(false);
    if (error) {
      setMessage(`Lỗi: ${error.message}`);
    } else {
      setMessage('Cập nhật thành công!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2 font-semibold">{rankData.rank_name}</td>
      <td className="p-2">
        <input 
          type="number" 
          value={postLimit}
          onChange={(e) => setPostLimit(e.target.value)}
          className="border rounded p-1 w-24"
        /> 
        (tin)
      </td>
      <td className="p-2">
        <button 
          onClick={handleUpdateLimit} 
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
        >
          {loading ? '...' : 'Lưu giới hạn'}
        </button>
      </td>
      <td className="p-2 text-green-500 text-sm">{message}</td>
    </tr>
  );
}


// --- Component trang Admin chính (Đã cập nhật) ---
export default function AdminPage() {
  const [profiles, setProfiles] = useState([]);
  const [ranks, setRanks] = useState([]); // Danh sách các rank (Normal, Silver...)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Lấy tất cả profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesData) setProfiles(profilesData);
      else console.error(profilesError);

      // 2. Lấy tất cả các loại rank có thể
      const { data: ranksData, error: ranksError } = await supabase
        .from('ranks')
        .select('*');
      
      if (ranksData) setRanks(ranksData);
      else console.error(ranksError);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu quản trị...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* --- Bảng 1: Quản lý Giới hạn Rank (MỚI) --- */}
      <h1 className="text-3xl font-bold mb-4">Quản lý Rank</h1>
      <p className="mb-4">Chỉnh sửa giới hạn bài đăng cho từng loại rank.</p>
      <div className="overflow-x-auto bg-white shadow-md rounded mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Rank</th>
              <th className="p-2">Giới hạn tin</th>
              <th className="p-2">Hành động</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {ranks.map(rank => (
              <RankEditorRow key={rank.rank_name} rankData={rank} />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Bảng 2: Quản lý User (Như cũ) --- */}
      <h1 className="text-3xl font-bold mb-4">Quản lý User</h1>
      <p className="mb-4">Phân quyền và cài đặt thời gian đăng bài cho user.</p>
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Thời hạn tin (ngày)</th>
              <th className="p-2">Hành động</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <UserEditorRow 
                key={profile.id} 
                userProfile={profile} 
                allRanks={ranks} // Truyền danh sách rank xuống
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}