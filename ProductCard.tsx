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
    <div className="reveal h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
        <a 
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col w-full flex-grow"
        >
          {/* Compact Product Image */}
          <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] product-image-container">
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Minimal Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-0.5">
              {product.badge && (
                <div className="bg-[#00BFFF] text-white text-[7px] md:text-[8px] font-bold px-1 py-0.5 uppercase rounded-sm shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>
            
            {discountPercent > 0 && (
              <div className="absolute top-1 right-1 bg-[#EE4D2D] text-white text-[8px] md:text-[9px] font-bold px-1 py-0.5 rounded-sm shadow-sm">
                -{discountPercent}%
              </div>
            )}
          </div>
          
          {/* Compressed Product Information */}
          <div className="p-1.5 md:p-2 flex flex-col flex-grow">
            <h3 className="text-[10px] md:text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1 uppercase tracking-tight h-[2.6em]">
              {product.name}
            </h3>
            
            <div className="mt-auto flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-[12px] md:text-[14px] font-black text-[#EE4D2D]">
                  {hasPrice ? formatPrice(product.discountPrice) : 'LIÊN HỆ'}
                </span>
                {product.originalPrice > product.discountPrice && (
                  <span className="text-[9px] md:text-[10px] text-gray-400 line-through font-medium opacity-60">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </a>
        
        {/* Slimmed Down CTA Button */}
        <div className="px-1.5 pb-2 md:px-2 md:pb-2.5">
          <a 
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 bg-[#0035A0] hover:bg-[#002878] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center justify-center transition-colors shadow-sm"
          >
            LẤY VOUCHER
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
