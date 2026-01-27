
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

export const FALLBACK_CATEGORIES = ['Tất cả', 'Võ phục', 'Gym & Fitness', 'Dụng cụ tập', 'Phụ kiện', 'Bóng đá'];
