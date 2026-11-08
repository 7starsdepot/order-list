import { OrderStage, SupplyOrder, CardBadgeType } from '../types/order';

export interface StageConfig {
  id: OrderStage;
  stepNumber: number;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  borderColor: string;
  numberBg: string;
}

export const STAGES_CONFIG: Record<OrderStage, StageConfig> = {
  ORDERS: {
    id: 'ORDERS',
    stepNumber: 1,
    label: 'ORDERS',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    headerBg: 'bg-[#EFF6FF]',
    borderColor: 'border-[#2563EB]',
    numberBg: 'bg-[#1D6FEB]'
  },
  IDENTIFICATION_OF_STOCKS: {
    id: 'IDENTIFICATION_OF_STOCKS',
    stepNumber: 2,
    label: 'IDENTIFICATION OF STOCKS',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    headerBg: 'bg-[#ECFEFF]',
    borderColor: 'border-[#0891B2]',
    numberBg: 'bg-[#0891B2]'
  },
  PRICING: {
    id: 'PRICING',
    stepNumber: 3,
    label: 'PRICING',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    headerBg: 'bg-[#E8F8F0]',
    borderColor: 'border-[#10B981]',
    numberBg: 'bg-[#10B981]'
  },
  PURCHASING: {
    id: 'PURCHASING',
    stepNumber: 4,
    label: 'PURCHASING',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    headerBg: 'bg-[#FFF3E6]',
    borderColor: 'border-[#F97316]',
    numberBg: 'bg-[#F97316]'
  },
  READY_FOR_DELIVERY: {
    id: 'READY_FOR_DELIVERY',
    stepNumber: 5,
    label: 'READY FOR DELIVERY',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-[#F3E8FF]',
    borderColor: 'border-[#8B5CF6]',
    numberBg: 'bg-[#8B5CF6]'
  },
  COMPLETED: {
    id: 'COMPLETED',
    stepNumber: 6,
    label: 'COMPLETED',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-[#ECFDF5]',
    borderColor: 'border-[#059669]',
    numberBg: 'bg-[#059669]'
  }
};

export const ORDERED_STAGES: OrderStage[] = [
  'ORDERS',
  'IDENTIFICATION_OF_STOCKS',
  'PRICING',
  'PURCHASING',
  'READY_FOR_DELIVERY'
];

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return `₱${formatted}`;
}

export function getBadgeStyle(badge: CardBadgeType | string): {
  bg: string;
  text: string;
  border?: string;
} {
  switch (badge) {
    case 'New Order':
      return {
        bg: 'bg-[#EFF6FF]',
        text: 'text-[#1D4ED8]',
        border: 'border-[#BFDBFE]'
      };
    case 'Pending Intake':
      return {
        bg: 'bg-[#F1F5F9]',
        text: 'text-[#475569]',
        border: 'border-[#CBD5E1]'
      };
    case 'Stock Identified':
      return {
        bg: 'bg-[#ECFEFF]',
        text: 'text-[#0E7490]',
        border: 'border-[#A5F3FC]'
      };
    case 'Depot Matched':
      return {
        bg: 'bg-[#EEF2FF]',
        text: 'text-[#4338CA]',
        border: 'border-[#C7D2FE]'
      };
    case 'In Stock':
      return {
        bg: 'bg-[#E8F8EE]',
        text: 'text-[#16A34A]',
        border: 'border-[#BBF7D0]'
      };
    case 'Review Price':
      return {
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#D97706]',
        border: 'border-[#FDE68A]'
      };
    case 'Pending Price':
      return {
        bg: 'bg-[#F1F5F9]',
        text: 'text-[#475569]',
        border: 'border-[#E2E8F0]'
      };
    case 'In Purchase':
      return {
        bg: 'bg-[#F5F3FF]',
        text: 'text-[#7C3AED]',
        border: 'border-[#DDD6FE]'
      };
    case 'Processing':
    case '🛒 Processing':
      return {
        bg: 'bg-[#EFF6FF]',
        text: 'text-[#2563EB]',
        border: 'border-[#BFDBFE]'
      };
    case 'Ready':
      return {
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#15803D]',
        border: 'border-[#86EFAC]'
      };
    case 'Completed':
      return {
        bg: 'bg-[#DCFCE7]',
        text: 'text-[#15803D]',
        border: 'border-[#86EFAC]'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200'
      };
  }
}

const STORAGE_KEY = '7stars_order_monitoring_v4';
const SELECTED_ORDER_KEY = '7stars_last_selected_order_id';
const INVENTORY_KEY = '7stars_inventory_state';
const ALERTS_KEY = '7stars_alerts_state';
const LAST_EDITED_KEY = '7stars_last_edited_time';

const ALL_POSSIBLE_ORDER_KEYS = [
  STORAGE_KEY,
  '7stars_order_monitoring_v4',
  'supplyflow_dashboard_orders_v3',
  'supplyflow_dashboard_orders_v2',
  'supplyflow_dashboard_orders'
];

export function normalizeBranch(branch?: string): 'GBTN' | 'LIGAO' {
  if (!branch) return 'GBTN';
  const upper = branch.toUpperCase();
  if (upper.includes('LIGAO')) return 'LIGAO';
  return 'GBTN';
}

export function getBranchLabel(branch?: string): string {
  const norm = normalizeBranch(branch);
  return norm === 'LIGAO' ? 'Ligao Branch' : 'Guinobatan Branch';
}

export function computeOrderPurchaseMethod(items?: any[]): 'ONLINE' | 'NOT_ONLINE' | 'MIXED' {
  if (!items || items.length === 0) return 'ONLINE';
  const onlineCount = items.filter(it => it.purchaseMethod === 'ONLINE').length;
  const notOnlineCount = items.filter(it => it.purchaseMethod === 'NOT_ONLINE').length;
  if (onlineCount > 0 && notOnlineCount === 0) return 'ONLINE';
  if (notOnlineCount > 0 && onlineCount === 0) return 'NOT_ONLINE';
  return 'MIXED';
}

export function loadSavedOrders(fallback: SupplyOrder[]): SupplyOrder[] {
  try {
    for (const key of ALL_POSSIBLE_ORDER_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Migrate orders: ensure stage, customerName, items, depotBranch ('GBTN' | 'LIGAO'), and purchaseMethod exist
            return parsed.map((item: any, orderIdx: number) => {
              const stage = item.currentStage === 'STOCKS_AVAILABLE' ? 'IDENTIFICATION_OF_STOCKS' : item.currentStage;
              const badge = (item.currentStage === 'STOCKS_AVAILABLE' && item.badgeText === 'In Stock')
                ? 'Stock Identified'
                : item.badgeText;

              const customerName = item.customerName || (
                item.department?.includes('SNED') ? 'Teacher Karen Morales' :
                item.department?.includes('Registrar') ? 'Atty. Grace Villafuerte' :
                item.department?.includes('Curriculum') ? 'Elena Cruz' :
                item.department?.includes('Printing') ? 'Roberto De Guzman' :
                item.department?.includes('Finance') ? 'Cynthia Alvarez' :
                item.department?.includes('Faculty') ? 'Prof. Jonathan Dizon' :
                'Maria Santos'
              );

              const branch = normalizeBranch(item.depotBranch || (orderIdx % 2 === 1 ? 'LIGAO' : 'GBTN'));

              const items = (Array.isArray(item.items) && item.items.length > 0 ? item.items : [
                {
                  id: `${item.id}-item-1`,
                  name: item.itemName,
                  quantityRequested: item.quantity || 1,
                  unit: item.unit || 'pcs',
                  unitPrice: item.unitPrice || 0,
                  totalPrice: item.totalPrice || 0,
                  depotBranch: branch,
                  purchaseMethod: (orderIdx % 2 === 0 ? 'ONLINE' : 'NOT_ONLINE'),
                  stockStatus: 'Available in Depot'
                }
              ]).map((it: any, itIdx: number) => ({
                ...it,
                depotBranch: normalizeBranch(it.depotBranch || branch),
                purchaseMethod: it.purchaseMethod || (itIdx % 2 === 0 ? 'ONLINE' : 'NOT_ONLINE'),
                totalPrice: it.totalPrice || (it.quantityRequested * it.unitPrice)
              }));

              const purchaseMethod = item.purchaseMethod || computeOrderPurchaseMethod(items);

              return {
                ...item,
                currentStage: stage,
                badgeText: badge,
                customerName,
                customerRole: item.customerRole || 'Procurement Requestor',
                depotBranch: branch,
                purchaseMethod,
                items,
                depotUrl: item.depotUrl || 'https://7starsdepot.netlify.app/'
              };
            });
          }
        } catch {
          // Continue to next key
        }
      }
    }
    return fallback;
  } catch (e) {
    console.error('Failed to load orders from storage:', e);
    return fallback;
  }
}

