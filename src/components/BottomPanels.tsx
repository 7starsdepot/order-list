import React from 'react';
import { 
  Package, 
  ArrowRight, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Check, 
  ShoppingCart, 
  Truck,
  FileText,
  Boxes,
  Bell,
  ExternalLink,
  ClipboardList,
  Store,
  Tag,
  Pencil,
  Globe
} from 'lucide-react';
import { SupplyOrder, InventoryItem, SystemAlert } from '../types/order';
import { formatCurrency } from '../utils/orderUtils';

interface BottomPanelsProps {
  inventory: InventoryItem[];
  selectedOrder: SupplyOrder;
  alerts: SystemAlert[];
  onViewAllInventory?: () => void;
  onViewAllAlerts?: () => void;
  onEditOrder?: (order: SupplyOrder) => void;
}

export const BottomPanels: React.FC<BottomPanelsProps> = ({
  inventory,
  selectedOrder,
  alerts,
  onViewAllInventory,
  onViewAllAlerts,
  onEditOrder,
}) => {
  // Determine current active step (1 to 5) for the selected order
  let activeStep = 1;
  if (selectedOrder.currentStage === 'ORDERS') activeStep = 1;
  if (selectedOrder.currentStage === 'IDENTIFICATION_OF_STOCKS') activeStep = 2;
  if (selectedOrder.currentStage === 'PRICING') activeStep = 3;
  if (selectedOrder.currentStage === 'PURCHASING') activeStep = 4;
  if (selectedOrder.currentStage === 'READY_FOR_DELIVERY' || selectedOrder.currentStage === 'COMPLETED') activeStep = 5;

  const orderItems = selectedOrder.items || [];
  const onlineCount = orderItems.filter(it => it.purchaseMethod === 'ONLINE').length;
  const notOnlineCount = orderItems.filter(it => it.purchaseMethod === 'NOT_ONLINE').length;
  const branchName = (selectedOrder.depotBranch?.toUpperCase().includes('LIGAO')) ? 'LIGAO Branch' : 'Guinobatan Branch';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* ================= PANEL 1: INVENTORY OVERVIEW (col-span-4) ================= */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="bg-[#0A1628] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                Inventory Overview
              </h3>
            </div>
            <button
              onClick={onViewAllInventory}
              className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inventory Table/List */}
          <div className="p-3 divide-y divide-slate-100 text-xs">
            {inventory.map((item) => (
              <div key={item.id} className="py-2.5 px-2 flex items-center justify-between gap-2 hover:bg-slate-50/70 rounded-lg transition">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Miniature 3D Product Icon */}
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {item.iconType === 'paper' && <span className="text-[11px] font-bold text-blue-600">📄</span>}
                    {item.iconType === 'ink' && <span className="text-[11px] font-bold text-slate-800">🖨️</span>}
                    {item.iconType === 'stapler' && <span className="text-[11px] font-bold text-indigo-600">📎</span>}
                    {item.iconType === 'markers' && <span className="text-[11px] font-bold text-amber-600">🖍️</span>}
                    {item.iconType === 'folders' && <span className="text-[11px] font-bold text-sky-600">📁</span>}
                  </div>
                  <span className="font-semibold text-slate-800 truncate">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-600 font-medium text-[11px]">
                    {item.quantityDisplay}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'In Stock'
                        ? 'bg-[#E8F8EE] text-[#16A34A] border-[#BBF7D0]'
                        : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PANEL 2: SELECTED ORDER DETAILS (col-span-5) ================= */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="bg-[#0A1628] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                Selected Order Details
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {onEditOrder && (
                <button
                  type="button"
                  onClick={() => onEditOrder(selectedOrder)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1D6FEB] hover:bg-blue-600 active:scale-95 text-white font-bold text-[11px] transition cursor-pointer shadow-2xs"
                  title="Edit customer, items, branch, or stage"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Order</span>
                </button>
              )}
              <span className="text-[11px] font-mono text-slate-400">
                {selectedOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-4 mb-5">
              
              {/* 3D Package Box Illustration (Bond Paper Box like screenshot) */}
              <div className="w-20 h-20 bg-gradient-to-tr from-[#1D4ED8] to-[#60A5FA] rounded-2xl shadow-md border-2 border-white p-2 flex flex-col justify-between text-white shrink-0 transform -rotate-3 select-none">
                <div className="text-[8px] font-bold uppercase tracking-wider opacity-80">
                  DEPOT PACK
                </div>
                <div className="text-center font-black text-[11px] leading-tight font-sans bg-white/20 rounded py-0.5 backdrop-blur-2xs">
                  Bond
                  <br />
                  Paper
                </div>
                <div className="flex justify-between items-center text-[7px] font-mono opacity-80">
                  <span>500S</span>
                  <span>70GSM</span>
                </div>
              </div>

              {/* Order Info Breakdown */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {selectedOrder.orderNumber}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 tracking-tight truncate">
                      {selectedOrder.customerName || 'Maria Santos'}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 shrink-0">
                    {selectedOrder.statusLabel || 'In Progress'}
                  </span>
                </div>

                <div className="space-y-0.5 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock Branch:</span>
                    <span className="font-bold text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200 truncate ml-2">
                      {branchName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Purchasing:</span>
                    <span className="font-bold truncate ml-2 flex items-center gap-1.5 text-[11px]">
                      {onlineCount > 0 && (
                        <span className="text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          🌐 {onlineCount} Online
                        </span>
                      )}
                      {notOnlineCount > 0 && (
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          🏬 {notOnlineCount} In-Store
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Listed Items:</span>
                    <span className="font-bold text-[#1D6FEB]">
                      {orderItems.length || 1} Item{(orderItems.length || 1) > 1 ? 's' : ''} ({selectedOrder.quantityDisplay})
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-900 text-xs">
                    <span>Total Amount:</span>
                    <span className="text-[#1D6FEB]">{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>

                {/* 7 Stars Depot Connection Badge */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Depot Link:</span>
                  <a
                    href={selectedOrder.depotUrl || 'https://7starsdepot.netlify.app/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-200 transition"
                  >
                    <span>7starsdepot.netlify.app</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* 5-Step Visual Stepper at Bottom */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between relative px-1 sm:px-2">
                
                {/* Connecting Line */}
                <div className="absolute top-3.5 left-5 right-5 h-0.5 bg-slate-200 -z-0" />
                
                {/* Step 1: Orders */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${
                    activeStep >= 1 ? 'bg-[#1D6FEB]' : 'bg-slate-300'
                  }`}>
                    {activeStep > 1 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <ClipboardList className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${activeStep === 1 ? 'text-blue-700' : 'text-slate-700'}`}>
                    Orders
                  </span>
                </div>

                {/* Step 2: Identification of Stocks */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${
                    activeStep >= 2 ? (activeStep === 2 ? 'bg-[#0891B2] ring-4 ring-cyan-100' : 'bg-[#10B981]') : 'bg-slate-300'
                  }`}>
                    {activeStep > 2 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : activeStep === 2 ? (
                      <Package className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">2</span>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${activeStep === 2 ? 'text-cyan-700' : 'text-slate-700'}`}>
                    Stock ID
                  </span>
                </div>

                {/* Step 3: Pricing */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${
                    activeStep >= 3 ? (activeStep === 3 ? 'bg-[#10B981] ring-4 ring-emerald-100' : 'bg-[#10B981]') : 'bg-slate-300'
                  }`}>
                    {activeStep > 3 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : activeStep === 3 ? (
                      <Tag className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">3</span>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${activeStep === 3 ? 'text-emerald-700' : 'text-slate-700'}`}>
                    Pricing
                  </span>
                </div>

                {/* Step 4: Purchasing */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${
                    activeStep >= 4 ? (activeStep === 4 ? 'bg-[#EA580C] ring-4 ring-orange-100' : 'bg-[#10B981]') : 'bg-slate-300'
                  }`}>
                    {activeStep > 4 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : activeStep === 4 ? (
                      <ShoppingCart className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">4</span>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${activeStep === 4 ? 'text-orange-700' : 'text-slate-700'}`}>
                    Purchasing
                  </span>
                </div>

                {/* Step 5: Delivery */}
                <div className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${
                    activeStep >= 5 ? 'bg-[#8B5CF6] ring-4 ring-purple-100' : 'bg-slate-300'
                  }`}>
                    {activeStep >= 5 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${activeStep >= 5 ? 'text-purple-700' : 'text-slate-400'}`}>
                    Delivery
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= PANEL 3: ALERTS (col-span-3) ================= */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="bg-[#0A1628] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                Alerts
              </h3>
            </div>
            <button
              onClick={onViewAllAlerts}
              className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alerts List */}
          <div className="p-3 divide-y divide-slate-100 text-xs">
            {alerts.map((alert) => (
              <div key={alert.id} className="py-2.5 px-2 flex items-start gap-3 hover:bg-slate-50/70 rounded-lg transition">
                {/* Alert Icon */}
                <div className="shrink-0 mt-0.5">
                  {alert.type === 'warning' && (
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {alert.type === 'info' && (
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Info className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {alert.type === 'success' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-[11px] leading-snug">
                    {alert.title}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {alert.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
