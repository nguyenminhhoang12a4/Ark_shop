// src/data/mockBlackMarket.js

// 1. Danh sách tất cả người dùng (để tra cứu Rank khi hiển thị tin)
export const allUsers = [
    {
        id: "user_123",
        name: "Nguyen Van Thien", // User hiện tại (ví dụ)
        isSeller: true,           // Được phép bán
        isActive: true,           // Đang trong đợt bán (xoay tua)
        rank: 1,                  // Rank 1 (được đăng 1 tin)
        // Hạn Rank: Còn 20 ngày nữa
        rankExpiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "user_999",
        name: "Nguoi Ban Cu",
        isSeller: true,
        rank: 2,
        // Hạn Rank: Đã hết hạn hôm qua -> Tin của người này sẽ bị ẩn
        rankExpiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

// 2. User hiện tại đang đăng nhập (giả lập lấy user đầu tiên)
export const currentUser = allUsers[0];

// 3. Dữ liệu tin đăng ban đầu
export const initialMarketItems = [
  {
    id: 101,
    sellerId: "user_123",
    title: "Acc ARK Siêu Vip",
    price: 500000,
    image: "https://via.placeholder.com/300x200.png?text=Acc+ARK",
    description: "Full tek, base to...",
    createdAt: new Date().toISOString(),
    // Tin này hết hạn sau 30 ngày
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    sellerId: "user_999", // Tin của người đã hết hạn Rank
    title: "Vật phẩm hiếm (Đã ẩn)",
    price: 100000,
    image: "https://via.placeholder.com/300x200.png?text=Hidden+Item",
    description: "Bạn sẽ không thấy tin này ngoài chợ...",
    createdAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];