export function saveOrdersToStorage(orders: SupplyOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem(LAST_EDITED_KEY, new Date().toISOString());
  } catch (e) {
    console.error('Failed to save orders to storage:', e);
  }
}

export function loadLastSelectedOrderId(availableOrders: SupplyOrder[], defaultId: string): string {
  try {
    const saved = localStorage.getItem(SELECTED_ORDER_KEY);
    if (saved && availableOrders.some((o) => o.id === saved)) {
      return saved;
    }
    // Return first available order or fallback
    return availableOrders[0]?.id || defaultId;
  } catch {
    return defaultId;
  }
}

export function saveLastSelectedOrderId(orderId: string): void {
  try {
    localStorage.setItem(SELECTED_ORDER_KEY, orderId);
  } catch (e) {
    console.error('Failed to save selected order ID:', e);
  }
}

export function loadSavedInventory(fallback: any[]): any[] {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveInventoryToStorage(inventory: any[]): void {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch (e) {
    console.error('Failed to save inventory:', e);
  }
}

export function loadSavedAlerts(fallback: any[]): any[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveAlertsToStorage(alerts: any[]): void {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts:', e);
  }
}

export function loadLastEditedTime(): string {
  try {
    const saved = localStorage.getItem(LAST_EDITED_KEY);
    if (saved) {
      const date = new Date(saved);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) + ' • ' + date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  } catch {
    // fallback
  }
  return 'Mon, Nov 10, 2025 • 10:24 AM';
}

