
import React from 'react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image - Lifestyle Action */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1595152248100-80d407223b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Sports Hero"
          className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 transform hover:scale-105 transition-transform cursor-default">
          <span className="w-2 h-2 bg-[#EE4D2D] rounded-full animate-ping"></span>
          <span className="text-white text-[10px] md:text-xs font-black tracking-[0.3em] uppercase italic">
            VOVINAM FANCLUB STORE
          </span>
        </div>

        {/* Dynamic Search Input - Highlight of the page */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-lg group-focus-within:bg-white/40 transition-all duration-500"></div>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="TÌM KIẾM TRANG BỊ BẠN CẦN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-xl border-0 rounded-2xl px-12 py-5 md:py-6 text-sm md:text-base font-black text-black tracking-widest placeholder:text-gray-400 placeholder:font-bold focus:ring-0 transition-all shadow-2xl"
              />
              <svg className="w-5 h-5 md:w-6 md:h-6 absolute left-4 text-[#005596]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
          LỰA CHỌN <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">HOÀN HẢO</span>
        </h1>
        
        <p className="text-gray-200 text-xs md:text-lg max-w-xl mx-auto mb-12 font-bold uppercase tracking-widest leading-relaxed opacity-90">
          Trang bị chính hãng cho cộng đồng <br className="hidden md:block"/> Vovinam & Thể thao Việt Nam.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="#catalog"
            className="group relative px-12 py-5 bg-white text-black font-black text-xs md:text-sm rounded-full overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-2xl shadow-white/10 uppercase tracking-widest"
          >
            <span className="relative z-10">MUA NGAY</span>
            <svg className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all w-5 h-5 -translate-x-4 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <button className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] hover:text-white transition-colors">
            Khám phá bộ sưu tập mới
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse">
        <span className="text-[8px] text-white font-black uppercase tracking-[0.5em]">Kéo để xem</span>
        <div className="w-0.5 h-12 bg-white rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
