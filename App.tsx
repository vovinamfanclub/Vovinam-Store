
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Benefits from './components/Benefits';
import { Product, SHEET_CSV_URL, FALLBACK_CATEGORIES, PRIORITY_CATEGORIES, CATEGORY_ICONS } from './constants';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
    <div className="aspect-[3/4] skeleton"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 skeleton rounded"></div>
      <div className="h-3 w-1/2 skeleton rounded"></div>
      <div className="h-6 w-1/2 skeleton rounded mt-4"></div>
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
    if (!url) return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438';
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
      const remainingCats = uniqueSheetCats.filter(cat => !PRIORITY_CATEGORIES.includes(cat)).sort((a, b) => a.localeCompare(b, 'vi'));
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Promo Bar */}
      <div className="bg-black text-white text-[10px] md:text-xs py-2 text-center font-bold tracking-widest uppercase">
        Săn Deal chính hãng - Giảm tới 50% cho thành viên Vovinam
      </div>

      {/* Header - Coolmate Style */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          
          {/* Logo Left */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#005596] rounded flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">V</div>
            <div className="hidden lg:block">
              <span className="text-lg font-black tracking-tighter uppercase leading-none block">VOVINAM<span className="text-[#EE4D2D]">STORE</span></span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Premium Gear</span>
            </div>
          </div>

          {/* Nav Links Center */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => {setSearchQuery(''); setActiveCategory('Tất cả');}} className="text-xs font-black uppercase tracking-widest hover:text-[#005596] transition-colors">Mới</button>
            <button className="text-xs font-black uppercase tracking-widest hover:text-[#005596] transition-colors">Bán Chạy</button>
            <button onClick={() => setActiveCategory('Vovinam')} className="text-xs font-black uppercase tracking-widest hover:text-[#005596] transition-colors">Vovinam</button>
            <button onClick={() => setActiveCategory('AFL')} className="text-xs font-black uppercase tracking-widest hover:text-[#005596] transition-colors">AFL</button>
            <button className="text-xs font-black uppercase tracking-widest text-[#EE4D2D] flex items-center gap-1">
              SALE
              <span className="inline-block w-1.5 h-1.5 bg-[#EE4D2D] rounded-full animate-pulse"></span>
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-[#005596] transition-colors">
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#EE4D2D] transition-colors relative">
               <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
               <span className="absolute top-1 right-1 w-4 h-4 bg-[#EE4D2D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <button onClick={fetchSheetData} className="md:hidden p-2 text-gray-400">
               <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Catalog Section */}
        <section id="catalog" className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            
            {/* Catalog Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">SẢNH THỂ THAO</h2>
              
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 fade-in">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {filteredAndSortedProducts.length === 0 && !loading && (
              <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-[#005596] font-black underline uppercase text-xs">Xóa tìm kiếm</button>
              </div>
            )}
          </div>
        </section>

        <Benefits />
      </main>

      <footer className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-black font-black text-2xl mb-6 mx-auto md:mx-0">V</div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Đối tác cung cấp trang bị thể thao chính hãng và tin cậy cho cộng đồng Vovinam và người yêu thể thao Việt Nam.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest mb-2">Hỗ trợ khách hàng</h4>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Hướng dẫn mua hàng</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Chính sách đổi trả</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Bảo mật thông tin</a>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6">Kết nối với chúng tôi</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#005596] transition-colors cursor-pointer">F</div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#EE4D2D] transition-colors cursor-pointer">S</div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">T</div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-gray-800 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">© 2024 VOVINAMSTORE. PHÁT TRIỂN BỞI VOVINAM FANCLUB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
