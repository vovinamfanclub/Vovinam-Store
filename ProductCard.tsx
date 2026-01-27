
import React from 'react';
import { Product } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Deal hot': return 'bg-red-500';
      case 'Giảm sâu': return 'bg-orange-600';
      case 'Bán chạy': return 'bg-blue-600';
      default: return 'bg-green-600';
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this deal: ${product.name} - Only ${formatPrice(product.discountPrice)}!`,
        url: product.affiliateUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(product.affiliateUrl);
      alert('Đã copy link sản phẩm!');
    }
  };

  const discountPercent = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-[#005596]/10 transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full relative">
      {/* Discount Tag Floating */}
      {discountPercent > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-[#FFD700] text-gray-900 font-black text-[10px] px-2 py-1 rounded-lg shadow-sm">
          -{discountPercent}%
        </div>
      )}

      {/* Share Button Floating */}
      <button 
        onClick={handleShare}
        className="absolute bottom-[11.5rem] right-4 z-10 p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-full text-gray-400 hover:text-[#005596] transition-colors border border-gray-100 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
        title="Chia sẻ sản phẩm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
      </button>

      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-lg ${getBadgeColor(product.badge)}`}>
          {product.badge}
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex-grow">
           <span className="text-[10px] font-bold text-[#005596] uppercase tracking-wider mb-2 block">{product.category}</span>
           <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-4 group-hover:text-[#005596] transition-colors leading-snug">
             {product.name}
           </h3>
        </div>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-5">
            <span className="text-[10px] md:text-xs text-gray-400 line-through font-bold mb-1 italic">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-lg md:text-xl font-black text-[#EE4D2D] tracking-tighter">
              {formatPrice(product.discountPrice)}
            </span>
          </div>
          
          <a 
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3.5 bg-gray-900 text-white font-black text-xs md:text-sm rounded-2xl hover:bg-[#EE4D2D] transition-all active:scale-95 transform shadow-lg shadow-gray-200 hover:shadow-orange-200 uppercase tracking-widest"
          >
            Mua Tại Shopee
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
