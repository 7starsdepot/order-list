import React from 'react';
import { Package, ShoppingCart, Check } from 'lucide-react';

interface MetricCardsProps {
  totalItemsInStock?: number;
  totalValueInStock?: string;
  ongoingOrders?: number;
  completedOrders?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalItemsInStock = 245,
  totalValueInStock = '₱12,860',
  ongoingOrders = 8,
  completedOrders = 15,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Items in Stock */}
      <div className="bg-[#EBF3FF] rounded-2xl p-4 border border-[#D5E5FF] flex items-center gap-4 shadow-2xs hover:shadow-xs transition">
        {/* 3D Blue Box Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 transform -rotate-3">
          <Package className="w-7 h-7 text-white stroke-[2.2]" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {totalItemsInStock}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Total Items in Stock
          </div>
        </div>
      </div>

      {/* 2. Total Value in Stock */}
      <div className="bg-[#E8F8F0] rounded-2xl p-4 border border-[#CDEEDC] flex items-center gap-4 shadow-2xs hover:shadow-xs transition">
        {/* 3D Green Coin Icon with Peso Symbol */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#34D399] via-[#059669] to-[#047857] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0 font-bold text-2xl font-mono">
          ₱
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
            {totalValueInStock}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Total Value in Stock
          </div>
        </div>
      </div>

      {/* 3. Ongoing Orders */}
      <div className="bg-[#FFF3E6] rounded-2xl p-4 border border-[#FDE3CA] flex items-center gap-4 shadow-2xs hover:shadow-xs transition">
        {/* Orange Shopping Cart Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB923C] via-[#EA580C] to-[#C2410C] flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
          <ShoppingCart className="w-7 h-7 text-white stroke-[2.2]" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {ongoingOrders}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Ongoing Orders
          </div>
        </div>
      </div>

      {/* 4. Completed Orders */}
      <div className="bg-[#F3E8FF] rounded-2xl p-4 border border-[#E7D3FB] flex items-center gap-4 shadow-2xs hover:shadow-xs transition">
        {/* Purple Check Circle Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A855F7] via-[#7E22CE] to-[#6B21A8] flex items-center justify-center text-white shadow-md shadow-purple-500/25 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white text-[#7E22CE] flex items-center justify-center shadow-xs">
            <Check className="w-5 h-5 stroke-[3.5]" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {completedOrders}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Completed Orders
          </div>
        </div>
      </div>

    </div>
  );
};
