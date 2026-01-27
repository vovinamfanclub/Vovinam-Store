
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#005596] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center space-x-3 bg-blue-50/50 px-5 py-2.5 rounded-full mb-8 border border-blue-100 shadow-sm">
          <span className="text-[#005596] text-xs md:text-sm font-black tracking-widest uppercase italic">✨ Vovinam Fanclub Store</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
          Trang Bị Các Môn <br/> 
          <span className="text-[#005596] relative">
            Thể Thao Chính Hãng 
            <svg className="absolute -bottom-2 left-0 w-full h-2 text-orange-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span> 
          <span className="text-[#EE4D2D]"> - Giá Tốt</span>
        </h1>
        
        <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Tổng hợp trang thiết bị thể thao, võ phục, dụng cụ tập luyện <br className="hidden md:block"/> 
          tuyển chọn từ các gian hàng uy tín nhất trên Shopee.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#catalog"
            className="w-full sm:w-auto px-12 py-5 bg-[#EE4D2D] text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-wider"
          >
            Xem Deal Hot Ngay
          </a>
          <div className="flex items-center space-x-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>Link Sản Phẩm Chính Hãng</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
