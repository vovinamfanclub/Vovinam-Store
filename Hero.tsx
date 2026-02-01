
import React from 'react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative h-[90vh] md:h-[95vh] w-full flex items-center overflow-hidden bg-black">
      {/* Background Media - High Quality Lifestyle */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Sports Culture"
          className="w-full h-full object-cover object-center opacity-70"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-left">
        <div className="max-w-3xl">
          <span className="inline-block text-white text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-6 px-4 py-1.5 border border-white/30 rounded-full backdrop-blur-sm">
            Vovinam Fanclub Store
          </span>
          
          <h1 className="text-5xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase italic">
            CHẠY ĐUA <br/>
            <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px white' }}>VỚI ĐAM MÊ</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-xl font-medium mb-10 max-w-lg leading-relaxed uppercase tracking-widest opacity-80">
            Trang bị chính hãng cho cộng đồng <br/> thể thao Việt Nam.
          </p>

          {/* Integrated Modern Search */}
          <div className="max-w-md relative group mb-10">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Tìm sản phẩm của bạn..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-12 py-4 text-sm font-bold text-white tracking-widest placeholder:text-gray-400 focus:outline-none focus:bg-white focus:text-black transition-all shadow-2xl"
              />
              <svg className="w-5 h-5 absolute left-4 text-white group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <a 
              href="#catalog"
              className="px-12 py-5 bg-white text-black font-black text-xs md:text-sm rounded-full transition-all hover:bg-[#EE4D2D] hover:text-white active:scale-95 shadow-2xl uppercase tracking-[0.2em]"
            >
              Mua ngay
            </a>
            <div className="hidden sm:flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
              <span className="w-8 h-[1px] bg-white/30"></span>
              Shopee Mall Verified
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Decor Elements */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
         <div className="text-white/20 text-[120px] font-black tracking-tighter uppercase select-none leading-none rotate-90 origin-bottom-right">
            PREMIUM
         </div>
      </div>
    </section>
  );
};

export default Hero;
