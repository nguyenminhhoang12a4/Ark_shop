import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../supabaseClient'; 

export default function CreatePostForm({ onPostSuccess }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setError(''); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !itemName) {
      setError('Vui lòng nhập tên vật phẩm và tải lên hình ảnh.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Upload ảnh
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `flea_market_images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('flea_market_images')
        .upload(filePath, imageFile);

      // --- CẢI TIẾN QUAN TRỌNG ---
      if (uploadError) {
        // Bắt lỗi Policy (Quy tắc 2) ở đây
        if (uploadError.message.includes('policy')) {
          throw new Error('Bạn không có quyền đăng bài. Vui lòng liên hệ Admin.');
        }
        throw uploadError;
      }

      // 2. Lấy URL
      const { data: publicUrlData } = supabase.storage
        .from('flea_market_images')
        .getPublicUrl(filePath);

      if (!publicUrlData) throw new Error('Không thể lấy public URL');
      const publicUrl = publicUrlData.publicUrl;

      // 3. Gọi hàm RPC (để check giới hạn bài đăng)
      const { error: rpcError } = await supabase.rpc('create_flea_market_item', {
        p_item_name: itemName,
        p_description: description,
        p_image_url: publicUrl,
      });

      if (rpcError) throw rpcError;

      // 4. Thành công!
      // alert('Đăng tin thành công!'); // (Chúng ta có thể bỏ alert để mượt hơn)
      setItemName('');
      setDescription('');
      setImageFile(null);
      setPreview(null);
      if (onPostSuccess) onPostSuccess(); 

    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg max-w-lg mx-auto mb-8">
      <h3 className="text-xl font-semibold mb-4">Đăng bán vật phẩm</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Xem trước" className="max-h-40 mx-auto" />
        ) : (
          <p className="text-gray-500">Kéo thả ảnh vào đây, hoặc nhấn để chọn ảnh</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
          Tên vật phẩm <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.targe.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Đang xử lý...' : 'Đăng tin'}
      </button>
    </form>
  );
}