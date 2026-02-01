
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import ProductCard from './ProductCard';
import Benefits from './Benefits';
import { Product, SHEET_CSV_URL, FALLBACK_CATEGORIES, PRIORITY_CATEGORIES, CATEGORY_ICONS } from './constants';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SkeletonCard = () => (
  <div className="w-full space-y-4">
    <div className="aspect-[3/4] skeleton"></div>
    <div className="h-4 w-1/4 skeleton rounded"></div>
    <div className="h-5 w-3/4 skeleton rounded"></div>
    <div className="h-6 w-1/2 skeleton rounded"></div>
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
      if (!response.ok) throw new Error('Failed to load data.');
      
      const csvText = await response.text();
      const dataRows = parseCSV(csvText);
      const contentRows = dataRows.slice(1).filter(row => row[1]?.trim());
      
      const parsedProducts: Product[] = contentRows.map((row, index) => ({
        id: `sp-${index}`,
        category: row[0]?.trim() || 'Khác',
        name: row[1]?.trim() || 'Sản phẩm',
        affiliateUrl: row[2]?.trim()?.startsWith('http') ? row[2].trim() : `https://${row[2]?.trim() || 'shopee.vn'}`,
        image: fixImageUrl(row[3]),
        originalPrice: parseInt(row[4]?.toString().replace(/\D/g, '') || '0'),
        discountPrice: parseInt(row[5]?.toString().replace(/\D/g, '') || '0'),
        badge: 'Mới'
      }));

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
    <div className="min-h-screen flex flex-col">
      {/* Coolmate-style Minimal Header */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100 h-16 md:h-20 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <span className="text-xl font-black tracking-tighter uppercase">VOVINAM<span className="text-[#EE4D2D]">STORE</span></span>
            </div>
            
            {/* Nav Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8">
               {['MỚI', 'BÁN CHẠY', 'SALE'].map(link => (
                 <button key={link} className={`text-[11px] font-black uppercase tracking-[0.2em] hover:text-[#005596] transition-colors ${link === 'SALE' ? 'text-[#EE4D2D]' : ''}`}>
                   {link}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block p-2 text-gray-400 hover:text-black transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
               <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <button onClick={fetchSheetData} className="p-2 text-gray-400 hover:text-black transition-all">
               <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Catalog Content */}
        <section id="catalog" className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-4">Danh mục</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-b-2 border-black py-2 text-xs font-black uppercase tracking-widest focus:outline-none"
              >
                <option value="newest">Sản phẩm mới</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>

            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-20 fade-in">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Benefits />
      </main>

      <footer className="bg-black text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-black tracking-tighter uppercase mb-8 block">VOVINAMSTORE</span>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed uppercase tracking-widest font-medium">Đối tác cung cấp trang bị thể thao chuyên nghiệp cho cộng đồng Vovinam Việt Nam.</p>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-white">Chính sách</h4>
              <ul className="space-y-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Vận chuyển</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Đổi trả</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảo mật</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-white">Kết nối</h4>
              <ul className="space-y-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shopee Mall</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em]">© 2024 VOVINAMSTORE. PHÁT TRIỂN BỞI VOVINAM FANCLUB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
