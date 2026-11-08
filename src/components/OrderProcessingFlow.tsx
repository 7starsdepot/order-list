import React, { useState } from 'react';
import { 
  ClipboardList, 
  Package, 
  Tag, 
  ShoppingCart, 
  Truck, 
  ArrowRight, 
  GripVertical, 
  Info,
  Check,
  FilePlus,
  ExternalLink,
  List,
  Store,
  X,
  Pencil,
  Globe,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { SupplyOrder, OrderStage, OrderItem, PurchaseMethod } from '../types/order';
import { getBadgeStyle, formatCurrency, normalizeBranch, computeOrderPurchaseMethod } from '../utils/orderUtils';

interface OrderProcessingFlowProps {
  orders: SupplyOrder[];
  selectedOrderId: string;
  onSelectOrder: (order: SupplyOrder) => void;
  onMoveOrder: (orderId: string, targetStage: OrderStage, targetBranch?: 'GBTN' | 'LIGAO') => void;
  onOrderCompleted: (orderId: string) => void;
  onCreateNewOrder?: () => void;
  onEditOrder?: (order: SupplyOrder) => void;
  onToggleBranch?: (orderId: string, branch: 'GBTN' | 'LIGAO') => void;
  onToggleItemPurchaseMethod?: (orderId: string, itemId: string) => void;
}

export const OrderProcessingFlow: React.FC<OrderProcessingFlowProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onMoveOrder,
  onOrderCompleted,
  onCreateNewOrder,
  onEditOrder,
  onToggleBranch,
  onToggleItemPurchaseMethod,
}) => {
  const [dragEnabled, setDragEnabled] = useState(true);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [itemsModalOrder, setItemsModalOrder] = useState<SupplyOrder | null>(null);

  // Purchasing column filter: 'ALL' | 'ONLINE' | 'NOT_ONLINE'
  const [purchasingFilter, setPurchasingFilter] = useState<'ALL' | 'ONLINE' | 'NOT_ONLINE'>('ALL');

  // Identification column filter: 'ALL' | 'GBTN' | 'LIGAO'
  const [identificationView, setIdentificationView] = useState<'ALL' | 'GBTN' | 'LIGAO'>('ALL');

  // Filter orders by sequential stages
  const ordersStage = orders.filter((o) => o.currentStage === 'ORDERS');
  const identificationStage = orders.filter((o) => o.currentStage === 'IDENTIFICATION_OF_STOCKS');
  const pricingStage = orders.filter((o) => o.currentStage === 'PRICING');
  const purchasingStage = orders.filter((o) => o.currentStage === 'PURCHASING');
  const deliveryStage = orders.filter((o) => o.currentStage === 'READY_FOR_DELIVERY');

  // Sub-division for IDENTIFICATION OF STOCKS: GBTN and LIGAO
  const gbtnOrders = identificationStage.filter((o) => normalizeBranch(o.depotBranch) === 'GBTN');
  const ligaoOrders = identificationStage.filter((o) => normalizeBranch(o.depotBranch) === 'LIGAO');

  // Drag handlers
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

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (!dragEnabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== targetId) {
      setDragOverColumn(targetId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: OrderStage, targetBranch?: 'GBTN' | 'LIGAO') => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId) {
      onMoveOrder(orderId, targetStage, targetBranch);
      setDraggedOrderId(null);
    }
  };

  const handleDropCompleted = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (orderId) {
      onOrderCompleted(orderId);
      setDraggedOrderId(null);
    }
  };

  // Render an individual card
  const renderCard = (order: SupplyOrder, isGhost = false, overrideBadge?: string) => {
    const isSelected = order.id === selectedOrderId;
    const badgeStyle = getBadgeStyle(overrideBadge || order.badgeText);
    const orderBranch = normalizeBranch(order.depotBranch);

    const itemsList: OrderItem[] = order.items && order.items.length > 0 ? order.items : [
      {
        id: `${order.id}-1`,
        name: order.itemName,
        quantityRequested: order.quantity,
        unit: order.unit,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice,
        depotBranch: orderBranch,
        purchaseMethod: 'ONLINE',
        stockStatus: 'Available in Depot'
      }
    ];

    const onlineItems = itemsList.filter((it) => it.purchaseMethod === 'ONLINE');
    const notOnlineItems = itemsList.filter((it) => it.purchaseMethod === 'NOT_ONLINE');

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
        {/* Top: Customer Name (Prominent Header) + Actions */}
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#1D6FEB] to-sky-400 text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-2xs">
              {order.customerName ? order.customerName.charAt(0) : 'C'}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs text-slate-900 block truncate" title={order.customerName}>
                {order.customerName || 'Customer Requisition'}
              </span>
              <span className="font-mono text-[10px] text-slate-400 block -mt-0.5">
                {order.orderNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Quick Edit button */}
            {onEditOrder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrder(order);
                  onEditOrder(order);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-[#1D6FEB] hover:bg-blue-50 transition cursor-pointer"
                title="Edit this order"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border || 'border-transparent'}`}
            >
              {overrideBadge || order.badgeText}
            </span>
          </div>
        </div>

        {/* Primary Item Summary */}
        <div className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
          {order.itemName}
        </div>

        {/* ================= STAGE-SPECIFIC HIGHLIGHTS ================= */}
        
        {/* If in Stage 2: IDENTIFICATION OF STOCKS -> Show GBTN vs LIGAO Branch Division & 1-Click Toggle */}
        {order.currentStage === 'IDENTIFICATION_OF_STOCKS' && (
          <div className="mb-2 p-1.5 rounded-lg bg-cyan-50/70 border border-cyan-100 flex items-center justify-between gap-1 text-[10px]">
            <span className="text-cyan-800 font-bold flex items-center gap-1">
              <Store className="w-3 h-3 text-cyan-600" />
              <span>Branch:</span>
            </span>

            {/* Quick GBTN / LIGAO Toggle Pills */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleBranch) onToggleBranch(order.id, 'GBTN');
                }}
                className={`px-2 py-0.5 rounded font-extrabold text-[10px] transition cursor-pointer ${
                  orderBranch === 'GBTN'
                    ? 'bg-cyan-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-cyan-100 border border-slate-200'
                }`}
                title="Set to GBTN Branch"
              >
                GBTN
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleBranch) onToggleBranch(order.id, 'LIGAO');
                }}
                className={`px-2 py-0.5 rounded font-extrabold text-[10px] transition cursor-pointer ${
                  orderBranch === 'LIGAO'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-teal-100 border border-slate-200'
                }`}
                title="Set to LIGAO Branch"
              >
                LIGAO
              </button>
            </div>
          </div>
        )}

        {/* If in Stage 4: PURCHASING -> Show Online vs Not Online Breakdown */}
        {order.currentStage === 'PURCHASING' && (
          <div className="mb-2 p-1.5 rounded-lg bg-orange-50/70 border border-orange-200/80 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-600 flex items-center gap-1">
                <ShoppingCart className="w-3 h-3 text-orange-600" />
                <span>Purchase Mode:</span>
              </span>
              
              {/* Overall channel badge */}
              {onlineItems.length > 0 && notOnlineItems.length === 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  <span>Bought Online</span>
                </span>
              )}
              {notOnlineItems.length > 0 && onlineItems.length === 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold flex items-center gap-1">
                  <Store className="w-2.5 h-2.5" />
                  <span>In-Store (Not Online)</span>
                </span>
              )}
              {onlineItems.length > 0 && notOnlineItems.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold flex items-center gap-1">
                  <span>Mixed Channels</span>
                </span>
              )}
            </div>

            {/* Item Breakdown Pills */}
            <div className="flex items-center gap-1.5 text-[9px] font-bold">
              {onlineItems.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 truncate">
                  🌐 {onlineItems.length} Online
                </span>
              )}
              {notOnlineItems.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 truncate">
                  🏬 {notOnlineItems.length} In-Store
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Strip: Click to show listed items + Price + Grip Handle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrder(order);
              setItemsModalOrder(order);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-50 hover:bg-blue-100 text-[#1D6FEB] border border-blue-200/70 transition cursor-pointer"
            title="Click to view all items and purchase channels for this order"
          >
            <List className="w-3 h-3" />
            <span>Items ({itemsList.length})</span>
          </button>

          <span className="font-extrabold text-slate-900 text-xs">
            {formatCurrency(order.totalPrice)}
          </span>

          <span className="text-slate-300 group-hover:text-slate-500 transition">
            <GripVertical className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    );
  };

  const draggedOrder = orders.find((o) => o.id === draggedOrderId);

  // Filter purchasing stage orders based on filter selection
  const filteredPurchasingOrders = purchasingStage.filter((order) => {
    if (purchasingFilter === 'ALL') return true;
    const items = order.items || [];
    if (purchasingFilter === 'ONLINE') {
      return items.some((it) => it.purchaseMethod === 'ONLINE') || order.purchaseMethod === 'ONLINE';
    }
    if (purchasingFilter === 'NOT_ONLINE') {
      return items.some((it) => it.purchaseMethod === 'NOT_ONLINE') || order.purchaseMethod === 'NOT_ONLINE';
    }
    return true;
  });

  const onlinePurchasingOrdersCount = purchasingStage.filter((o) =>
    (o.items || []).some((it) => it.purchaseMethod === 'ONLINE') || o.purchaseMethod === 'ONLINE'
  ).length;

  const notOnlinePurchasingOrdersCount = purchasingStage.filter((o) =>
    (o.items || []).some((it) => it.purchaseMethod === 'NOT_ONLINE') || o.purchaseMethod === 'NOT_ONLINE'
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Dark Navy Header Strip */}
      <div className="bg-[#0A1628] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#1D6FEB] flex items-center justify-center text-white shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              Order Processing Flow
            </h2>
          </div>
        </div>

        {/* Actions & Drag & Drop Toggle */}
        <div className="flex items-center gap-3 text-xs">
          {onCreateNewOrder && (
            <button
              onClick={onCreateNewOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D6FEB] hover:bg-blue-600 active:scale-95 text-white font-bold transition shadow-xs cursor-pointer"
              title="Add a new order into the flow"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Create Order</span>
            </button>
          )}

          <span className="text-slate-200 font-semibold hidden sm:inline ml-2">
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
            title="Drag cards between columns or branches to change status."
          >
            <Info className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* 5 Sequential Columns Grid with connecting arrows */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[1180px] grid grid-cols-[1fr_auto_1.25fr_auto_1fr_auto_1.25fr_auto_1fr] items-stretch gap-2.5">
          
          {/* ================= COLUMN 1: ORDERS ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'ORDERS')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'ORDERS')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'ORDERS'
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
                  <ClipboardList className="w-4 h-4 text-[#1D6FEB]" />
                  <span>ORDERS</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {ordersStage.length} {ordersStage.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {ordersStage.map((order) =>
                  renderCard(order, draggedOrderId === order.id)
                )}

                {/* Drop indicator if hovering */}
                {dragOverColumn === 'ORDERS' && draggedOrder && draggedOrder.currentStage !== 'ORDERS' && (
                  <div className="border-2 border-dashed border-[#2563EB] bg-white/90 rounded-xl p-3 text-center text-xs font-bold text-[#1D6FEB] animate-pulse">
                    Move to Orders Intake
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 2: IDENTIFICATION OF STOCKS (DIVIDED INTO 2: GBTN & LIGAO) ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'IDENTIFICATION_OF_STOCKS')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'IDENTIFICATION_OF_STOCKS')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'IDENTIFICATION_OF_STOCKS'
                ? 'border-[#0891B2] bg-[#ECFEFF] shadow-md scale-[1.01]'
                : 'border-[#A5F3FC]/80 bg-[#F0FDFA]'
            }`}
          >
            <div>
              {/* Header with 7 Stars Depot Link */}
              <div className="flex flex-col items-center text-center pb-2.5 border-b border-cyan-100">
                <span className="w-5 h-5 rounded-full bg-[#0891B2] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  2
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Package className="w-4 h-4 text-[#0891B2]" />
                  <span>IDENTIFICATION OF STOCKS</span>
                </div>
                
                {/* 7 Stars Depot Live Link */}
                <a
                  href="https://7starsdepot.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border border-cyan-300 transition"
                  title="Verify Stock Availability at 7 Stars Depot"
                >
                  <span>7starsdepot.netlify.app</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                {/* Branch Division Sub-Tabs */}
                <div className="flex items-center gap-1 mt-2 bg-white/80 p-0.5 rounded-lg border border-cyan-200/70 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setIdentificationView('ALL')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      identificationView === 'ALL'
                        ? 'bg-[#0891B2] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-cyan-800'
                    }`}
                  >
                    Both ({identificationStage.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentificationView('GBTN')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      identificationView === 'GBTN'
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-cyan-800'
                    }`}
                  >
                    GBTN ({gbtnOrders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentificationView('LIGAO')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      identificationView === 'LIGAO'
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-cyan-800'
                    }`}
                  >
                    LIGAO ({ligaoOrders.length})
                  </button>
                </div>
              </div>

              {/* DIVIDED SUB-LANES: GBTN & LIGAO */}
              <div className="space-y-3 pt-2.5">
                
                {/* SUB-LANE 1: GBTN BRANCH */}
                {(identificationView === 'ALL' || identificationView === 'GBTN') && (
                  <div
                    onDragOver={(e) => handleDragOver(e, 'IDENTIFICATION_GBTN')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'IDENTIFICATION_OF_STOCKS', 'GBTN')}
                    className={`rounded-xl p-2.5 border transition-all ${
                      dragOverColumn === 'IDENTIFICATION_GBTN'
                        ? 'border-cyan-500 bg-cyan-100/70 shadow-sm ring-2 ring-cyan-400'
                        : 'border-cyan-200/90 bg-white/70'
                    }`}
                  >
                    {/* Sub-Lane Header */}
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-cyan-100">
                      <div className="flex items-center gap-1.5 text-xs font-black text-cyan-900">
                        <Store className="w-3.5 h-3.5 text-cyan-600" />
                        <span>GBTN (Guinobatan Branch)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
                        {gbtnOrders.length} Order{gbtnOrders.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* GBTN Cards */}
                    <div className="space-y-2">
                      {gbtnOrders.length === 0 ? (
                        <div className="text-center py-3 text-[11px] text-slate-400 font-medium italic border border-dashed border-cyan-200 rounded-lg">
                          Drop here to assign to GBTN
                        </div>
                      ) : (
                        gbtnOrders.map((order) => renderCard(order, draggedOrderId === order.id))
                      )}
                    </div>
                  </div>
                )}

                {/* SUB-LANE 2: LIGAO BRANCH */}
                {(identificationView === 'ALL' || identificationView === 'LIGAO') && (
                  <div
                    onDragOver={(e) => handleDragOver(e, 'IDENTIFICATION_LIGAO')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'IDENTIFICATION_OF_STOCKS', 'LIGAO')}
                    className={`rounded-xl p-2.5 border transition-all ${
                      dragOverColumn === 'IDENTIFICATION_LIGAO'
                        ? 'border-teal-500 bg-teal-100/70 shadow-sm ring-2 ring-teal-400'
                        : 'border-teal-200/90 bg-white/70'
                    }`}
                  >
                    {/* Sub-Lane Header */}
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-teal-100">
                      <div className="flex items-center gap-1.5 text-xs font-black text-teal-900">
                        <Store className="w-3.5 h-3.5 text-teal-600" />
                        <span>LIGAO Branch</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                        {ligaoOrders.length} Order{ligaoOrders.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* LIGAO Cards */}
                    <div className="space-y-2">
                      {ligaoOrders.length === 0 ? (
                        <div className="text-center py-3 text-[11px] text-slate-400 font-medium italic border border-dashed border-teal-200 rounded-lg">
                          Drop here to assign to LIGAO
                        </div>
                      ) : (
                        ligaoOrders.map((order) => renderCard(order, draggedOrderId === order.id))
                      )}
                    </div>
                  </div>
                )}

                {/* Drop indicator if hovering general column */}
                {dragOverColumn === 'IDENTIFICATION_OF_STOCKS' && draggedOrder && draggedOrder.currentStage !== 'IDENTIFICATION_OF_STOCKS' && (
                  <div className="border-2 border-dashed border-[#0891B2] bg-white/90 rounded-xl p-3 text-center text-xs font-bold text-[#0891B2] animate-pulse">
                    Drop into GBTN or LIGAO Sub-Lane
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 3: PRICING ================= */}
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
                  3
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Tag className="w-4 h-4 text-[#10B981]" />
                  <span>PRICING</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {pricingStage.length} {pricingStage.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {pricingStage.map((order) =>
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

          {/* Arrow 3 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 4: PURCHASING (SHOWING ITEMS BOUGHT ONLINE & NOT ONLINE) ================= */}
          <div
            onDragOver={(e) => handleDragOver(e, 'PURCHASING')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'PURCHASING')}
            className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between ${
              dragOverColumn === 'PURCHASING'
                ? 'border-[#EA580C] bg-[#FFF7ED] shadow-md scale-[1.01]'
                : 'border-[#FDBA74]/80 bg-[#FFF7ED]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center pb-2.5 border-b border-orange-200">
                <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white font-bold text-[11px] flex items-center justify-center mb-1 shadow-xs">
                  4
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <ShoppingCart className="w-4 h-4 text-[#EA580C]" />
                  <span>PURCHASING</span>
                </div>
                
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {purchasingStage.length} {purchasingStage.length === 1 ? 'Order' : 'Orders'}
                </span>

                {/* Online vs Not Online Filter Pills */}
                <div className="flex items-center gap-1 mt-2 bg-white/80 p-0.5 rounded-lg border border-orange-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPurchasingFilter('ALL')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      purchasingFilter === 'ALL'
                        ? 'bg-[#EA580C] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-orange-700'
                    }`}
                  >
                    All ({purchasingStage.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchasingFilter('ONLINE')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                      purchasingFilter === 'ONLINE'
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-purple-700 hover:bg-purple-50'
                    }`}
                    title="Filter to orders with online purchases"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    <span>Online ({onlinePurchasingOrdersCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchasingFilter('NOT_ONLINE')}
                    className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                      purchasingFilter === 'NOT_ONLINE'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                    title="Filter to orders with in-store (not online) purchases"
                  >
                    <Store className="w-2.5 h-2.5" />
                    <span>In-Store ({notOnlinePurchasingOrdersCount})</span>
                  </button>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 pt-2.5">
                {/* Active Drop target card (like SO-2025-0018 with blue glow in the screenshot) */}
                {dragOverColumn === 'PURCHASING' && (
                  <div className="border-2 border-dashed border-[#2563EB] bg-[#EDF4FF] rounded-xl p-3 relative shadow-inner animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-xs text-slate-900">
                        {draggedOrder ? draggedOrder.orderNumber : 'SO-2025-0018'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DBEAFE] text-[#1D4ED8] border border-blue-200 animate-pulse">
                        🛒 In Purchase
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

                {filteredPurchasingOrders.length === 0 ? (
                  <div className="text-center py-5 text-xs text-slate-400 font-medium italic border border-dashed border-orange-200 rounded-xl bg-white/60">
                    No orders match filter ({purchasingFilter}).
                  </div>
                ) : (
                  filteredPurchasingOrders.map((order) =>
                    renderCard(order, draggedOrderId === order.id)
                  )
                )}
              </div>
            </div>
          </div>

          {/* Arrow 4 */}
          <div className="flex items-center justify-center text-[#1D6FEB] select-none">
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5 text-[#1D6FEB] stroke-[3]" />
            </div>
          </div>

          {/* ================= COLUMN 5: READY FOR DELIVERY ================= */}
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
                  5
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 tracking-tight">
                  <Truck className="w-4 h-4 text-[#8B5CF6]" />
                  <span>READY FOR DELIVERY</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {deliveryStage.length} {deliveryStage.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {deliveryStage.map((order) =>
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

            {/* ORDER COMPLETED TARGET BOX (Exact design from screenshot with celebratory confetti & checkmark) */}
            <div
              onDragOver={(e) => handleDragOver(e, 'COMPLETED')}
              onDragLeave={handleDragLeave}
              onDrop={handleDropCompleted}
              onClick={() => {
                const target = deliveryStage[0] || ordersStage[0];
                if (target) {
                  onOrderCompleted(target.id);
                }
              }}
              className={`mt-4 rounded-xl border-2 border-dashed transition-all p-3 text-center relative overflow-hidden group cursor-pointer ${
                dragOverColumn === 'COMPLETED'
                  ? 'border-[#16A34A] bg-[#DCFCE7] ring-4 ring-emerald-300 scale-105 shadow-lg'
                  : 'border-[#86EFAC] bg-[#F0FDF4] hover:bg-[#DCFCE7]/70'
              }`}
              title="Drop an order here or click to mark complete and archive"
            >
              {/* Decorative confetti dots */}
              <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-70" />
              <span className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-70" />
              <span className="absolute bottom-2 left-4 w-2 h-1 bg-amber-400 opacity-60 transform rotate-45" />
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

      {/* ================= CLICKABLE CUSTOMER LISTED ITEMS MODAL ================= */}
      {itemsModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0A1628] text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1D6FEB] to-sky-400 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {itemsModalOrder.customerName ? itemsModalOrder.customerName.charAt(0) : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-tight">
                      {itemsModalOrder.customerName}&apos;s Listed Items
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {itemsModalOrder.orderNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {itemsModalOrder.department || 'Administrative'} • {itemsModalOrder.customerRole || 'Procurement Requestor'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEditOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      const ord = itemsModalOrder;
                      setItemsModalOrder(null);
                      onEditOrder(ord);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                    title="Edit items, prices, or quantities"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Order</span>
                  </button>
                )}

                <button
                  onClick={() => setItemsModalOrder(null)}
                  className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Listed Items Breakdown */}
            <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              <div className="flex items-center justify-between text-slate-500 font-bold px-1 pb-1 border-b border-slate-100">
                <span className="text-[11px] uppercase tracking-wider">Item Breakdown & Purchase Channel</span>
                <span className="text-[11px] text-[#1D6FEB]">
                  {(itemsModalOrder.items?.length || 1)} Item{(itemsModalOrder.items?.length || 1) > 1 ? 's' : ''} Included
                </span>
              </div>

              <div className="divide-y divide-slate-100 space-y-2">
                {(itemsModalOrder.items && itemsModalOrder.items.length > 0 ? itemsModalOrder.items : [
                  {
                    id: `${itemsModalOrder.id}-1`,
                    sku: `DEPOT-${itemsModalOrder.orderNumber}`,
                    name: itemsModalOrder.itemName,
                    quantityRequested: itemsModalOrder.quantity,
                    unit: itemsModalOrder.unit,
                    unitPrice: itemsModalOrder.unitPrice,
                    totalPrice: itemsModalOrder.totalPrice,
                    depotBranch: itemsModalOrder.depotBranch,
                    purchaseMethod: 'ONLINE' as PurchaseMethod,
                    stockStatus: 'Available in Depot'
                  } as OrderItem
                ]).map((item, idx) => {
                  const isOnline = item.purchaseMethod === 'ONLINE';

                  return (
                    <div 
                      key={item.id || idx} 
                      className="py-3 px-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1D6FEB] font-extrabold text-[11px] flex items-center justify-center shrink-0 border border-blue-100">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate text-xs">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                              <span>Qty: {item.quantityRequested} {item.unit}</span>
                              <span>•</span>
                              <span>{formatCurrency(item.unitPrice)} each</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-slate-900 text-xs block">
                            {formatCurrency(item.totalPrice || item.quantityRequested * item.unitPrice)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            {item.stockStatus || 'In Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Item Tags: Purchase Method (Online vs In-Store) & Depot Branch */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {/* Purchase Channel Pill with 1-Click Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onToggleItemPurchaseMethod && item.id) {
                                onToggleItemPurchaseMethod(itemsModalOrder.id, item.id);
                                // Update local state for immediate modal feedback
                                setItemsModalOrder((prev) => {
                                  if (!prev || !prev.items) return prev;
                                  const updated = prev.items.map((it) =>
                                    it.id === item.id
                                      ? { ...it, purchaseMethod: (it.purchaseMethod === 'ONLINE' ? 'NOT_ONLINE' : 'ONLINE') as PurchaseMethod }
                                      : it
                                  );
                                  return { ...prev, items: updated };
                                });
                              }
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer border ${
                              isOnline
                                ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                            }`}
                            title="Click to toggle between Bought Online and In-Store (Not Online)"
                          >
                            {isOnline ? (
                              <>
                                <Globe className="w-2.5 h-2.5 text-purple-600" />
                                <span>🌐 Bought Online</span>
                              </>
                            ) : (
                              <>
                                <Store className="w-2.5 h-2.5 text-amber-600" />
                                <span>🏬 In-Store (Not Online)</span>
                              </>
                            )}
                            <span className="text-[9px] opacity-60 ml-0.5">⇄</span>
                          </button>

                          {/* Branch badge */}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                            <Store className="w-2.5 h-2.5 text-cyan-600" />
                            <span>{normalizeBranch(item.depotBranch)}</span>
                          </span>
                        </div>

                        <span className="font-mono text-slate-400 text-[10px]">
                          {item.sku || 'DEPOT-SKU'}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="block">Total Requisition Cost:</span>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Calculated for all items in ₱ (PHP)
                  </div>
                </div>
                <span className="text-[#1D6FEB] text-base">{formatCurrency(itemsModalOrder.totalPrice)}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <a
                href={itemsModalOrder.depotUrl || 'https://7starsdepot.netlify.app/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800"
              >
                <span>Verify at 7starsdepot.netlify.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setItemsModalOrder(null)}
                className="px-4 py-1.5 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
