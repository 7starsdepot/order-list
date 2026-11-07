import React, { useState } from 'react';
import { 
  Package, 
  Tag, 
  ShoppingCart, 
  Truck, 
  ArrowRight, 
  Check, 
  Info, 
  GripVertical,
  Boxes,
  Sparkles
} from 'lucide-react';
import { OrderStage, SupplyOrder, CardBadgeType } from '../types/order';
import { getBadgeStyle } from '../utils/orderUtils';

interface OrderProcessingFlowProps {
  orders: SupplyOrder[];
  selectedOrderId: string | null;
  onSelectOrder: (order: SupplyOrder) => void;
  onMoveOrder: (orderId: string, targetStage: OrderStage) => void;
  onOrderCompleted?: (orderId: string) => void;
}

export const OrderProcessingFlow: React.FC<OrderProcessingFlowProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onMoveOrder,
  onOrderCompleted,
}) => {
  const [dragEnabled, setDragEnabled] = useState(true);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStage | null>(null);

  // Group orders by currentStage
  const stage1Orders = orders.filter((o) => o.currentStage === 'STOCKS_AVAILABLE');
  const stage2Orders = orders.filter((o) => o.currentStage === 'PRICING');
  const stage3Orders = orders.filter((o) => o.currentStage === 'PURCHASING');
  const stage4Orders = orders.filter((o) => o.currentStage === 'READY_FOR_DELIVERY');

  const handleDragStart = (e: React.DragEvent, order: SupplyOrder) => {
    if (!dragEnabled) return;
    setDraggedOrderId(order.id);
    e.dataTransfer.setData('text/plain', order.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedOrderId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: OrderStage) => {
    if (!dragEnabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== stage) {
      setDragOverColumn(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: OrderStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId) {
      onMoveOrder(orderId, targetStage);
    }
    setDraggedOrderId(null);
  };

  const handleDropCompleted = (e: React.DragEvent) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId && onOrderCompleted) {
      onOrderCompleted(orderId);
    }
    setDraggedOrderId(null);
    setDragOverColumn(null);
  };

  // Helper for rendering an individual card
  const renderCard = (order: SupplyOrder, isGhost = false, overrideBadge?: string) => {
    const isSelected = selectedOrderId === order.id;
    const badgeStyle = getBadgeStyle(overrideBadge || order.badgeText);

    return (
      <div
        key={order.id}
        draggable={dragEnabled}
        onDragStart={(e) => handleDragStart(e, order)}
        onDragEnd={handleDragEnd}
        onClick={() => onSelectOrder(order)}
        className={`bg-white rounded-xl p-3 border transition-all duration-200 select-none relative group ${
          isSelected
            ? 'ring-2 ring-[#2563EB] border-blue-400 shadow-md'
            : 'border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
        } ${dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${
          isGhost ? 'opacity-40 scale-95' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-extrabold text-xs text-slate-900 tracking-tight font-sans">
            {order.orderNumber}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border || 'border-transparent'}`}
          >
            {overrideBadge || order.badgeText}
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-800 line-clamp-1">
          {order.itemName}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-0.5">
          <span>{order.quantityDisplay}</span>
          <span className="text-slate-300 group-hover:text-slate-500 transition">
            <GripVertical className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  };

  const draggedOrder = orders.find((o) => o.id === draggedOrderId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Dark Navy Header Strip */}
      <div className="bg-[#0A1628] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#1D6FEB] flex items-center justify-center text-white shadow-xs">
            <Boxes className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-bold tracking-tight">
            Order Processing Flow
          </h2>
        </div>

        {/* Drag & Drop Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-200 font-semibold hidden sm:inline">
            Drag & Drop Orders
          </span>
          
          <button
            onClick={() => setDragEnabled(!dragEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              dragEnabled ? 'bg-[#10B981]' : 'bg-slate-600'
            }`}
            title={dragEnabled ? 'Drag & Drop is ON' : 'Drag & Drop is OFF'}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                dragEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <span
            className="text-slate-400 hover:text-white transition cursor-help"
            title="Drag cards between columns to change their order status."
          >
            <Info className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* 4 Sequential Columns Grid */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[860px] grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-2.5">
          
          {/* ================= COLUMN 1: STOCKS AVAILABLE ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'STOCKS_AVAILABLE')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'STOCKS_AVAILABLE')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'STOCKS_AVAILABLE'
                ? 'border-[#2563EB] bg-[#EDF4FF] shadow-md scale-[1.01]'
                : 'border-[#93C5FD]/60 bg-[#F4F8FF]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center pb-3">
                <span className="w-5 h-5 rounded-full bg-[#1D6FEB] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  1
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Package className="w-4 h-4 text-[#1D6FEB]" />
                  <span>STOCKS AVAILABLE</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {stage1Orders.length} {stage1Orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {stage1Orders.map((order) =>
                  renderCard(order, draggedOrderId === order.id)
                )}

                {/* Drop indicator if hovering */}
                {dragOverColumn === 'STOCKS_AVAILABLE' && draggedOrder && draggedOrder.currentStage !== 'STOCKS_AVAILABLE' && (
                  <div className="border-2 border-dashed border-[#2563EB] bg-white/90 rounded-xl p-3 text-center text-xs font-bold text-[#1D6FEB] animate-pulse">
                    Move to Stocks Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-4 h-4 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 2: PRICING ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'PRICING')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'PRICING')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'PRICING'
                ? 'border-[#10B981] bg-[#ECFDF5] shadow-md scale-[1.01]'
                : 'border-[#A7F3D0]/70 bg-[#F0FDF4]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center pb-3">
                <span className="w-5 h-5 rounded-full bg-[#10B981] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  2
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Tag className="w-4 h-4 text-[#10B981]" />
                  <span>PRICING</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {stage2Orders.length} {stage2Orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {stage2Orders.map((order) =>
                  renderCard(order, draggedOrderId === order.id)
                )}

                {/* Drop indicator if hovering */}
                {dragOverColumn === 'PRICING' && draggedOrder && draggedOrder.currentStage !== 'PRICING' && (
                  <div className="border-2 border-dashed border-[#10B981] bg-white/90 rounded-xl p-3 text-center text-xs font-bold text-[#10B981] animate-pulse">
                    Move to Pricing Review
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-4 h-4 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 3: PURCHASING ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'PURCHASING')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'PURCHASING')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'PURCHASING'
                ? 'border-[#EA580C] bg-[#FFF7ED] shadow-md scale-[1.01]'
                : 'border-[#FDBA74]/70 bg-[#FFF7ED]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center pb-3">
                <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  3
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <ShoppingCart className="w-4 h-4 text-[#EA580C]" />
                  <span>PURCHASING</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {stage3Orders.length} {stage3Orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {/* Active Drop target card (like SO-2025-0018 with blue glow in the screenshot!) */}
                {dragOverColumn === 'PURCHASING' && (
                  <div className="border-2 border-dashed border-[#2563EB] bg-[#EDF4FF] rounded-xl p-3 relative shadow-inner animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-xs text-slate-900">
                        {draggedOrder ? draggedOrder.orderNumber : 'SO-2025-0018'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DBEAFE] text-[#1D4ED8] border border-blue-200 animate-pulse">
                        🛒 Processing
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {draggedOrder ? draggedOrder.itemName : 'Laptop Paper'}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5 font-medium">
                      <span>{draggedOrder ? draggedOrder.quantityDisplay : 'Qty: 50 pcs'}</span>
                      <GripVertical className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                )}

                {stage3Orders.map((order) =>
                  renderCard(order, draggedOrderId === order.id)
                )}
              </div>
            </div>
          </div>

          {/* Arrow 3 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-4 h-4 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 4: READY FOR DELIVERY ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'READY_FOR_DELIVERY')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'READY_FOR_DELIVERY')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'READY_FOR_DELIVERY'
                ? 'border-[#8B5CF6] bg-[#F5F3FF] shadow-md scale-[1.01]'
                : 'border-[#C4B5FD]/70 bg-[#FAF5FF]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center pb-3">
                <span className="w-5 h-5 rounded-full bg-[#8B5CF6] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  4
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Truck className="w-4 h-4 text-[#8B5CF6]" />
                  <span>READY FOR DELIVERY</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {stage4Orders.length} {stage4Orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {stage4Orders.map((order) =>
                  renderCard(order, draggedOrderId === order.id)
                )}

                {/* Drop indicator if hovering */}
                {dragOverColumn === 'READY_FOR_DELIVERY' && draggedOrder && draggedOrder.currentStage !== 'READY_FOR_DELIVERY' && (
                  <div className="border-2 border-dashed border-[#8B5CF6] bg-white/90 rounded-xl p-3 text-center text-xs font-bold text-[#8B5CF6] animate-pulse">
                    Move to Ready for Delivery
                  </div>
                )}
              </div>
            </div>

            {/* Special Order Completed Celebratory Box at bottom of Column 4 */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={handleDropCompleted}
              onClick={() => {
                if (stage4Orders.length > 0 && onOrderCompleted) {
                  onOrderCompleted(stage4Orders[0].id);
                }
              }}
              className="mt-4 border-2 border-dashed border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3.5 text-center relative overflow-hidden cursor-pointer hover:bg-emerald-100/60 transition group shadow-2xs"
              title="Drag here or click to complete ready orders"
            >
              {/* Confetti Decorative Dots */}
              <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60" />
              <span className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60" />
              <span className="absolute bottom-2 left-5 w-1 h-2 bg-purple-400 opacity-60 transform rotate-45" />
              <span className="absolute bottom-2 right-3 w-1.5 h-1 bg-rose-400 opacity-60 transform -rotate-12" />

              <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto mb-1 shadow-sm group-hover:scale-110 transition">
                <Check className="w-4 h-4 stroke-[3.5]" />
              </div>
              <span className="text-xs font-black text-[#15803D] tracking-tight block">
                Order Completed!
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
