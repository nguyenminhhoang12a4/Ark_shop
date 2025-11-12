import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

// --- PHIÊN BẢN SỬA LỖI THROW ---

export function useBlackMarketPermissions() {
  const { profile } = useAuth();
  
  const [rawItems, setRawItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [profile]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('market_items')
        .select(`*, profiles ( username, rank_expiry )`)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      setRawItems(itemsData);

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Chợ Đen:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // --- LOGIC KIỂM TRA ---
  if (isLoading || !profile) {
    return {
      user: null,
      visibleItems: [],
      canPost: false,
      remainingQuota: 0,
      isRankValid: false,
      userActivePosts: 0,
      isLoading: isLoading, 
      addNewItem: async () => { alert("Bạn phải đăng nhập để đăng tin!"); return null; },
      deleteItem: async () => { alert("Bạn phải đăng nhập để xóa tin!"); },
    };
  }

  // ... (Logic lọc và kiểm tra quyền giữ nguyên)
  const visibleItems = rawItems.filter(item => {
    const isItemNotExpired = new Date(item.expiry_date) > new Date();
    const sellerRankExpiry = item.profiles?.rank_expiry;
    const isSellerRankValid = sellerRankExpiry && (new Date(sellerRankExpiry) > new Date());
    return isItemNotExpired && isSellerRankValid;
  });

  const userActivePosts = visibleItems.filter(item => item.seller_id === profile.id).length;
  const isRankValid = profile.rank_expiry && (new Date(profile.rank_expiry) > new Date());
  
  const canPost =
    profile.is_seller &&
    profile.is_active &&
    isRankValid &&
    (userActivePosts < profile.rank);

  const remainingQuota = Math.max(0, profile.rank - userActivePosts);


  // 3. Hàm thêm/xóa tin (ĐÃ SỬA LỖI THROW)
  const addNewItem = async (formData, imageFile) => {
    const { title, price, description } = formData;

    if (!imageFile) {
        alert("Lỗi: Không tìm thấy file ảnh.");
        return null; // <-- SỬA 1: return null thay vì throw
    }
    
    // --- BƯỚC 1: UPLOAD ẢNH LÊN STORAGE ---
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${profile.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('market_images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Lỗi khi upload ảnh:", uploadError.message);
      alert("Đăng tin thất bại! Lỗi upload ảnh. (Hãy kiểm tra Policy của Storage)");
      return null; // <-- SỬA 2: return null thay vì throw
    }

    // --- BƯỚC 2: LẤY PUBLIC URL CỦA ẢNH ---
    const { data: urlData } = supabase.storage
      .from('market_images')
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
        alert("Lỗi: Không lấy được link ảnh sau khi upload.");
        return null; // <-- SỬA 3: return null thay vì throw
    }
    const imageUrl = urlData.publicUrl;

    // --- BƯỚC 3: LƯU TIN ĐĂNG VÀO DATABASE (với link ảnh mới) ---
    const newDbItem = {
      title,
      price,
      image_url: imageUrl,
      description,
      seller_id: profile.id,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data: insertedItem, error: insertError } = await supabase
      .from('market_items')
      .insert(newDbItem)
      .select(`*, profiles ( username, rank_expiry )`)
      .single();

    if (insertError) {
      console.error("Lỗi khi đăng tin (database):", insertError.message);
      alert("Đăng tin thất bại! Lỗi: " + insertError.message);
      return null; // <-- SỬA 4: return null thay vì throw
    } else {
      setRawItems([insertedItem, ...rawItems]);
      alert("Đăng tin thành công!");
      return insertedItem; // <-- SỬA 5: Trả về data khi thành công
    }
  };

  const deleteItem = async (itemId) => {
    // ... (Giữ nguyên hàm delete)
    const { error } = await supabase
      .from('market_items')
      .delete()
      .eq('id', itemId); 

    if (error) {
      console.error("Lỗi khi xóa tin:", error.message);
      alert("Xóa tin thất bại! Lỗi: " + error.message);
    } else {
      setRawItems(rawItems.filter(item => item.id !== itemId));
    }
  };

  return {
    user: profile,
    visibleItems,
    userActivePosts,
    canPost,
    remainingQuota,
    isRankValid,
    isLoading: false,
    addNewItem,
    deleteItem,
  };
}