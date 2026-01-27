
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import ProductCard from './ProductCard';
import Benefits from './Benefits';
import { Product, SHEET_CSV_URL, FALLBACK_CATEGORIES } from './constants';

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
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

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
      const contentRows = dataRows.slice(1).filter(row => row.length >= 2 && row[1]);
      
      const parsedProducts: Product[] = contentRows.map((row, index) => ({
        id: row[0]?.trim() || `sp-${index}`,
        name: row[1]?.trim() || 'Sản phẩm đang cập nhật',
        category: row[2]?.trim() || 'Khác',
        image: row[3]?.trim() || 'https://images.unsplash.com/photo-1555597673-b21d5c935865',
        originalPrice: parseInt(row[4]?.toString().replace(/\D/g, '') || '0'),
        discountPrice: parseInt(row[5]?.toString().replace(/\D/g, '') || '0'),
        badge: (row[6]?.trim() as any) || 'Mới',
        affiliateUrl: row[7]?.trim() || 'https://shopee.vn'
      }));

      setProducts(parsedProducts);
      const uniqueCategories = ['Tất cả', ...new Set(parsedProducts.map(p => p.category))];
      setCategories(uniqueCategories);
      const now = new Date();
      setLastUpdated(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối máy chủ...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 600000); // 10 phút cập nhật 1 lần
    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'Tất cả') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      default:
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, products]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* TOP BAR */}
      <div className="bg-[#005596] text-white py-2 hidden sm:block relative z-[60]">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.1em]">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Liên hệ: 0933 229 882
            </span>
            <span className="flex items-center text-blue-200">
               <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></div>
               Đang trực tuyến
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.facebook.com/share/1CwwBidyXq/?mibextid=wwXIfr" target="_blank" className="hover:text-orange-300 transition-colors">Facebook</a>
            <a href="https://www.youtube.com/@vovinamvn?si=mBaWWEOMmXwoZkbj" target="_blank" className="hover:text-orange-300 transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* STICKY NAVBAR */}
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
              placeholder="Tìm kiếm trang bị thể thao..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005596]/10 focus:bg-white transition-all"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#005596]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchSheetData}
              className={`p-3 rounded-xl transition-all ${loading ? 'text-[#005596] bg-blue-50' : 'text-gray-400 hover:bg-gray-100 active:scale-90'}`}
              title="Làm mới deal"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <a href="#catalog" className="md:hidden p-3 text-gray-400 active:scale-90">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero />

        <section id="catalog" className="py-12 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">Săn Deal Ngay</h2>
                  <div className="flex items-center text-gray-400 text-sm font-bold uppercase tracking-wider">
                     <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                     Dữ liệu trực tiếp: {lastUpdated || 'Đang kết nối...'}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                   <div className="lg:hidden relative">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>

                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none appearance-none cursor-pointer pr-10 relative"
                  >
                    <option value="newest">Cập nhật mới nhất</option>
                    <option value="price-asc">Giá: Thấp tới Cao</option>
                    <option value="price-desc">Giá: Cao tới Thấp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[10px] md:text-[11px] font-black whitespace-nowrap transition-all duration-300 uppercase tracking-widest border-2 ${
                      activeCategory === cat 
                        ? 'bg-[#005596] text-white border-[#005596] shadow-xl shadow-blue-100' 
                        : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200 fade-in">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-400 text-sm mb-6">Hãy thử đổi từ khóa hoặc danh mục khác.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('Tất cả');}}
                  className="px-6 py-3 bg-[#005596] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 fade-in">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Benefits />
      </main>

      <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#005596] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 text-xl">V</div>
                <span className="text-xl font-black tracking-tighter uppercase">Vovinam<span className="text-[#EE4D2D]">Store</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-sm">
                Chúng tôi tổng hợp và đánh giá các trang thiết bị thể thao tốt nhất từ Shopee, giúp bạn tiết kiệm thời gian và chi phí tập luyện.
              </p>
            </div>
            
            <div className="md:pl-12">
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Cần hỗ trợ?</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-bold">
                <li><a href="tel:0933229882" className="hover:text-[#005596] transition-colors flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  0933 229 882
                </a></li>
                <li><a href="mailto:vovinamfanclub@gmail.com" className="hover:text-[#005596] transition-colors flex items-center">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                   </div>
                   vovinamfanclub@gmail.com
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-gray-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Cộng đồng</h4>
              <div className="flex space-x-3 mb-10">
                <a href="https://www.facebook.com/share/1CwwBidyXq/?mibextid=wwXIfr" target="_blank" className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#005596] hover:text-white transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com/@vovinamvn?si=mBaWWEOMmXwoZkbj" target="_blank" className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#EE4D2D] hover:text-white transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-loose">
                 © 2024 VovinamStore • Phát triển vì sự nghiệp thể thao & võ thuật
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
