
import React from 'react';
import { Product } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const hasPrice = product.discountPrice > 0;
  const discountPercent = hasPrice && product.originalPrice > product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555597673-b21d5c935865';
          }}
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
          {product.badge || 'Mới'}
        </div>
      </div>
      
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <span className="text-[8px] md:text-[9px] font-black text-[#005596] uppercase tracking-widest mb-1 block">
            {product.category}
          </span>
          <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-tight group-hover:text-[#005596] transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-auto">
          {hasPrice ? (
            <div className="flex flex-col mb-4">
              {product.originalPrice > product.discountPrice && (
                <span className="text-[9px] text-gray-400 line-through font-bold mb-0.5">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-sm md:text-base font-black text-[#EE4D2D]">
                {formatPrice(product.discountPrice)}
              </span>
            </div>
          ) : (
            <div className="mb-4">
               <span className="text-[10px] text-gray-400 font-bold italic">Giá tốt tại Shopee</span>
            </div>
          )}
          
          <a 
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 bg-gray-900 text-white font-black text-[10px] md:text-xs rounded-xl hover:bg-[#EE4D2D] transition-all transform active:scale-95 uppercase tracking-widest shadow-md hover:shadow-orange-200"
          >
            Mua Ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
