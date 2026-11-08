import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Package, 
  Building, 
  Clock, 
  Tag, 
  ExternalLink, 
  FileText, 
  RefreshCw,
  X,
  Store,
  ChevronDown,
  Layers,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { SupplyOrder } from '../types/order';
import { formatCurrency } from '../utils/orderUtils';

interface OrderHistoryViewProps {
  orders: SupplyOrder[];
  onBackToDashboard: () => void;
  onSelectOrderForDetails: (order: SupplyOrder) => void;
  onReorder?: (order: SupplyOrder) => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onBackToDashboard,
  onSelectOrderForDetails,
  onReorder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | '7DAYS' | '30DAYS'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRICE_DESC' | 'PRICE_ASC'>('NEWEST');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<SupplyOrder | null>(null);

  // Filter only completed orders (currentStage === 'COMPLETED')
  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.currentStage === 'COMPLETED');
  }, [orders]);

  // Extract distinct departments from completed orders
  const departments = useMemo(() => {
    const deps = new Set<string>();
    completedOrders.forEach((o) => {
      if (o.department) deps.add(o.department);
    });
    return Array.from(deps);
  }, [completedOrders]);

  // Filter & sort logic
  const filteredOrders = useMemo(() => {
    return completedOrders
      .filter((order) => {
        // Search filter
        const query = searchTerm.toLowerCase().trim();
        const matchesQuery = 
          !query ||
          (order.customerName && order.customerName.toLowerCase().includes(query)) ||
          order.orderNumber.toLowerCase().includes(query) ||
          order.itemName.toLowerCase().includes(query) ||
          (order.department && order.department.toLowerCase().includes(query)) ||
          (order.depotBranch && order.depotBranch.toLowerCase().includes(query)) ||
          (order.deliveryNotes && order.deliveryNotes.toLowerCase().includes(query));

        // Department filter
        const matchesDepartment = 
          selectedDepartment === 'ALL' || order.department === selectedDepartment;

        // Date filter
        let matchesDate = true;
        if (dateFilter !== 'ALL') {
          const orderDate = new Date(order.completedAt || order.updatedAt);
          const now = new Date();
          const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
          if (dateFilter === '7DAYS') matchesDate = diffDays <= 7;
          if (dateFilter === '30DAYS') matchesDate = diffDays <= 30;
        }

        return matchesQuery && matchesDepartment && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          const dateA = new Date(a.completedAt || a.updatedAt).getTime();
          const dateB = new Date(b.completedAt || b.updatedAt).getTime();
          return dateB - dateA;
        }
        if (sortBy === 'OLDEST') {
          const dateA = new Date(a.completedAt || a.updatedAt).getTime();
          const dateB = new Date(b.completedAt || b.updatedAt).getTime();
          return dateA - dateB;
        }
        if (sortBy === 'PRICE_DESC') {
          return b.totalPrice - a.totalPrice;
        }
        if (sortBy === 'PRICE_ASC') {
          return a.totalPrice - b.totalPrice;
        }
        return 0;
      });
  }, [completedOrders, searchTerm, selectedDepartment, dateFilter, sortBy]);

  // Aggregated KPI Stats
  const totalCompletedValue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  }, [completedOrders]);

  const avgOrderValue = useMemo(() => {
    if (completedOrders.length === 0) return 0;
    return totalCompletedValue / completedOrders.length;
  }, [completedOrders, totalCompletedValue]);

  // Format timestamp helper
  const formatTimestamp = (iso?: string) => {
    if (!iso) return 'Nov 10, 2025 • 10:24 AM';
    try {
      const date = new Date(iso);
      if (isNaN(date.getTime())) return iso;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' • ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  // Relative time helper
  const getRelativeTime = (iso?: string) => {
    if (!iso) return 'Recently';
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (completedOrders.length === 0) return;

    const headers = [
      'Order Number',
      'Customer Name',
      'Item Name',
      'Quantity',
      'Unit',
      'Unit Price (PHP)',
      'Total Price (PHP)',
      'Final Status',
      'Completed Timestamp',
      'Department',
      'Depot Branch'
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderNumber}"`,
      `"${(o.customerName || 'Maria Santos').replace(/"/g, '""')}"`,
      `"${o.itemName.replace(/"/g, '""')}"`,
      o.quantity,
      `"${o.unit}"`,
      o.unitPrice,
      o.totalPrice,
      `"${o.statusLabel || 'Delivered'}"`,
      `"${o.completedAt || o.updatedAt}"`,
      `"${o.department || 'General'}"`,
      `"${o.depotBranch || '7 Stars Depot'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `7stars_order_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner & Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToDashboard}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Board</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#1D6FEB] uppercase tracking-wider">
              Procurement Archive
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Searchable log of all completed and delivered supply orders with final status and fulfillment timestamps.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Download completed order history as CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completed */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Completed Orders
            </span>
            <span className="text-2xl font-black text-emerald-950 tracking-tight mt-0.5 block">
              {completedOrders.length}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
              100% Fulfilled & Verified
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 rounded-2xl p-4 border border-blue-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Total Delivered Value
            </span>
            <span className="text-2xl font-black text-blue-950 tracking-tight mt-0.5 block">
              {formatCurrency(totalCompletedValue)}
            </span>
            <span className="text-[10px] font-semibold text-blue-700 mt-1 block">
              In Philippine Pesos (₱)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1D6FEB] text-white flex items-center justify-center shadow-sm">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Average Value */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 rounded-2xl p-4 border border-purple-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
              Average Order Value
            </span>
            <span className="text-2xl font-black text-purple-950 tracking-tight mt-0.5 block">
              {formatCurrency(avgOrderValue)}
            </span>
            <span className="text-[10px] font-semibold text-purple-700 mt-1 block">
              Across all departments
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* 7 Stars Depot Fulfillment */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/40 rounded-2xl p-4 border border-cyan-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
              Depot Supplier
            </span>
            <span className="text-base font-black text-cyan-950 tracking-tight mt-0.5 block">
              7 Stars Depot
            </span>
            <a
              href="https://7starsdepot.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-0.5 mt-1"
            >
              <span>Guinobatan & Ligao Branches</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
            <Store className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Navy Header Strip with Counter */}
        <div className="bg-[#0A1628] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white shadow-xs">
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              Delivered Orders Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs border border-slate-700">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            Status: <span className="text-emerald-400 font-bold">100% Delivered</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order # (e.g. SO-2025-0014), item name, or department..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#1D6FEB] focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-800 placeholder-slate-400 text-xs shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorters */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Department Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Date Range Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Dates</option>
                <option value="7DAYS">Past 7 Days</option>
                <option value="30DAYS">Past 30 Days</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer text-xs"
              >
                <option value="NEWEST">Completed: Newest First</option>
                <option value="OLDEST">Completed: Oldest First</option>
                <option value="PRICE_DESC">Amount: High to Low</option>
                <option value="PRICE_ASC">Amount: Low to High</option>
              </select>
            </div>

            {/* Reset Filters button if any active */}
            {(searchTerm || selectedDepartment !== 'ALL' || dateFilter !== 'ALL' || sortBy !== 'NEWEST') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('ALL');
                  setDateFilter('ALL');
                  setSortBy('NEWEST');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 cursor-pointer"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No completed orders found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {searchTerm || selectedDepartment !== 'ALL' || dateFilter !== 'ALL'
                  ? 'No completed orders matched your selected filter criteria. Try resetting your search filters.'
                  : 'Orders that reach the "Order Completed!" checkpoint will be logged into this archive with their final status and timestamp.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Supply Item & Details</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Total Amount (₱)</th>
                  <th className="py-3 px-4">Final Status</th>
                  <th className="py-3 px-4">Completed Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const timestampStr = formatTimestamp(order.completedAt || order.updatedAt);
                  const relTime = getRelativeTime(order.completedAt || order.updatedAt);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* Order Number & Customer Name */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 group-hover:border-blue-300 transition block w-fit font-mono text-xs">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 block mt-1 font-sans">
                          {order.customerName || 'Maria Santos'}
                        </span>
                      </td>

                      {/* Item & Specs */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-[#1D6FEB] transition">
                            {order.itemName}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{order.quantityDisplay}</span>
                            <span>•</span>
                            <span>{formatCurrency(order.unitPrice)} each</span>
                            {order.depotBranch && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-0.5 text-cyan-700 font-semibold">
                                  <Store className="w-3 h-3 text-cyan-600" />
                                  <span>{order.depotBranch}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{order.department || 'Administrative'}</span>
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatCurrency(order.totalPrice)}
                        </span>
                      </td>

                      {/* Final Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{order.statusLabel || 'Delivered'}</span>
                        </span>
                      </td>

                      {/* Completion Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{timestampStr}</span>
                          </span>
                          {relTime && (
                            <span className="text-[10px] text-slate-400 font-mono ml-4">
                              ({relTime})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1D6FEB] font-bold text-xs transition cursor-pointer"
                            title="View official fulfillment invoice and delivery proof"
                          >
                            Receipt
                          </button>
                          {onReorder && (
                            <button
                              onClick={() => onReorder(order)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              title="Requisition this item again in Orders"
                            >
                              <RefreshCw className="w-3 h-3 text-slate-500" />
                              <span>Reorder</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Fulfillment Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#0A1628] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Delivery Fulfillment Receipt</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedReceiptOrder.orderNumber} • 7 Stars Depot Certified
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700">
              
              {/* Status Header Pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order Completed & Delivered</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  {formatTimestamp(selectedReceiptOrder.completedAt || selectedReceiptOrder.updatedAt)}
                </span>
              </div>

              {/* Item Information Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {selectedReceiptOrder.itemName}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedReceiptOrder.description || 'Standard office and classroom supply requisition.'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                    {selectedReceiptOrder.orderNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-600 font-medium text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Quantity:</span>
                    <span className="font-bold text-slate-800">{selectedReceiptOrder.quantityDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Unit Price:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(selectedReceiptOrder.unitPrice)} each</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department:</span>
                    <span className="font-bold text-slate-800">{selectedReceiptOrder.department || 'Administrative'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Depot Branch:</span>
                    <span className="font-bold text-cyan-800">{selectedReceiptOrder.depotBranch || '7 Stars Depot'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                  <span className="text-xs">Total Amount Paid:</span>
                  <span className="text-base text-[#1D6FEB]">{formatCurrency(selectedReceiptOrder.totalPrice)}</span>
                </div>
              </div>

              {/* Delivery Verification Notes */}
              <div className="text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Fulfillment Verification:</span>
                <p className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-700 italic">
                  {selectedReceiptOrder.deliveryNotes || 'Item verified in physical inventory, paid via 7 Stars Depot checkout, and signed for upon delivery.'}
                </p>
              </div>

              {/* Depot External Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">Supplier Reference:</span>
                <a
                  href={selectedReceiptOrder.depotUrl || 'https://7starsdepot.netlify.app/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1"
                >
                  <span>7starsdepot.netlify.app</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onReorder) onReorder(selectedReceiptOrder);
                  setSelectedReceiptOrder(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-order This Supply</span>
              </button>

              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-1.5 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
