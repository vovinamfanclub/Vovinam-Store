
export interface Product {
  id: string;
  name: string;           // Khớp với cột "Tên Sản Phẩm"
  category: string;       // Khớp với cột "Hạng Mục"
  image: string;          // Khớp với cột "Ảnh Sản Phẩm"
  originalPrice: string;  // Dùng string để tránh lỗi định dạng tiền tệ có chữ "đ"
  discountPrice: string;  // Dùng string để tránh lỗi định dạng tiền tệ có chữ "đ"
  badge: string;
  affiliateUrl: string;   // Khớp với cột "AffiliateUrl"
}

/**
 * Link Google Sheet đã xuất bản dưới dạng CSV.
 */
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZLbaEiyJ-qdZEL5aDliCGwPjwBLsJelGpC2wSZlqgntbBG3ReHcsPB-pSKwCOdqOPrkXLoHApUcW7/pub?gid=0&single=true&output=csv';

export const FALLBACK_CATEGORIES = ['Tất cả', 'Võ phục', 'Gym & Fitness', 'Dụng cụ tập', 'Phụ kiện', 'Bóng đá'];
