
import React from 'react';
import { Product } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
  };

  const hasPrice = product.discountPrice > 0;
  const discountPercent = hasPrice && product.originalPrice > product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <a 
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col w-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Overlay Action Button on Mobile/Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
           <div className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest text-center shadow-2xl">
              Xem chi tiết
           </div>
        </div>

        {/* Badges */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#EE4D2D] text-white text-[10px] font-black px-2 py-1 rounded-sm shadow-sm">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/10 backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest">
          {product.category}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col px-1">
        <h3 className="text-[12px] md:text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-[#005596] transition-colors uppercase tracking-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-[14px] md:text-[16px] font-black text-[#EE4D2D]">
            {hasPrice ? formatPrice(product.discountPrice) : 'Liên hệ'}
          </span>
          {product.originalPrice > product.discountPrice && (
            <span className="text-[11px] md:text-[12px] text-gray-400 line-through font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Quick View Tag (Coolmate style) */}
        <div className="mt-3 flex gap-1">
           <div className="w-2.5 h-2.5 rounded-full bg-[#005596] border border-gray-200"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-black border border-gray-200"></div>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
