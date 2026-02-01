
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
      className="group product-card relative flex flex-col w-full"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7] product-image-container mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        
        {/* Quick Buy Overlay (Coolmate Style) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
           <div className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
              Xem sản phẩm
           </div>
        </div>

        {/* Floating Tags */}
        {discountPercent > 0 && (
          <div className="absolute top-0 left-0 bg-[#EE4D2D] text-white text-[10px] font-black px-3 py-1.5">
            -{discountPercent}%
          </div>
        )}
        
        {product.badge && (
          <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-widest border-b border-l border-gray-100">
            {product.badge}
          </div>
        )}
      </div>
      
      {/* Product Information */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start gap-2">
           <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
             {product.category}
           </span>
        </div>
        
        <h3 className="text-[13px] md:text-[14px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#005596] transition-colors uppercase tracking-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[15px] md:text-[17px] font-black text-[#EE4D2D]">
            {hasPrice ? formatPrice(product.discountPrice) : 'Liên hệ'}
          </span>
          {product.originalPrice > product.discountPrice && (
            <span className="text-[12px] text-gray-400 line-through font-medium opacity-60">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
