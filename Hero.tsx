
import React from 'react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative bg-white pt-10 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-gray-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-10 w-64 h-64 bg-[#005596] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Badge moved UP */}
        <div className="inline-flex items-center space-x-2 bg-blue-50/50 px-4 py-2 rounded-full mb-6 border border-blue-100 shadow-sm animate-bounce-subtle">
          <span className="text-[#005596] text-[10px] md:text-xs font-black tracking-widest uppercase italic flex items-center">
            <span className="mr-1.5">✨</span> VOVINAM FANCLUB STORE
          </span>
        </div>

        {/* New Search Input at the Badge's former position */}
        <div className="max-w-xl mx-auto mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#005596] to-[#EE4D2D] rounded-2xl blur opacity-15 group-focus-within:opacity-25 transition duration-1000"></div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Nhập tên sản phẩm bạn đang tìm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 md:py-5 bg-white border-2 border-gray-100 rounded-2xl text-sm md:text-base font-bold text-gray-900 focus:outline-none focus:border-[#005596] focus:ring-4 focus:ring-blue-50 transition-all shadow-xl shadow-gray-100/50 placeholder:text-gray-300 placeholder:font-medium"
            />
            <svg className="w-5 h-5 md:w-6 md:h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#005596] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
          Trang Bị Các Môn <br/> 
          <span className="text-[#005596] relative">
            Thể Thao Chính Hãng 
            <svg className="absolute -bottom-2 left-0 w-full h-2 text-orange-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span> 
          <span className="text-[#EE4D2D]"> - Giá Tốt</span>
        </h1>
        
        <p className="text-gray-500 text-sm md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed px-4">
          Tổng hợp trang thiết bị thể thao, võ phục, dụng cụ tập luyện <br className="hidden md:block"/> 
          tuyển chọn từ các gian hàng uy tín nhất trên Shopee.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <a 
            href="#catalog"
            className="w-full sm:w-auto px-10 py-4 md:py-5 bg-[#EE4D2D] text-white font-black text-base md:text-lg rounded-2xl shadow-xl shadow-orange-100 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-wider"
          >
            Xem Deal Hot Ngay
          </a>
          <div className="flex items-center space-x-2 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>Link Sản Phẩm Chính Hãng</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
