
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import ProductCard from './ProductCard';
import Benefits from './Benefits';
import { Product, SHEET_CSV_URL, FALLBACK_CATEGORIES, PRIORITY_CATEGORIES, CATEGORY_ICONS } from './constants';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
    <div className="aspect-[4/5] skeleton"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 w-3/4 skeleton rounded"></div>
      <div className="h-3 w-1/2 skeleton rounded"></div>
      <div className="h-6 w-1/2 skeleton rounded mt-4"></div>
      <div className="h-10 w-full skeleton rounded-xl mt-4"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);

  const fixImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1555597673-b21d5c935865';
    const trimmedUrl = url.trim();
    if (trimmedUrl.includes('drive.google.com')) {
      const idMatch = trimmedUrl.match(/[-\w]{25,}/);
      if (idMatch) return `https://drive.google.com/uc?export=download&id=${idMatch[0]}`;
    }
    return trimmedUrl;
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    return lines.map(line => {
      const result = [];
      let cur = '';
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          result.push(cur);
          cur = '';
        } else {
          cur += char;
        }
      }
      result.push(cur);
      return result;
    });
  };

  const fetchSheetData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SHEET_CSV_URL}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Không thể tải dữ liệu.');
      
      const csvText = await response.text();
      const dataRows = parseCSV(csvText);
      // Cấu trúc sheet mới của bạn:
      // A(0): Hạng mục, B(1): Tên SP, C(2): Link Affiliate, D(3): Ảnh Affiliate, E(4): Giá gốc, F(5): Giá ưu đãi
      const contentRows = dataRows.slice(1).filter(row => row[1]?.trim());
      
      const parsedProducts: Product[] = contentRows.map((row, index) => {
        const originalPriceStr = row[4]?.toString().replace(/\D/g, '') || '0';
        const discountPriceStr = row[5]?.toString().replace(/\D/g, '') || '0';
        
        return {
          id: `sp-${index}`,
          category: row[0]?.trim() || 'Khác',
          name: row[1]?.trim() || 'Sản phẩm',
          affiliateUrl: row[2]?.trim()?.startsWith('http') ? row[2].trim() : `https://${row[2]?.trim() || 'shopee.vn'}`,
          image: fixImageUrl(row[3]),
          originalPrice: parseInt(originalPriceStr),
          discountPrice: parseInt(discountPriceStr),
          badge: 'Mới'
        };
      });

      setProducts(parsedProducts);
      
      const uniqueSheetCats = [...new Set(parsedProducts.map(p => p.category))];
      const priorityInSheet = PRIORITY_CATEGORIES.filter(cat => uniqueSheetCats.includes(cat));
      const remainingCats = uniqueSheetCats
        .filter(cat => !PRIORITY_CATEGORIES.includes(cat))
        .sort((a, b) => a.localeCompare(b, 'vi'));
      
      setCategories(['Tất cả', ...priorityInSheet, ...remainingCats]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'Tất cả') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortBy === 'price-desc') result.sort((a, b) => b.discountPrice - a.discountPrice);
    return result;
  }, [activeCategory, searchQuery, sortBy, products]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <nav className="sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 md:w-11 md:h-11 bg-[#005596] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 text-xl md:text-2xl">V</div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight leading-none uppercase">Vovinam<span className="text-[#EE4D2D]">Store</span></span>
              <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Trang bị chính hãng</span>
            </div>
          </div>
          <div className="hidden lg:flex flex-grow max-w-lg relative group">
            <input 
              type="text" 
              placeholder="Bạn đang tìm gì..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005596]/10 focus:bg-white transition-all"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#005596]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <button onClick={fetchSheetData} className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero />
        <section id="catalog" className="py-12 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Sảnh Thể Thao</h2>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-2 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005596] mr-2"></span>
                    Sẵn có {filteredAndSortedProducts.length} deal tốt
                  </p>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-black shadow-sm focus:outline-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="newest">🔥 Mới Nhất</option>
                  <option value="price-asc">💸 Giá: Thấp - Cao</option>
                  <option value="price-desc">💎 Giá: Cao - Thấp</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center space-x-2 px-6 py-4 rounded-2xl text-[10px] md:text-[11px] font-black whitespace-nowrap transition-all border-2 shadow-sm uppercase tracking-widest ${
                      activeCategory === cat ? 'bg-[#005596] text-white border-[#005596]' : 'bg-white text-gray-500 border-white hover:border-gray-200'
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat] || '🥋'}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 fade-in">
                {filteredAndSortedProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>
        <Benefits />
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">© 2024 VovinamStore</p>
      </footer>
    </div>
  );
};

export default App;
