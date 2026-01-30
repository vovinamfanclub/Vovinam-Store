
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Benefits from './components/Benefits';
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
      {/* Header / Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-2 md:px-4 h-16 md:h-20 flex items-center gap-2 md:gap-4">
          
          {/* Logo - Compact Icon Circle for Mobile */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#005596] rounded-full flex items-center justify-center text-white font-black shadow-md shadow-blue-100 text-lg md:text-2xl transform active:scale-95 transition-transform">
              V
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm md:text-xl font-black tracking-tight leading-none uppercase">
                Vovinam<span className="text-[#EE4D2D]">Store</span>
              </span>
              <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Trang bị chính hãng
              </span>
            </div>
          </div>

          {/* Search Bar - Optimized for Mobile Header */}
          <div className="flex-grow relative group min-w-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Bạn tìm sản phẩm gì?..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:pl-11 pr-9 py-2.5 md:py-3.5 bg-gray-100/80 border-0 rounded-full md:rounded-2xl text-[12px] md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#005596]/10 focus:bg-white focus:shadow-sm transition-all placeholder:text-gray-400 placeholder:font-medium"
              />
              {/* Search Icon */}
              <svg className="w-4 h-4 md:w-5 md:h-5 absolute left-3 md:left-4 text-gray-400 group-focus-within:text-[#005596] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              
              {/* Clear Search Button */}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 md:right-3 p-1.5 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Refresh Button - Minimalist for Mobile */}
          <button 
            onClick={fetchSheetData} 
            className="p-2 md:p-3 text-gray-400 hover:bg-gray-100 hover:text-[#005596] rounded-full transition-all shrink-0 active:rotate-180 duration-500"
            title="Làm mới deal"
          >
            <svg className={`w-5 h-5 md:w-6 md:h-6 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero />
        
        {/* Catalog Section */}
        <section id="catalog" className="py-8 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            
            {/* Catalog Header & Filters */}
            <div className="mb-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Săn Deal Hot</h2>
                  <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#EE4D2D] mr-2 animate-pulse"></span>
                    Tìm thấy {filteredAndSortedProducts.length} trang bị
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-gray-400 hidden md:block">Ưu tiên:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="flex-grow md:flex-none px-4 py-3 bg-white border border-gray-100 rounded-xl text-[11px] font-black shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005596]/5 cursor-pointer uppercase tracking-wider"
                  >
                    <option value="newest">🔥 Mới Nhất</option>
                    <option value="price-asc">💸 Giá Tốt Nhất</option>
                    <option value="price-desc">💎 Cao Cấp</option>
                  </select>
                </div>
              </div>

              {/* Categories Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-[10px] md:text-[11px] font-black whitespace-nowrap transition-all border-2 shadow-sm uppercase tracking-widest ${
                      activeCategory === cat 
                        ? 'bg-[#005596] text-white border-[#005596] scale-105 z-10' 
                        : 'bg-white text-gray-500 border-white hover:border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{CATEGORY_ICONS[cat] || '🥋'}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 fade-in">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-gray-800">Không có kết quả</h3>
                <p className="text-gray-400 text-sm mt-1 px-4">Không tìm thấy sản phẩm "{searchQuery}" trong danh mục này.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('Tất cả');}}
                  className="mt-6 px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors uppercase text-[10px] tracking-widest shadow-md"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </div>
        </section>

        <Benefits />
      </main>

      <footer className="bg-white border-t border-gray-100 py-10 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 bg-[#005596] rounded-full flex items-center justify-center text-white font-black">V</div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">© 2024 VovinamStore • Săn Deal Shopee</p>
             <p className="text-[9px] text-gray-300 max-w-xs mx-auto leading-relaxed">Kết nối cộng đồng yêu thể thao với những sản phẩm chất lượng và giá tốt nhất từ các gian hàng uy tín.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
