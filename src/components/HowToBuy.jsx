import React, { useState } from 'react';
import { Icon } from './Icon'; 
import helpIcon from '../assets/help-icon.png'; // Đã import file ảnh

export const HowToBuy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Nội dung Hướng dẫn (Đã sửa cỡ chữ nhỏ hơn) ---
  const GuideContent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      <h3 className="text-lg md:text-3xl font-bold text-gray-800 mb-4 flex items-center">
        <Icon name="Info" className="text-blue-600 mr-2" />
        Hướng dẫn Mua Hàng
      </h3>
      
      <ul className="text-sm md:text-2xl space-y-3 text-gray-700 list-decimal list-inside">
        <li>Chọn mặt hàng bạn thích sau đó chụp hình lại.</li>
        <li>Gửi sản phẩm bạn chọn qua Zalo: <strong className="text-gray-900">Nguyễn Minh Hoàng (BennShop)</strong>.</li>
        
        <li className="text-sm md:text-2xl font-semibold text-blue-600 list-none ml-4">
          <button 
            onClick={() => window.open("https://zalo.me/0842039811", "_blank")}
            className="bg-emerald-600 text-white py-2 px-4 md:py-3 md:px-8 rounded-lg font-bold text-sm md:text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
            <Icon name="Rocket" size={18} />
            <span>Zalo: 0842039811</span>
          </button>
        </li>
        <li>Nếu Thanh toán QR thì kèm theo bill gửi tiền.</li>
        <li>Nếu thanh toán bằng card thì có thể liên hệ trực tiếp.</li>
      </ul>
      
      <div className="mt-6">
        <img 
          src="/assets/QR.png" 
          alt="Mã QR Thanh toán" 
          className="w-full h-auto rounded-md border-2 border-gray-200"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=QR+Code'; }}
        />
        <p className="text-center text-sm text-gray-600 mt-2">Quét mã QR để thanh toán (BennShop)</p>
      </div>
    </div>
  );

  return (
    <>
      {/* === PHIÊN BẢN DESKTOP (STICKY) === */}
      <div className="hidden md:block sticky top-8">
        <GuideContent />
      </div>

      {/* === PHIÊN BẢN MOBILE (NÚT BẤM & MODAL) === */}
      <div className="md:hidden">
        
        {/* Nút bấm cố định - ĐÃ SỬA SRC */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed top-1/4 right-5 z-40 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
        >
          {/* Đã dùng biến helpIcon từ import */}
          <img src={helpIcon} alt="Help Icon" className="w-10 h-10" />
        </button>

        {/* Modal (Popup) */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)} // Click nền để đóng
          >
            {/* Thân modal */}
            <div 
              className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Nút đóng (X) */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-red-600 text-white w-10 h-10 rounded-full shadow-lg font-bold text-xl z-10 border-2 border-white">
                X
              </button>
              
              {/* Nội dung Hướng dẫn đã được sửa cỡ chữ nhỏ hơn */}
              <GuideContent /> 
            </div>
          </div>
        )}
      </div>
    </>
  );
};