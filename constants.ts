export interface Product {
  id: string;
  category: string;
  name: string;
  affiliateUrl: string;
  image: string;
  originalPrice: string;
  discountPrice: string;
}

export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZLbaEiyJ-qdZEL5aDliCGwPjwBLsJelGpC2wSZlqgntbBG3ReHcsPB-pSKw68w67Dbe9_D1-vY0A_/pub?output=csv';

export const FALLBACK_CATEGORIES = ['Tất cả', 'Võ phục', 'Gym & Fitness', 'Dụng cụ tập', 'Phụ kiện', 'Bóng đá'];
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  badge: 'Deal hot' | 'Bán chạy' | 'Giảm sâu' | 'Mới';
  affiliateUrl: string;
}

/**
 * Link Google Sheet đã xuất bản dưới dạng CSV.
 */
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZLbaEiyJ-qdZEL5aDliCGwPjwBLsJelGpC2wSZlqgntbBG3ReHcsPB-pSKwCOdqOPrkXLoHApUcW7/pub?gid=0&single=true&output=csv';

// Danh sách các môn thể thao ưu tiên xuất hiện đầu tiên
export const PRIORITY_CATEGORIES = [
  'Vovinam',
  'Pickleball',
  'Bóng đá',
  'Taekwondo',
  'Cầu lông',
  'Gym & Fitness',
  'Yoga',
  'Bóng rổ',
  'Chạy bộ'
];

export const FALLBACK_CATEGORIES = [
  'Tất cả',
  ...PRIORITY_CATEGORIES,
  'Khác'
];

// Bản đồ Icon cho từng môn thể thao
export const CATEGORY_ICONS: Record<string, string> = {
  'Tất cả': '🏆',
  'Vovinam': '🥋',
  'Pickleball': '🏓',
  'Bóng đá': '⚽',
  'Taekwondo': '🥊',
  'Cầu lông': '🏸',
  'Gym & Fitness': '🏋️',
  'Yoga': '🧘',
  'Bóng rổ': '🏀',
  'Chạy bộ': '🏃',
  'Khác': '✨'
};
