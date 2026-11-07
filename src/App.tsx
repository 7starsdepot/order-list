/**
 * Supply Order Monitoring System
 * Dashboard Recreated Exactly From User Reference Design
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MetricCards } from './components/MetricCards';
import { OrderProcessingFlow } from './components/OrderProcessingFlow';
import { BottomPanels } from './components/BottomPanels';
import { SupplyOrder, OrderStage, InventoryItem, SystemAlert } from './types/order';
import { INITIAL_ORDERS, INVENTORY_ITEMS, SYSTEM_ALERTS } from './data/mockData';
import { loadSavedOrders, saveOrdersToStorage, STAGES_CONFIG } from './utils/orderUtils';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<SupplyOrder[]>(() => loadSavedOrders(INITIAL_ORDERS));
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);
  
  // Selected order for the bottom center "Selected Order Details" panel
  // Default to SO-2025-0018 as shown in the screenshot
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    const found = INITIAL_ORDERS.find((o) => o.orderNumber === 'SO-2025-0018');
    return found ? found.id : INITIAL_ORDERS[0].id;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Drag and drop stage move handler
  const handleMoveOrder = (orderId: string, targetStage: OrderStage) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.currentStage === targetStage) return;

    let newBadge = order.badgeText;
    let newStatusLabel = order.statusLabel;

    if (targetStage === 'STOCKS_AVAILABLE') {
      newBadge = 'In Stock';
      newStatusLabel = 'In Progress';
    } else if (targetStage === 'PRICING') {
      newBadge = 'Review Price';
      newStatusLabel = 'Price Review';
    } else if (targetStage === 'PURCHASING') {
      newBadge = 'In Purchase';
      newStatusLabel = 'In Purchase';
    } else if (targetStage === 'READY_FOR_DELIVERY') {
      newBadge = 'Ready';
      newStatusLabel = 'Ready for Delivery';
    }

    const updatedOrder: SupplyOrder = {
      ...order,
      currentStage: targetStage,
      badgeText: newBadge,
      statusLabel: newStatusLabel,
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    setSelectedOrderId(orderId);
    showToast(`${order.orderNumber} (${order.itemName}) moved to ${STAGES_CONFIG[targetStage]?.label || targetStage}!`);
  };

  // Mark an order as completed when dropped on or clicked in the "Order Completed!" box
  const handleOrderCompleted = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedOrder: SupplyOrder = {
      ...order,
      currentStage: 'COMPLETED',
      badgeText: 'Completed',
      statusLabel: 'Completed',
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    
    // Add completed alert
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      type: 'success',
      title: `${order.orderNumber} delivered Successfully`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString()
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast(`🎉 Order ${order.orderNumber} completed and marked delivered!`);
  };

  // Calculations for KPI Cards
  const totalStockItems = inventory.reduce((sum, item) => sum + item.stockCount, 0);
  const ongoingOrdersCount = orders.filter((o) => o.currentStage !== 'COMPLETED').length;
  const completedOrdersCount = orders.filter((o) => o.currentStage === 'COMPLETED').length + 15; // with historical baseline

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#0A1628] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Left Dark Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'dashboard') {
            showToast(`Navigated to ${tab.charAt(0).toUpperCase() + tab.slice(1)} view.`);
          }
        }}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-7 flex flex-col gap-6 overflow-y-auto max-w-7xl">
        
        {/* Top Header */}
        <TopHeader
          onAvatarClick={() => showToast('Admin Profile: Active Administrator Session')}
        />

        {/* 4 Metric KPI Cards */}
        <MetricCards
          totalItemsInStock={245}
          totalValueInStock="₱12,860"
          ongoingOrders={ongoingOrdersCount}
          completedOrders={completedOrdersCount}
        />

        {/* Center: Order Processing Flow (4 Columns with Drag & Drop) */}
        <OrderProcessingFlow
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={(ord) => setSelectedOrderId(ord.id)}
          onMoveOrder={handleMoveOrder}
          onOrderCompleted={handleOrderCompleted}
        />

        {/* Bottom 3 Panels: Inventory Overview | Selected Order Details | Alerts */}
        <BottomPanels
          inventory={inventory}
          selectedOrder={selectedOrder}
          alerts={alerts}
          onViewAllInventory={() => showToast('Displaying complete warehouse inventory ledger.')}
          onViewAllAlerts={() => showToast('All system logs and alerts up to date.')}
        />

      </main>

    </div>
  );
}
