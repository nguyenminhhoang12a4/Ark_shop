import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Component và Data
import { Navbar } from './components/Navbar';
import { ImageZoomModal } from './components/ImageZoomModal';
import { initialProductData } from './data/productData';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Các trang (Pages)
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// --- THÊM CÁC TRANG MỚI ---
import AdminPage from './pages/AdminPage';
import FleaMarketPage from './pages/FleaMarketPage';
import AdminRoute from './components/AdminRoute';
import { EventPage } from './pages/EventPage';

// Component Layout chung (Navbar + Nền)
const AppLayout = () => (
  <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <main>
        <Outlet /> {/* Đây là nơi các trang con (HomePage, ShopPage...) render */}
      </main>
    </div>
  </div>
);

// Component App chính
export default function App() {
  // State zoom ảnh (dành cho ShopPage)
  const [zoomState, setZoomState] = useState({
    isOpen: false,
    products: [],
    currentIndex: 0,
  });

  const handleOpenZoom = (products, startIndex = 0) => {
    setZoomState({
      isOpen: true,
      products: products,
      currentIndex: startIndex,
    });
  };

  const handleCloseZoom = () => {
    setZoomState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigateZoom = (direction) => {
    setZoomState((prev) => {
      let newIndex = prev.currentIndex + direction;
      const totalImages = prev.products.length;
      if (newIndex >= totalImages) newIndex = 0;
      if (newIndex < 0) newIndex = totalImages - 1;
      return { ...prev, currentIndex: newIndex };
    });
  };

  return (
    // 1. Bọc TOÀN BỘ app bằng AuthProvider
    <AuthProvider>
      {/* Thẻ Fragment ( <>...</> ) là cần thiết */}
      <>
        {/* Giữ nguyên style cho animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.5s ease-out; }
          
          @keyframes fadeInFast {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-fast { animation: fadeInFast 0.2s ease-out; }
        `}</style>
        
        {/* 2. Định nghĩa các Route */}
        <Routes>
          {/* Các trang CÓ Layout (Có Navbar) */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route 
              path="shop" 
              element={
                <ShopPage 
                  products={initialProductData} // Dùng data gốc
                  onOpenZoom={handleOpenZoom}
                  zoomState={zoomState}
                />
              } 
            />
            
            {/* 3. BẢO VỆ ROUTE ADMIN */}
            <Route 
              path="admin" 
              element={
                <AdminRoute> {/* Bọc AdminPage bằng AdminRoute */}
                  <AdminPage />
                </AdminRoute>
              } 
            />
            
            {/* --- ĐÃ DI CHUYỂN LÊN ĐÂY --- */}
            {/* Trang Chợ Trời bây giờ đã CÓ Navbar */}
            <Route path="/cho-troi" element={<FleaMarketPage />} />
             <Route path="/event" element={<EventPage />} />

            {/* Route dự phòng (nếu gõ sai) */}
            <Route path="*" element={<HomePage />} /> 
          </Route>
          
          {/* Các trang KHÔNG có Layout (Trang full màn hình) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* --- ĐÃ XÓA KHỎI ĐÂY --- */}
          {/* <Route path="/cho-troi" element={<FleaMarketPage />} /> */}

        </Routes>
        
        {/* Modal Zoom Ảnh (nằm ngoài Routes để đè lên mọi thứ) */}
        {zoomState.isOpen && (
          <ImageZoomModal
            currentImage={zoomState.products[zoomState.currentIndex]?.imageUrl} 
            onClose={handleCloseZoom}
            onNavigate={handleNavigateZoom}
            hasNavigation={zoomState.products.length > 1}
          />
        )}
      </>
    </AuthProvider>
  );
}