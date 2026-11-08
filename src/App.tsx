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
import { CreateOrderModal } from './components/CreateOrderModal';
import { SupplyOrder, OrderStage, InventoryItem, SystemAlert, PurchaseMethod } from './types/order';
import { INITIAL_ORDERS, INVENTORY_ITEMS, SYSTEM_ALERTS } from './data/mockData';
import { 
  loadSavedOrders, 
  saveOrdersToStorage, 
  loadLastSelectedOrderId, 
  saveLastSelectedOrderId,
  loadSavedInventory,
  saveInventoryToStorage,
  loadSavedAlerts,
  saveAlertsToStorage,
  loadLastEditedTime,
  STAGES_CONFIG 
} from './utils/orderUtils';
import { CheckCircle2, X } from 'lucide-react';

import { OrderHistoryView } from './components/OrderHistoryView';
import { EditOrderModal } from './components/EditOrderModal';
import { normalizeBranch, computeOrderPurchaseMethod } from './utils/orderUtils';

export default function App() {
  // Always open on the last edited data, never reinitializing to defaults
  const [orders, setOrders] = useState<SupplyOrder[]>(() => loadSavedOrders(INITIAL_ORDERS));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadSavedInventory(INVENTORY_ITEMS));
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => loadSavedAlerts(SYSTEM_ALERTS));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SupplyOrder | null>(null);
  
  // Selected order preserved from last edited session
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    const savedOrders = loadSavedOrders(INITIAL_ORDERS);
    return loadLastSelectedOrderId(savedOrders, savedOrders[0]?.id || 'ord-0018');
  });

  const [lastEditedTime, setLastEditedTime] = useState<string>(() => loadLastEditedTime());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync orders and last edited timestamp to local storage
  useEffect(() => {
    saveOrdersToStorage(orders);
    setLastEditedTime(loadLastEditedTime());
  }, [orders]);

  // Sync selected order to local storage
  useEffect(() => {
    if (selectedOrderId) {
      saveLastSelectedOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  // Sync inventory to local storage
  useEffect(() => {
    saveInventoryToStorage(inventory);
  }, [inventory]);

  // Sync alerts to local storage
  useEffect(() => {
    saveAlertsToStorage(alerts);
  }, [alerts]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Drag and drop stage move handler with branch division support
  const handleMoveOrder = (orderId: string, targetStage: OrderStage, targetBranch?: 'GBTN' | 'LIGAO') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let newBadge = order.badgeText;
    let newStatusLabel = order.statusLabel;

    if (targetStage === 'ORDERS') {
      newBadge = 'New Order';
      newStatusLabel = 'New Intake';
    } else if (targetStage === 'IDENTIFICATION_OF_STOCKS') {
      newBadge = 'Stock Identified';
      newStatusLabel = 'Stocks Identified';
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

    const resolvedBranch = targetBranch || (order.depotBranch ? normalizeBranch(order.depotBranch) : 'GBTN');

    const updatedOrder: SupplyOrder = {
      ...order,
      currentStage: targetStage,
      badgeText: newBadge,
      statusLabel: newStatusLabel,
      updatedAt: new Date().toISOString(),
      depotUrl: 'https://7starsdepot.netlify.app/',
      depotBranch: resolvedBranch,
      items: (order.items || []).map((it) => ({
        ...it,
        depotBranch: resolvedBranch
      }))
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    setSelectedOrderId(orderId);
    showToast(`${order.orderNumber} (${order.customerName}) moved to ${STAGES_CONFIG[targetStage]?.label || targetStage} (${resolvedBranch})!`);
  };

  // Open edit modal for an order
  const handleOpenEditOrder = (order: SupplyOrder) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  // Save changes from EditOrderModal
  const handleSaveEditedOrder = (updatedOrder: SupplyOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setSelectedOrderId(updatedOrder.id);
    showToast(`✓ Order ${updatedOrder.orderNumber} for ${updatedOrder.customerName} successfully updated!`);
  };

  // Quick 1-click toggle branch between GBTN and LIGAO in Identification stage
  const handleToggleBranch = (orderId: string, branch: 'GBTN' | 'LIGAO') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = (o.items || []).map((it) => ({
          ...it,
          depotBranch: branch
        }));
        return {
          ...o,
          depotBranch: branch,
          items: updatedItems,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast(`Order assigned to ${branch === 'LIGAO' ? 'LIGAO Branch' : 'GBTN (Guinobatan Branch)'}`);
  };

  // Quick toggle between Online and Not Online for an item in Purchasing
  const handleToggleItemPurchaseMethod = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = (o.items || []).map((it) => {
          if (it.id !== itemId) return it;
          const nextMethod: PurchaseMethod = it.purchaseMethod === 'ONLINE' ? 'NOT_ONLINE' : 'ONLINE';
          return { ...it, purchaseMethod: nextMethod };
        });
        const computedMode = computeOrderPurchaseMethod(updatedItems);
        return {
          ...o,
          purchaseMethod: computedMode,
          items: updatedItems,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast('Toggled item purchase mode (Online ⇄ In-Store)');
  };

  const handleCreateOrder = (newOrder: SupplyOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    showToast(`Order ${newOrder.orderNumber} created in ${STAGES_CONFIG[newOrder.currentStage]?.label || 'ORDERS'}!`);
  };

  // Mark an order as completed when dropped on or clicked in the "Order Completed!" box
  const handleOrderCompleted = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const completedTimestamp = new Date().toISOString();

    const updatedOrder: SupplyOrder = {
      ...order,
      currentStage: 'COMPLETED',
      badgeText: 'Completed',
      statusLabel: 'Delivered',
      updatedAt: completedTimestamp,
      completedAt: completedTimestamp,
      deliveryNotes: order.deliveryNotes || 'Delivered and verified at recipient department.'
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    
    // Add completed alert
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      type: 'success',
      title: `${order.orderNumber} delivered Successfully`,
      timeAgo: 'Just now',
      timestamp: completedTimestamp
    };
    setAlerts((prev) => [newAlert, ...prev]);

    showToast(`🎉 Order ${order.orderNumber} completed & archived! Check Order History.`);
  };

  // Reorder an item from Order History
  const handleReorder = (completedOrder: SupplyOrder) => {
    const formattedNum = String(orders.length + 26).padStart(4, '0');
    const newOrder: SupplyOrder = {
      ...completedOrder,
      id: `ord-${Date.now()}`,
      orderNumber: `SO-2025-${formattedNum}`,
      currentStage: 'ORDERS',
      badgeText: 'New Order',
      statusLabel: 'Reordered Intake',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: undefined
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setCurrentTab('dashboard');
    showToast(`Re-ordered ${newOrder.itemName} as ${newOrder.orderNumber} into Orders!`);
  };

  // Calculations for KPI Cards
  const ongoingOrdersCount = orders.filter((o) => o.currentStage !== 'COMPLETED').length;
  const completedOrdersList = orders.filter((o) => o.currentStage === 'COMPLETED');
  const completedOrdersCount = completedOrdersList.length;

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

      {/* Left Dark Sidebar with Order History Tab & Completed Count */}
      <Sidebar
        currentTab={currentTab}
        completedCount={completedOrdersCount}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'dashboard' && tab !== 'history') {
            showToast(`Navigated to ${tab.charAt(0).toUpperCase() + tab.slice(1)} view.`);
          }
        }}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-7 flex flex-col gap-6 overflow-y-auto max-w-7xl">
        
        {/* Top Header */}
        <TopHeader
          lastEditedTime={lastEditedTime}
          onAvatarClick={() => showToast('Admin Profile: Active Administrator Session')}
        />

        {/* Tab Routing */}
        {currentTab === 'history' ? (
          /* Order History View */
          <OrderHistoryView
            orders={orders}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onSelectOrderForDetails={(ord) => {
              setSelectedOrderId(ord.id);
              setCurrentTab('dashboard');
            }}
            onReorder={handleReorder}
          />
        ) : (
          /* Main Dashboard: Metrics + Flow + Bottom Panels */
          <>
            {/* 4 Metric KPI Cards */}
            <MetricCards
              totalItemsInStock={245}
              totalValueInStock="₱12,860"
              ongoingOrders={ongoingOrdersCount}
              completedOrders={completedOrdersCount}
            />

            {/* Center: Order Processing Flow (5 Columns with Drag & Drop & 7 Stars Depot Integration) */}
            <OrderProcessingFlow
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={(ord) => setSelectedOrderId(ord.id)}
              onMoveOrder={handleMoveOrder}
              onOrderCompleted={handleOrderCompleted}
              onCreateNewOrder={() => setIsCreateModalOpen(true)}
              onEditOrder={handleOpenEditOrder}
              onToggleBranch={handleToggleBranch}
              onToggleItemPurchaseMethod={handleToggleItemPurchaseMethod}
            />

            {/* Bottom 3 Panels: Inventory Overview | Selected Order Details | Alerts */}
            <BottomPanels
              inventory={inventory}
              selectedOrder={selectedOrder}
              alerts={alerts}
              onViewAllInventory={() => showToast('Displaying complete warehouse inventory ledger.')}
              onViewAllAlerts={() => setCurrentTab('history')}
              onEditOrder={handleOpenEditOrder}
            />
          </>
        )}

      </main>

      {/* Modal for Creating New Orders */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateOrder={handleCreateOrder}
        nextOrderIndex={orders.length + 25}
      />

      {/* Modal for Editing Existing Orders */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingOrder(null);
        }}
        order={editingOrder}
        onSaveOrder={handleSaveEditedOrder}
      />

    </div>
  );
}
