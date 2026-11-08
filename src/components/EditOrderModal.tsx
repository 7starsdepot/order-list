import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  User, 
  Building, 
  Tag, 
  DollarSign, 
  Globe, 
  Store, 
  Check, 
  ExternalLink,
  Layers,
  AlertCircle
} from 'lucide-react';
import { SupplyOrder, OrderItem, OrderStage, PurchaseMethod } from '../types/order';
import { STAGES_CONFIG, formatCurrency, normalizeBranch, computeOrderPurchaseMethod } from '../utils/orderUtils';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SupplyOrder | null;
  onSaveOrder: (updatedOrder: SupplyOrder) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onSaveOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [currentStage, setCurrentStage] = useState<OrderStage>('ORDERS');
  const [depotBranch, setDepotBranch] = useState<'GBTN' | 'LIGAO'>('GBTN');
  const [statusLabel, setStatusLabel] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  // When order changes, populate form
  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || '');
      setCurrentStage(order.currentStage || 'ORDERS');
      setDepotBranch(normalizeBranch(order.depotBranch));
      setStatusLabel(order.statusLabel || order.badgeText || 'In Progress');

      const initialItems: OrderItem[] = (order.items && order.items.length > 0)
        ? order.items.map((it, idx) => ({
            id: it.id || `it-${order.id}-${idx + 1}`,
            sku: it.sku || `SKU-${idx + 1}`,
            name: it.name,
            quantityRequested: it.quantityRequested,
            unit: it.unit || 'pcs',
            unitPrice: it.unitPrice,
            totalPrice: it.totalPrice || it.quantityRequested * it.unitPrice,
            depotBranch: normalizeBranch(it.depotBranch || order.depotBranch),
            purchaseMethod: it.purchaseMethod || (idx % 2 === 0 ? 'ONLINE' : 'NOT_ONLINE'),
            stockStatus: it.stockStatus || 'Available in Depot'
          }))
        : [
            {
              id: `it-${order.id}-1`,
              sku: `DEPOT-${order.id.slice(-4)}`,
              name: order.itemName,
              quantityRequested: order.quantity,
              unit: order.unit,
              unitPrice: order.unitPrice,
              totalPrice: order.totalPrice,
              depotBranch: normalizeBranch(order.depotBranch),
              purchaseMethod: 'ONLINE',
              stockStatus: 'Available in Depot'
            }
          ];

      setItems(initialItems);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  // Handle item modification
  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      
      if (field === 'quantityRequested' || field === 'unitPrice') {
        const qty = field === 'quantityRequested' ? Number(value) : item.quantityRequested;
        const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
        item.totalPrice = Math.max(0, qty) * Math.max(0, price);
      }
      
      updated[index] = item;
      return updated;
    });
  };

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `it-${Date.now()}-${items.length + 1}`,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name: '',
      quantityRequested: 1,
      unit: 'pcs',
      unitPrice: 100,
      totalPrice: 100,
      depotBranch: depotBranch,
      purchaseMethod: 'ONLINE',
      stockStatus: 'Available in Depot'
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('An order must have at least one item.');
      return;
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, it) => sum + (it.quantityRequested * it.unitPrice), 0);
  };

  const calculateTotalQuantity = () => {
    return items.reduce((sum, it) => sum + Number(it.quantityRequested || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }

    const validItems = items.filter((it) => it.name.trim().length > 0);
    if (validItems.length === 0) {
      alert('Please specify at least one valid item name.');
      return;
    }

    const grandTotal = calculateTotal();
    const totalQty = calculateTotalQuantity();
    const primaryItemName = validItems[0]?.name || order.itemName;
    const computedPurchase = computeOrderPurchaseMethod(validItems);

    const updatedOrder: SupplyOrder = {
      ...order,
      customerName: customerName.trim(),
      customerRole: undefined,
      department: undefined,
      currentStage,
      depotBranch,
      statusLabel: statusLabel.trim() || 'In Progress',
      totalPrice: grandTotal,
      quantity: totalQty,
      quantityDisplay: `Qty: ${totalQty} ${validItems[0]?.unit || 'pcs'}`,
      itemName: primaryItemName,
      unit: validItems[0]?.unit || 'pcs',
      unitPrice: validItems[0]?.unitPrice || 0,
      purchaseMethod: computedPurchase,
      items: validItems,
      updatedAt: new Date().toISOString()
    };

    onSaveOrder(updatedOrder);
    onClose();
  };

  const totalCalculated = calculateTotal();
  const onlineItemsCount = items.filter((it) => it.purchaseMethod === 'ONLINE').length;
  const notOnlineItemsCount = items.filter((it) => it.purchaseMethod === 'NOT_ONLINE').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0A1628] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1D6FEB] flex items-center justify-center text-white shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">
                  Edit Order: {order.orderNumber}
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {order.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Update customer details, depot branch (GBTN/LIGAO), stages, and item purchase methods
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
          
          {/* Section 1: Customer Information */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#1D6FEB]" />
              Customer Information
            </h4>
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Greenfield ES, Maria Santos"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1D6FEB] bg-white font-medium text-xs"
              />
            </div>
          </div>

          {/* Section 2: Flow Stage & Depot Branch (GBTN vs LIGAO) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Stage Selector */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current Flow Stage
              </label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value as OrderStage)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1D6FEB] bg-white font-bold text-xs text-slate-800"
              >
                <option value="ORDERS">1. ORDERS (New Order Intake)</option>
                <option value="IDENTIFICATION_OF_STOCKS">2. IDENTIFICATION OF STOCKS (7 Stars Depot)</option>
                <option value="PRICING">3. PRICING (Price Review)</option>
                <option value="PURCHASING">4. PURCHASING (Online & In-Store Procurement)</option>
                <option value="READY_FOR_DELIVERY">5. READY FOR DELIVERY</option>
                <option value="COMPLETED">Completed (Archived)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                You can also drag and drop the card between stages on the board.
              </p>
            </div>

            {/* Depot Branch Selection: GBTN vs LIGAO */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-cyan-600" />
                  Identification Branch (7 Stars Depot)
                </label>
                <a
                  href="https://7starsdepot.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                >
                  <span>Check Stocks</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setDepotBranch('GBTN')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                    depotBranch === 'GBTN'
                      ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Guinobatan Branch</span>
                  {depotBranch === 'GBTN' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDepotBranch('LIGAO')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                    depotBranch === 'LIGAO'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>LIGAO Branch</span>
                  {depotBranch === 'LIGAO' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Divides order stock matching between GBTN and LIGAO Depot facilities.
              </p>
            </div>

          </div>

          {/* Section 3: Requisition Items & Purchase Channel (Online vs Not Online) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Requisition Items ({items.length})
                </h4>
                <p className="text-[10px] text-slate-500">
                  Manage individual supply items. In Purchasing, specify whether each item is Bought Online or Not Online.
                </p>
              </div>

              {/* Quick Online vs Not Online item stats */}
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  🌐 Online: {onlineItemsCount}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  🏬 Not Online: {notOnlineItemsCount}
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1D6FEB] hover:bg-blue-600 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Items Table / Row List */}
            <div className="space-y-3">
              {items.map((item, idx) => {
                const itemTotal = Number(item.quantityRequested || 0) * Number(item.unitPrice || 0);
                const isOnline = item.purchaseMethod === 'ONLINE';

                return (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center border border-slate-200">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-800">
                          Item #{idx + 1}
                        </span>
                      </div>

                      {/* Online vs Not Online Toggle */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleItemChange(idx, 'purchaseMethod', 'ONLINE')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border ${
                            isOnline
                              ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-2xs'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-purple-50'
                          }`}
                          title="Item is bought online via 7 Stars Depot portal / E-commerce"
                        >
                          <Globe className="w-3 h-3 text-purple-600" />
                          <span>Bought Online</span>
                          {isOnline && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleItemChange(idx, 'purchaseMethod', 'NOT_ONLINE')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border ${
                            !isOnline
                              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50'
                          }`}
                          title="Item is bought in-store / walk-in direct depot purchase (Not Online)"
                        >
                          <Store className="w-3 h-3 text-amber-600" />
                          <span>Not Online (In-Store)</span>
                          {!isOnline && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition ml-1 cursor-pointer"
                            title="Remove this item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                      
                      {/* Name */}
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Item Description / Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Continuous Laptop Paper"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1D6FEB] text-xs font-medium"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantityRequested}
                          onChange={(e) => handleItemChange(idx, 'quantityRequested', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1D6FEB] text-xs font-bold text-right"
                        />
                      </div>

                      {/* Unit */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Unit
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1D6FEB] text-xs bg-white font-medium"
                        >
                          <option value="pcs">pcs</option>
                          <option value="reams">reams</option>
                          <option value="boxes">boxes</option>
                          <option value="sets">sets</option>
                          <option value="rolls">rolls</option>
                          <option value="bottles">bottles</option>
                          <option value="packs">packs</option>
                        </select>
                      </div>

                      {/* Unit Price (₱) */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Price (₱) & Subtotal
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                            className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1D6FEB] text-xs font-bold text-right"
                          />
                          <span className="font-extrabold text-slate-900 text-xs truncate">
                            = {formatCurrency(itemTotal)}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Depot branch assignment for this item */}
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold">Stock Depot:</span>
                        <button
                          type="button"
                          onClick={() => handleItemChange(idx, 'depotBranch', 'GBTN')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            normalizeBranch(item.depotBranch) === 'GBTN'
                              ? 'bg-cyan-100 text-cyan-800 font-extrabold'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          GBTN
                        </button>
                        <button
                          type="button"
                          onClick={() => handleItemChange(idx, 'depotBranch', 'LIGAO')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            normalizeBranch(item.depotBranch) === 'LIGAO'
                              ? 'bg-teal-100 text-teal-800 font-extrabold'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          LIGAO
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400">
                        SKU: <span className="font-mono text-slate-600">{item.sku || 'DEPOT-ITEM'}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Grand Total Summary Box */}
          <div className="bg-[#EFF6FF] border border-blue-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#1D4ED8] tracking-wider block">
                Calculated Requisition Grand Total
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {items.length} unique item line{items.length > 1 ? 's' : ''} • {calculateTotalQuantity()} total units
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-[#1D6FEB] block tracking-tight">
                {formatCurrency(totalCalculated)}
              </span>
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Changes will be saved and preserved for this order.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1D6FEB] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs transition shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
