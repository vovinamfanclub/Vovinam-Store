import React from 'react';
import { Product } from './constants';

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
          className="group relative flex flex-col w-full h-full"
        >
          {/* Top 50% - Image Section */}
          <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] product-image-container flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* BEST SELLER Badge - Blue background */}
            <div className="absolute top-0 left-0 bg-[#005596] text-white text-[7px] md:text-[9px] font-black px-2 py-1 uppercase rounded-br-md shadow-sm z-10">
              BEST SELLER
            </div>
            
            {/* Discount Percent */}
            {discountPercent > 0 && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-sm">
                -{discountPercent}%
              </div>
            )}
          </div>
          
          {/* Bottom 50% - Information Section */}
          <div className="p-2 md:p-3 flex flex-col flex-grow bg-white border-t border-gray-50">
            <h3 className="text-[10px] md:text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight mb-2 uppercase tracking-tight h-[2.6em]">
              {product.name}
            </h3>
            
            <p className="text-[8px] md:text-[10px] text-gray-400 italic mb-2 line-clamp-1 opacity-70">
              Sản phẩm chất lượng cao cho tập luyện...
            </p>
            
            <div className="mt-auto">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[13px] md:text-[15px] font-black text-[#EE4D2D]">
                  {hasPrice ? formatPrice(product.discountPrice) : 'LIÊN HỆ'}
                </span>
                {product.originalPrice > product.discountPrice && (
                  <span className="text-[9px] md:text-[10px] text-gray-400 line-through font-medium opacity-50">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </a>
        
        {/* Blue CTA Button - Updated from Red to Blue per request */}
        <div className="px-2 pb-3">
          <a 
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-[#005596] hover:bg-[#004172] text-white text-[9px] md:text-[11px] font-bold uppercase tracking-wider rounded-md flex items-center justify-center transition-colors shadow-sm"
          >
            LẤY VOUCHER ƯU ĐÃI
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
