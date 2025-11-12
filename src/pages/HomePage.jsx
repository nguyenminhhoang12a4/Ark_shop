import React from 'react';
import { Icon } from '../components/Icon'; // Import Icon

// --- IMPORT CHO SLIDER ---
import Slider from "react-slick";
// Import CSS bắt buộc của thư viện slider
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- IMPORT HÌNH ẢNH CỦA BẠN ---
// (Hãy chắc chắn bạn có đủ 6 ảnh này trong /src/assets/)
import HinhTC1 from '../assets/HinhTC_1.png';
import HinhTC2 from '../assets/HinhTC_2.png';
import HinhTC3 from '../assets/HinhTC_3.png';
import HinhTC4 from '../assets/HinhTC_4.png';
import HinhTC5 from '../assets/HinhTC_5.png';
import HinhTC6 from '../assets/HinhTC_6.png';


// Tạo một danh sách (array) chứa các ảnh đã import
const sliderImages = [
  HinhTC1,
  HinhTC2,
  HinhTC3,
  HinhTC4,
  HinhTC5,
  HinhTC6,
];

/**
 * Component Home: Trang chủ
 */
export const HomePage = () => {

  // --- CÀI ĐẶT CHO SLIDER (Đã sửa, ưu tiên Mobile-first) ---
  const sliderSettings = {
    className: "center-slider",
    centerMode: true,
    infinite: true,
    centerPadding: "60px", // Khoảng hở 2 bên (vẫn giữ để thấy slide kế)
    dots: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    
    // Mặc định (mobile)
    slidesToShow: 1, 
    slidesToScroll: 1,

    // Responsive: Chỉ đổi sang 3 slide khi màn hình lớn (md: 768px)
    responsive: [
      {
        breakpoint: 768, // md breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: "40px",
        }
      }
    ]
  };

  return (
    // Thay đổi hoàn toàn component Home
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans">
      
      {/* --- Hero Section --- */}
      <div className="text-center p-8 rounded-lg bg-black bg-opacity-20 mb-12 relative overflow-hidden">
        {/* Hiệu ứng nền mờ */}
        <div className="absolute inset-0 bg-emerald-900 opacity-30 blur-3xl z-0"></div>
        
        <div className="relative z-10">
          <Icon name="ShieldCheck" size={64} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Hệ thống server <span className="text-emerald-400">ARK Mobile Việt Nam</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Ra mắt hơn 1 năm bởi BennShop, đây là sân chơi ổn định, công bằng và đầy sáng tạo cho cộng đồng người chơi Việt,
            quy tụ hơn 300 thành viên hoạt động thường xuyên.
          </p>
          <button 
          onClick={() => window.open("https://zalo.me/g/nzqcdi654", "_blank")}
          className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
            <Icon name="Rocket" size={22} />
            <span>Tham Gia Ngay Hôm Nay!</span>
          </button>
        </div>
      </div>

      {/* --- Server Section --- */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <Icon name="Server" size={30} className="text-emerald-400" />
          <span>Hệ Thống Server</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Server Card 1: VN_game */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Icon name="Shield" size={28} className="text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-blue-400">🏕️ VN_game</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Dành cho người chơi thích trải nghiệm ổn định, cày cuốc nhẹ nhàng, phù hợp cả cho người mới.
            </p>
            <p className="text-gray-400 text-sm">
              Hệ thống được tối ưu để mang lại hiệu năng mượt mà và cân bằng, giúp bạn phát triển thoải mái.
            </p>
          </div>
          
          {/* Server Card 2: VN_toichoi */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 hover:shadow-red-500/20 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Icon name="Swords" size={28} className="text-red-400 mr-3" />
              <h3 className="text-2xl font-bold text-red-400">⚔️ VN_toichoi</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Dành cho game thủ yêu thích PvP, thử thách và chiến đấu sinh tồn khốc liệt.
            </p>
            <p className="text-gray-400 text-sm">
              Cạnh tranh công bằng – nơi kỹ năng và chiến thuật quyết định chiến thắng.
            </p>
          </div>

          {/* Server Card 3: VN_YenBinh */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Icon name="Heart" size={28} className="text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-green-500">💖 VN_YenBinh</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Một thế giới "Yên Bình" dành cho các chiến binh... hệ cute!
            </p>
            <p className="text-gray-400 text-sm">
              Nơi kỹ năng quyết định chiến thắng, nhưng phải "chiến" thật đáng yêu nhé!
            </p>
          </div>

          {/* Server Card 4: Cổ Đông Chính */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 hover:shadow-yellow-500/20 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Icon name="Star" size={28} className="text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-yellow-400">⭐ Cổ Đông</h3>
            </div>
            <p className="mb-2 text-xl text-yellow-400">
              Admin: TQK (VN_game)
            </p>
            <p className="text-gray-400 text-sm">
              Những người đã góp vốn để gây dựng server của chúng ta sẽ được vinh danh!!!
            </p>
          </div>
        </div>
      </div>

      {/* =========== SECTION SLIDER HÌNH ẢNH MỚI =========== */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          {/* SỬA: Thay thế Icon 'Image' bị lỗi bằng emoji 📸 */}
          <span className="text-3xl" role="img" aria-label="Camera">📸</span>
          {/* <Icon name="Image" size={30} className="text-emerald-400" /> */}
          <span>Khoảnh Khắc Server</span>
        </h2>
        
        {/* Thêm div bọc ngoài này */}
        <div className="slider-wrapper">
          <Slider {...sliderSettings}>
            {sliderImages.map((imgSrc, index) => (
              <div key={index} className="px-2"> {/* Thêm padding 2 bên cho mỗi ảnh */}
                <img 
                  src={imgSrc} 
                  alt={`Hình ảnh server ${index + 1}`} 
                  className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-700"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* =================== KẾT THÚC SECTION =================== */}


      {/* --- Operator & Community Section --- */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        
        {/* Operator */}
        <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Icon name="Briefcase" className="text-emerald-400 mr-2" />
            <span>Người Vận Hành</span>
          </h2>
          <div className="flex items-center mb-4">
            <Icon name="Crown" className="text-yellow-400 mr-3" size={24} />
            <span className="text-xl font-semibold">Nguyễn Minh Hoàng</span>
            <span className="ml-3 text-sm bg-emerald-600 text-white px-3 py-0.5 rounded-full font-medium">
              Nhà sáng lập & Quản lý
            </span>
          </div>
          <div className="flex items-center mb-4">
            <Icon name="Crown" className="text-yellow-400 mr-3" size={24} />
            <span className="text-xl font-semibold">Kim Tuyền</span>
            <span className="ml-3 text-sm bg-emerald-600 text-white px-3 py-0.5 rounded-full font-medium">
              Nhà sáng lập & Quản lý
            </span>
          </div>
          <p className="text-gray-300 mb-4">
            Luôn đồng hành cùng cộng đồng, hỗ trợ kỹ thuật, cập nhật và lắng nghe ý kiến
            từ người chơi để mang đến trải nghiệm tốt nhất.
          </p>
          <div className="flex items-center text-lg bg-gray-900 p-3 rounded-lg">
            <Icon name="Phone" className="text-emerald-400 mr-3" />
            <strong>Liên hệ Zalo:</strong>
            <span className="ml-2 text-white font-mono bg-gray-700 px-3 py-1 rounded-md text-base">0842039811</span>
          </div>
        </div>
        
        {/* Community */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Icon name="Globe" className="text-emerald-400 mr-2" />
            <span>Cộng Đồng</span>
          </h2>
          <div className="flex items-center text-3xl font-bold mb-4">
            <Icon name="Users" className="text-emerald-400 mr-3" size={32} />
            300+
            <span className="text-lg font-normal text-gray-300 ml-2">thành viên</span>
          </div>
          <p className="text-gray-300 mb-3">Môi trường của chúng ta:</p>
          <ul className="space-y-2">
            <li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Vui vẻ</li>
            <li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Công bằng</li>
            <li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Lâu dài</li>
          </ul>
        </div>
      </div>
      
      {/* --- Footer CTA --- */}
      <div className="text-center border-t border-gray-700 pt-8">
        <p className="text-xl text-gray-300 mb-4">
          Thuần hóa khủng long, xây dựng căn cứ, liên minh cùng bạn bè – tất cả đang chờ bạn!
        </p>
        <p className="text-gray-400 text-2xl">
          <Icon name="MessageSquare" className="inline-block mr-2" />
          Liên hệ: <strong>BennShop</strong> 
          <div>
            <button 
              onClick={() => window.open("https://zalo.me/0842039811", "_blank")}
              className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
                <Icon name="Rocket" size={22} />
                <span>
                  Zalo: 0842039811
                </span>
            </button>
          </div>
        </p>
      </div>
    </div>
  );
};