
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
