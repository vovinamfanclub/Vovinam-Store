import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import ProductCard from './ProductCard';
import Benefits from './Benefits';
import { Product, SHEET_CSV_URL, FALLBACK_CATEGORIES } from './constants';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-xl p-1.5 space-y-2 shadow-sm border border-gray-100">
    <div className="aspect-square skeleton rounded-lg"></div>
    <div className="h-2.5 w-3/4 skeleton rounded"></div>
    <div className="h-2.5 w-full skeleton rounded"></div>
    <div className="h-3 w-1/2 skeleton rounded"></div>
    <div className="h-7 w-full skeleton rounded"></div>
  </div>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('TẤT CẢ');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      const windowHeight = window.innerHeight;
      const revealPoint = 100;

      reveals.forEach((el) => {
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add("active");
        }
      });

      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add("is-sticky");
        } else {
          header.classList.remove("is-sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, products, activeCategory, searchQuery]);

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
      if (!response.ok) throw new Error('Failed to load data.');
      
      const csvText = await response.text();
      const dataRows = parseCSV(csvText);
      const contentRows = dataRows.slice(1).filter(row => row[1]?.trim());
      
      const parsedProducts: Product[] = contentRows.map((row, index) => ({
        id: `sp-${index}`,
        category: row[0]?.trim()?.toUpperCase() || 'KHÁC',
        name: row[1]?.trim() || 'Sản phẩm',
        affiliateUrl: row[2]?.trim()?.startsWith('http') ? row[2].trim() : `https://${row[2]?.trim() || 'shopee.vn'}`,
        image: fixImageUrl(row[3]),
        originalPrice: parseInt(row[4]?.toString().replace(/\D/g, '') || '0'),
        discountPrice: parseInt(row[5]?.toString().replace(/\D/g, '') || '0'),
        badge: (row[6] as any) || 'Mới'
      }));

      setProducts(parsedProducts);
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
    if (activeCategory !== 'TẤT CẢ') {
      result = result.filter(p => p.category.includes(activeCategory) || activeCategory.includes(p.category));
    }
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
      <header className="sticky top-0 z-[110] bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="shrink-0 cursor-pointer flex items-center gap-2 group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-white font-black text-xl group-hover:bg-[#005596] transition-colors">V</div>
            <span className="hidden sm:inline font-black tracking-tighter text-lg uppercase">VOVINAM<span className="text-[#005596]">STORE</span></span>
          </div>

          <div className="flex-grow max-w-xl relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             </div>
             <input 
               type="text" 
               placeholder="Tìm kiếm sản phẩm..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-[#f3f4f6] border-0 rounded-full py-2.5 pl-11 pr-5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all duration-300"
             />
          </div>

          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            <button className="hidden sm:flex p-2 text-gray-800 hover:text-[#005596] transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
            <button className="p-2 text-gray-800 hover:text-[#005596] transition-colors relative">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
               <span className="absolute top-1.5 right-1 w-4 h-4 bg-[#EE4D2D] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">0</span>
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-16 md:top-20 z-[100] bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {setActiveCategory(cat); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });}}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all duration-300 transform active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-[#f3f4f6] text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main>
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <section id="catalog" className="py-8 md:py-16 scroll-mt-40 bg-gray-50/50">
          <div className="container mx-auto px-2 md:px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="reveal active">
                <h2 className="text-xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                  {activeCategory === 'TẤT CẢ' ? 'DANH MỤC' : activeCategory}
                </h2>
                <div className="h-1 w-12 bg-black mt-3"></div>
              </div>

              <div className="flex items-center gap-2 border-b border-black/10 pb-1.5 reveal active">
                <span className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 tracking-wider">Sắp xếp:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-[9px] md:text-[10px] font-bold uppercase focus:outline-none cursor-pointer"
                >
                  <option value="newest">Sản phẩm mới</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                {[...Array(15)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-2xl reveal active border border-gray-100">
                 <p className="text-gray-400 font-bold uppercase tracking-wider text-xs italic">Không tìm thấy sản phẩm nào phù hợp</p>
                 <button onClick={() => {setActiveCategory('TẤT CẢ'); setSearchQuery('');}} className="mt-6 px-8 py-3 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-[#005596] transition-all rounded-md shadow-lg">Làm mới bộ lọc</button>
              </div>
            )}
          </div>
        </section>

        <Benefits />
      </main>

      <footer className="bg-black text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6 block italic">VOVINAMSTORE</span>
              <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest max-w-sm opacity-60">
                Nền tảng trang thiết bị thể thao chất lượng cho cộng đồng võ đạo Việt Nam. Đam mê trong từng sợi vải.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-2">DỊCH VỤ</h4>
              <div className="flex flex-col gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Vận chuyển siêu tốc</a>
                <a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a>
                <a href="#" className="hover:text-white transition-colors">Tích điểm thành viên</a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-2">FOLLOW US</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all text-xs font-bold">FB</a>
                <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all text-xs font-bold">IG</a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-center">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em] opacity-40">© 2024 VOVINAMSTORE • POWERED BY FANCLUB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
