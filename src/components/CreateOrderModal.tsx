import React, { useState } from 'react';
import { X, Plus, Package, Building, Tag, Hash, User } from 'lucide-react';
import { SupplyOrder, OrderStage, CardBadgeType } from '../types/order';
import { STAGES_CONFIG } from '../utils/orderUtils';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (newOrder: SupplyOrder) => void;
  nextOrderIndex: number;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onCreateOrder,
  nextOrderIndex,
}) => {
  const [customerName, setCustomerName] = useState('Greenfield ES');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('pcs');
  const [unitPrice, setUnitPrice] = useState<number>(150);
  const [targetStage, setTargetStage] = useState<OrderStage>('ORDERS');
  const [depotBranch, setDepotBranch] = useState<'GBTN' | 'LIGAO'>('GBTN');
  const [purchaseMethod, setPurchaseMethod] = useState<'ONLINE' | 'NOT_ONLINE'>('ONLINE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const formattedNum = String(nextOrderIndex).padStart(4, '0');
    const orderNumber = `SO-2025-${formattedNum}`;
    const totalPrice = quantity * unitPrice;

    let badgeText: CardBadgeType = 'New Order';
    let statusLabel = 'New Intake';

    if (targetStage === 'IDENTIFICATION_OF_STOCKS') {
      badgeText = 'Stock Identified';
      statusLabel = 'Stock Identified';
    } else if (targetStage === 'PRICING') {
      badgeText = 'Review Price';
      statusLabel = 'Price Review';
    } else if (targetStage === 'PURCHASING') {
      badgeText = 'In Purchase';
      statusLabel = 'In Purchase';
    } else if (targetStage === 'READY_FOR_DELIVERY') {
      badgeText = 'Ready';
      statusLabel = 'Ready for Delivery';
    }

    const orderId = `ord-${Date.now()}`;
    const newOrder: SupplyOrder = {
      id: orderId,
      orderNumber,
      customerName: customerName.trim() || 'Procurement Customer',
      itemName: itemName.trim(),
      quantityDisplay: `Qty: ${quantity} ${unit}`,
      quantity,
      unit,
      unitPrice,
      totalPrice,
      badgeText,
      currentStage: targetStage,
      statusLabel,
      depotBranch,
      purchaseMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      depotUrl: 'https://7starsdepot.netlify.app/',
      items: [
        {
          id: `${orderId}-it-1`,
          name: itemName.trim(),
          quantityRequested: quantity,
          unit,
          unitPrice,
          totalPrice,
          depotBranch,
          purchaseMethod,
          stockStatus: 'Available in Depot'
        }
      ]
    };

    onCreateOrder(newOrder);
    onClose();
    // Reset form
    setItemName('');
    setQuantity(10);
    setUnitPrice(150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0A1628] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1D6FEB] flex items-center justify-center text-white">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <h3 className="font-bold text-sm tracking-tight">Create Supply Requisition</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-medium text-slate-700">
          
          {/* Customer Name Field */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Customer / Requestor Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., Maria Santos, Teacher Karen Morales, Elena Cruz"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Item Name / Supply Description *
            </label>
            <div className="relative">
              <Package className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Sensory Liquid Floor Tiles, A4 Bond Paper"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] outline-none text-xs font-semibold bg-white"
              >
                <option value="pcs">pcs</option>
                <option value="sets">sets</option>
                <option value="reams">reams</option>
                <option value="boxes">boxes</option>
                <option value="packs">packs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Unit Price (₱ PHP)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] focus:ring-2 focus:ring-blue-100 outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Total Estimated Cost</label>
              <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-extrabold text-[#1D6FEB] text-xs">
                ₱{(quantity * unitPrice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Depot Branch</label>
              <select
                value={depotBranch}
                onChange={(e) => setDepotBranch(e.target.value as 'GBTN' | 'LIGAO')}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] outline-none text-xs font-semibold bg-white"
              >
                <option value="GBTN">Guinobatan Branch</option>
                <option value="LIGAO">Ligao Branch</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Purchase Channel</label>
              <select
                value={purchaseMethod}
                onChange={(e) => setPurchaseMethod(e.target.value as 'ONLINE' | 'NOT_ONLINE')}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] outline-none text-xs font-semibold bg-white"
              >
                <option value="ONLINE">🌐 Bought Online</option>
                <option value="NOT_ONLINE">🏬 In-Store (Not Online)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Starting Pipeline Stage</label>
            <select
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value as OrderStage)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#1D6FEB] outline-none text-xs font-semibold bg-white"
            >
              <option value="ORDERS">1. ORDERS (New Intake)</option>
              <option value="IDENTIFICATION_OF_STOCKS">2. IDENTIFICATION OF STOCKS (7 Stars Depot)</option>
              <option value="PRICING">3. PRICING (Price Review)</option>
              <option value="PURCHASING">4. PURCHASING</option>
              <option value="READY_FOR_DELIVERY">5. READY FOR DELIVERY</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1D6FEB] hover:bg-blue-600 active:scale-95 text-white font-bold transition shadow-sm cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
